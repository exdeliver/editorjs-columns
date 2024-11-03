/**
 * Column Block for the Editor.js.
 *
 * @author Calum Knott (calum@calumk.com)
 * @copyright Calum Knott
 * @license The MIT License (MIT)
 */

/**
 * @typedef {Object} EditorJsColumnsData
 * @description Tool's input and output data format
 */

import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";

import icon from "./editorjs-columns.svg";
import style from "./editorjs-columns.scss";

// import EditorJS from '@editorjs/editorjs'; // required for npm mode

class EditorJsColumns {

	static get enableLineBreaks() {
		return true;
	}


	constructor({ data, config, api, readOnly }) {
		// console.log("API")
		// console.log(api)
		// start by setting up the required parts
		this.api = api;
		this.readOnly = readOnly;
		this.config = config || {}

		// console.log(this.config)

		// console.log(this.config.EditorJsLibrary)

		this._CSS = {
			block: this.api.styles.block,
			wrapper: "ce-EditorJsColumns",
		};

		if (!this.readOnly) {
			this.onKeyUp = this.onKeyUp.bind(this);
		}
		


		this._data = {};

		this.editors = {};

		this.colWrapper = undefined;

		this.editors.cols = [];

		this.data = data;

		if (!Array.isArray(this.data.cols)) {
			this.data.cols = [];
			this.editors.numberOfColumns = 1; // Change default to 1 column
		} else {
			this.editors.numberOfColumns = this.data.cols.length;
		}

	}

	static get isReadOnlySupported() {
		return true;
	}


	onKeyUp(e) {
		// console.log(e)
		// console.log("heyup")
		if (e.code !== "Backspace" && e.code !== "Delete") {
			return;
		}
	}

	get CSS() {
		return {
			settingsButton: this.api.styles.settingsButton,
			settingsButtonActive: this.api.styles.settingsButtonActive,
		};
	}


	renderSettings() {
		return [
			{
				icon: '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15 10.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1 0-1h9a.5.5 0 0 1 .5.5zm0 4a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1 0-1h9a.5.5 0 0 1 .5.5zm0-8a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1 0-1h9a.5.5 0 0 1 .5.5z"/></svg>',
				label: 'Manage Columns',
				onActivate: () => this._showColumnManager()
			}
		];
	}

	async _showColumnManager() {
		const layoutOptions = [
			{
				value: '1',
				label: '1 Column (100%)',
				icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
        </svg>`
			},
			{
				value: '1-1',
				label: '2 Columns (50/50)',
				icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="7" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="13" y="4" width="7" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
        </svg>`
			},
			{
				value: '2-1',
				label: '2 Columns (66/33)',
				icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="10" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="16" y="4" width="4" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
        </svg>`
			},
			{
				value: '1-2',
				label: '2 Columns (33/66)',
				icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="4" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="10" y="4" width="10" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
        </svg>`
			},
			{
				value: '1-1-1',
				label: '3 Columns (33/33/33)',
				icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="4" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="10" y="4" width="4" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="16" y="4" width="4" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
        </svg>`
			},
			{
				value: '3-6-3',
				label: '3 Columns (25/50/25)',
				icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="3" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="9" y="4" width="6" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="17" y="4" width="3" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
        </svg>`
			}
		];
		const inputOptions = {};
		layoutOptions.forEach(layout => {
			inputOptions[layout.value] = `<div class="layout-option">
            <span class="layout-icon">${layout.icon}</span>
            <span class="layout-label">${layout.label}</span>
        </div>`;
		});

		const result = await Swal.fire({
			title: 'Select Column Layout',
			input: 'radio',
			inputOptions: inputOptions,
			inputValidator: (value) => {
				if (!value) {
					return 'You need to choose something!';
				}
			},
			showCancelButton: true,
			customClass: {
				input: 'column-layout-radio',
				container: 'column-layout-container',
			},
			html: `
            <style>
                .column-layout-container .swal2-radio {
                    display: grid !important;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    padding: 20px;
                }
                .layout-option {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .layout-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                }
                .layout-icon svg {
                    width: 20px;
                    height: 20px;
                }
                .layout-label {
                    font-size: 14px;
                }
                .column-layout-radio {
                    margin: 10px;
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .column-layout-radio label:hover {
                    background: #f5f5f5;
                }
            </style>
        `
		});

		if (result.isConfirmed) {
			await this._applyColumnLayout(result.value);
		}
	}

	async _applyColumnLayout(layout) {
		this.colWrapper.classList.remove(
			'columns-layout-100',
			'columns-layout-50-50',
			'columns-layout-66-33',
			'columns-layout-33-66',
			'columns-layout-33-33-33',
			'columns-layout-25-50-25'
		);

		// Add new layout class
		this.colWrapper.classList.add(`columns-layout-${layout}`);

		const layouts = {
			'1': { cols: 1, widths: ['100%'] },
			'1-1': { cols: 2, widths: ['50%', '50%'] },
			'2-1': { cols: 2, widths: ['66.66%', '33.33%'] },
			'1-2': { cols: 2, widths: ['33.33%', '66.66%'] },
			'1-1-1': { cols: 3, widths: ['33.33%', '33.33%', '33.33%'] },
			'3-6-3': { cols: 3, widths: ['25%', '50%', '25%'] }
		};

		const selectedLayout = layouts[layout];

		if (!selectedLayout) return;

		// Update number of columns
		this.editors.numberOfColumns = selectedLayout.cols;

		// Adjust existing columns or create new ones
		while (this.data.cols.length > selectedLayout.cols) {
			this.data.cols.pop();
			this.editors.cols.pop();
		}

		while (this.data.cols.length < selectedLayout.cols) {
			this.data.cols.push({ blocks: [] });
		}

		// Apply column widths
		this.colWrapper.querySelectorAll('.ce-editorjsColumns_col').forEach((col, index) => {
			col.style.width = selectedLayout.widths[index];
		});

		await this._rerender();
	}

	async _updateCols(num) {
		// Should probably update to make number dynamic... but this will do for now
		if (num == 2) {
			if (this.editors.numberOfColumns == 3) {
				let resp = await Swal.fire({
					title: "Are you sure?",
					text: "This will delete Column 3!",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "Yes, delete it!",
				});

				if (resp.isConfirmed) {
					this.editors.numberOfColumns = 2;
					this.data.cols.pop();
					this.editors.cols.pop();
					this._rerender();
				}
			}
		}
		if (num == 3) {
			this.editors.numberOfColumns = 3;
			this._rerender();
		}
	}

	async _rerender() {
		await this.save();
		// console.log(this.colWrapper);

		for (let index = 0; index < this.editors.cols.length; index++) {
			this.editors.cols[index].destroy();
		}
		this.editors.cols = [];

		this.colWrapper.innerHTML = "";

		// console.log("Building the columns");

		for (let index = 0; index < this.editors.numberOfColumns; index++) {
			// console.log("Start column, ", index);
			let col = document.createElement("div");
			col.classList.add("ce-editorjsColumns_col");
			col.classList.add("editorjs_col_" + index);

			let editor_col_id = uuidv4();
			// console.log("generating: ", editor_col_id);
			col.id = editor_col_id;

			this.colWrapper.appendChild(col);

			let editorjs_instance = new this.config.EditorJsLibrary({
				defaultBlock: "paragraph",
				holder: editor_col_id,
				tools: this.config.tools,
				data: this.data.cols[index],
				readOnly: this.readOnly,
				minHeight: 50,
			});

			this.editors.cols.push(editorjs_instance);
		}
	}

	render() {

		// This is needed to prevent the enter / tab keys - it globally removes them!!!


		// // it runs MULTIPLE times. - this is not good, but works for now






		// console.log("Generating Wrapper");

		// console.log(this.api.blocks.getCurrentBlockIndex());

		this.colWrapper = document.createElement("div");
		this.colWrapper.classList.add("ce-editorjsColumns_wrapper");



		// astops the double paste issue
		this.colWrapper.addEventListener('paste', (event) => {
			// event.preventDefault();
			event.stopPropagation();
		}, true);   



		this.colWrapper.addEventListener('keydown', (event) => {

			// if (event.key === "Enter" && event.altKey) {
			// 	console.log("ENTER ALT Captured")
			// 	console.log(event.target)

			// 	// let b = event.target.dispatchEvent(new KeyboardEvent('keyup',{'key':'a'}));

			// 	event.target.innerText += "Aß"

			// 	// console.log(b)
			// }
			// else 
			if (event.key === "Enter") {
				event.preventDefault();
				event.stopImmediatePropagation();
				event.stopPropagation();
				
				// console.log("ENTER Captured")
				// this.api.blocks.insertNewBlock({type : "alert"});
				// console.log("Added Block")
			}
			if (event.key === "Tab") {
				// event.stopImmediatePropagation();
				event.preventDefault();
				event.stopImmediatePropagation();
				event.stopPropagation();
				
				// console.log("TAB Captured")
			}
		});





		for (let index = 0; index < this.editors.cols.length; index++) {
			this.editors.cols[index].destroy();
		}

		// console.log(this.editors.cols);
		this.editors.cols = []; //empty the array of editors
		// console.log(this.editors.cols);

		// console.log("Building the columns");

		for (let index = 0; index < this.editors.numberOfColumns; index++) {
			// console.log("Start column, ", index);
			let col = document.createElement("div");
			col.classList.add("ce-editorjsColumns_col");
			col.classList.add("editorjs_col_" + index);

			let editor_col_id = uuidv4();
			// console.log("generating: ", editor_col_id);
			col.id = editor_col_id;

			this.colWrapper.appendChild(col);

			let editorjs_instance = new this.config.EditorJsLibrary({
				defaultBlock: "paragraph",
				holder: editor_col_id,
				tools: this.config.tools,
				data: this.data.cols[index],
				readOnly: this.readOnly,
				minHeight: 50,
			});

			this.editors.cols.push(editorjs_instance);
			// console.log("End column, ", index);
		}
		return this.colWrapper;
	}

	async save() {
		if(!this.readOnly){
			// console.log("Saving");
			for (let index = 0; index < this.editors.cols.length; index++) {
				let colData = await this.editors.cols[index].save();
				this.data.cols[index] = colData;
			}
		}
		return this.data;
	}

	static get toolbox() {
		return {
			icon: icon,
			title: "Columns",
		};
	}
}

export { EditorJsColumns as default };
