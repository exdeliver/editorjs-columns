/**
 * Column Block for the Editor.js.
 *
 * @author Calum Knott (calum@calumk.com)
 * @author Jason Hoendervanger - EXdeliver
 * @copyright Calum Knott
 * @license The MIT License (MIT)
 */

/**
 * @typedef {Object} EditorJsColumnsData
 * @description Tool's input and output data format
 */

import {v4 as uuidv4} from "uuid";
import Swal from "sweetalert2";

import './editorjs-columns.scss';
import icon from "./editorjs-columns.svg";

// import EditorJS from '@editorjs/editorjs'; // required for npm mode

class EditorJsColumns {

	static get enableLineBreaks() {
		return true;
	}

	constructor({data, config, api, readOnly}) {
		this.api = api;
		this.readOnly = readOnly;
		this.config = config || {};

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
		this.data = {
			cols: [],
			layout: null,
			...data
		};

		if (!Array.isArray(this.data.cols)) {
			this.data.cols = [];
			this.editors.numberOfColumns = 1;
		} else {
			this.editors.numberOfColumns = this.data.cols.length;
		}
	}

	static get isReadOnlySupported() {
		return true;
	}

	onKeyUp(e) {
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
		const selectedLayout = EditorJsColumns.layouts[layout];
		if (!selectedLayout) return;

		// Remove old layout classes
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

		// Update number of columns
		this.editors.numberOfColumns = selectedLayout.cols;

		// Adjust existing columns or create new ones
		while (this.data.cols.length > selectedLayout.cols) {
			this.data.cols.pop();
			this.editors.cols.pop();
		}

		while (this.data.cols.length < selectedLayout.cols) {
			const colIndex = this.data.cols.length;
			this.data.cols.push({
				blocks: [],
				width: selectedLayout.widths[colIndex],
				gridSize: selectedLayout.gridSizes[colIndex]
			});
		}

		// Update existing columns with new layout information
		this.data.cols.forEach((col, index) => {
			col.width = selectedLayout.widths[index];
			col.gridSize = selectedLayout.gridSizes[index];
		});

		this.data.layout = layout;
	}

	_addColumnResizeObserver(col, index) {
		const resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				if (!this.data.cols[index]) return;
			}
		});

		resizeObserver.observe(col);
		return resizeObserver; // Return for cleanup if needed
	}

	async _rerender() {
		// If save is needed (not initial render)
		if (this.editors.cols.length > 0) {
			await this.save();
		}

		// Destroy existing editors
		for (let index = 0; index < this.editors.cols.length; index++) {
			this.editors.cols[index].destroy();
		}
		this.editors.cols = [];
		this.colWrapper.innerHTML = "";

		// Create new columns
		for (let index = 0; index < this.editors.numberOfColumns; index++) {
			let col = document.createElement("div");
			col.classList.add("ce-editorjsColumns_col");
			col.classList.add("editorjs_col_" + index);

			// Set width and grid size
			const width = this.data.cols[index]?.width ||
				(EditorJsColumns.layouts[this.data.layout]?.widths[index] ||
					`${100 / this.editors.numberOfColumns}%`);

			const gridSize = this.data.cols[index]?.gridSize ||
				(EditorJsColumns.layouts[this.data.layout]?.gridSizes[index] ||
					Math.floor(12 / this.editors.numberOfColumns));
			// Apply width and grid size
			col.style.width = width;
			col.setAttribute('data-grid-size', gridSize);
			col.setAttribute('data-column-label', `Col ${gridSize}/12`);

			// Add resize controls if not readonly
			if (!this.readOnly) {
				const resizeControls = this.createResizeControls(col, index);
				col.appendChild(resizeControls);
			}

			// Create editor instance
			let editor_col_id = uuidv4();
			col.id = editor_col_id;

			this.colWrapper.appendChild(col);

			let editorjs_instance = new this.config.EditorJsLibrary({
				defaultBlock: "paragraph",
				holder: editor_col_id,
				tools: this.config.tools,
				data: this.data.cols[index],
				readOnly: this.readOnly,
				minHeight: 50,
				placeholder: `Column ${index + 1} content`
			});

			this.editors.cols.push(editorjs_instance);

			// Add resize observer
			this._addColumnResizeObserver(col, index);
		}

		// Update layout class
		if (this.data.layout) {
			this.colWrapper.setAttribute('data-layout', this.data.layout);
		}
	}

	render() {
		// Create wrapper
		this.colWrapper = document.createElement("div");
		this.colWrapper.classList.add("ce-editorjsColumns_wrapper");

		// Add layout class if exists
		if (this.data.layout) {
			this.colWrapper.classList.add(`columns-layout-${this.data.layout}`);
		}

		// Add event listeners
		this.colWrapper.addEventListener('paste', (event) => {
			event.stopPropagation();
		}, true);

		this.colWrapper.addEventListener('keydown', (event) => {
			if (event.key === "Enter" || event.key === "Tab") {
				event.preventDefault();
				event.stopImmediatePropagation();
				event.stopPropagation();
			}
		});

		// Initial render
		this._rerender().then((result) => {
			console.info('Loaded EXdeliver Pagebuilder Row with columns');
		});

		return this.colWrapper;
	}

	_handleColumnResize(index, increase) {
		const columns = this.colWrapper.querySelectorAll('.ce-editorjsColumns_col');
		const totalColumns = columns.length;

		const COLUMN_STEP = 1;
		const MIN_COLUMNS = 1;
		const MAX_COLUMNS = 12;

		const currentGridSizes = Array.from(columns).map((col, i) =>
			this.data.cols[i]?.gridSize || this.calculateColumnSize(col.style.width || '100%')
		);

		if (increase && currentGridSizes[index] >= MAX_COLUMNS) {
			this._showResizeLimit('maximum');
			return;
		}
		if (!increase && currentGridSizes[index] <= MIN_COLUMNS) {
			this._showResizeLimit('minimum');
			return;
		}

		if (increase) {
			currentGridSizes[index] += COLUMN_STEP;
			const decreasePerColumn = COLUMN_STEP / (totalColumns - 1);
			currentGridSizes.forEach((size, i) => {
				if (i !== index) {
					currentGridSizes[i] -= decreasePerColumn;
				}
			});
		} else {
			currentGridSizes[index] -= COLUMN_STEP;
			const increasePerColumn = COLUMN_STEP / (totalColumns - 1);
			currentGridSizes.forEach((size, i) => {
				if (i !== index) {
					currentGridSizes[i] += increasePerColumn;
				}
			});
		}

		// Update columns and data
		columns.forEach((col, i) => {
			const percentage = (currentGridSizes[i] / 12) * 100;
			col.style.width = `${percentage}%`;
			col.setAttribute('data-grid-size', currentGridSizes[i]);
			col.setAttribute('data-column-label', `Col ${currentGridSizes[i]}/12`);
			this.data.cols[i].gridSize = currentGridSizes[i];
			this.data.cols[i].width = `${percentage}%`;

			// Update column label
			const label = col.querySelector('.column-label');
			if (label) {
				label.textContent = `Col ${Math.round(currentGridSizes[i])}/12`;
			}
		});
	}

	_showResizeLimit(type) {
		const message = type === 'maximum' ?
			'Maximum column width reached' :
			'Minimum column width reached';

		// Show a subtle tooltip-style notification
		const notification = document.createElement('div');
		notification.classList.add('resize-limit-notification');
		notification.textContent = message;

		document.body.appendChild(notification);
		setTimeout(() => {
			notification.classList.add('fade-out');
			setTimeout(() => notification.remove(), 300);
		}, 1500);
	}

	_updateSizeIndicators() {
		const columns = this.colWrapper.querySelectorAll('.ce-editorjsColumns_col');
		columns.forEach(col => {
			const indicator = col.querySelector('.size-indicator');
			if (indicator) {
				const width = parseFloat(col.style.width || '0');
				indicator.textContent = `${Math.round(width)}%`;
			}
		});
	}

	_addResizeAnimation(column) {
		column.classList.add('resizing');
		setTimeout(() => column.classList.remove('resizing'), 300);
	}

	createResizeControls(col, index) {
		const controlsWrapper = document.createElement('div');
		controlsWrapper.classList.add('column-controls');

		const toolbar = document.createElement('div');
		toolbar.classList.add('column-toolbar');

		// Settings button
		const settingsButton = document.createElement('button');
		settingsButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" stroke-width="2"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="2"/>
        </svg>
    `;
		settingsButton.classList.add('column-button', 'settings');
		settingsButton.setAttribute('title', 'Column Settings');
		settingsButton.addEventListener('click', () => this._showColumnSettings(index));

		// Get grid size from data or layout
		const gridSize = this.data.cols[index]?.gridSize;

		// Column label with grid size
		const columnLabel = document.createElement('span');
		columnLabel.classList.add('column-label');
		columnLabel.textContent = `Col ${gridSize}/12`;

		// Width controls
		const widthControls = document.createElement('div');
		widthControls.classList.add('width-controls');

		const minusButton = document.createElement('button');
		minusButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
		minusButton.classList.add('column-button', 'minus');
		minusButton.setAttribute('title', 'Decrease Width');

		const plusButton = document.createElement('button');
		plusButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
		plusButton.classList.add('column-button', 'plus');
		plusButton.setAttribute('title', 'Increase Width');

		// Add drag handle
		const dragHandle = document.createElement('div');
		dragHandle.classList.add('column-drag-handle');
		dragHandle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M8 8v8M16 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
		dragHandle.setAttribute('title', 'Drag to Reorder');

		// Assemble toolbar
		widthControls.appendChild(minusButton);
		widthControls.appendChild(columnLabel);
		widthControls.appendChild(plusButton);

		toolbar.appendChild(dragHandle);
		toolbar.appendChild(widthControls);
		toolbar.appendChild(settingsButton);

		controlsWrapper.appendChild(toolbar);

		// Add event listeners for drag and resize
		dragHandle.addEventListener('mousedown', (e) => this._initColumnDrag(e, index));
		minusButton.addEventListener('click', () => this._handleColumnResize(index, false));
		plusButton.addEventListener('click', () => this._handleColumnResize(index, true));

		return controlsWrapper;
	}

	async _showColumnSettings(index) {
		const column = this.colWrapper.querySelector(`.editorjs_col_${index}`);
		const currentWidth = parseFloat(column.style.width || '0');

		const result = await Swal.fire({
			title: 'Column Settings',
			html: `
            <div class="column-settings">
                <div class="setting-group">
                    <label>Padding</label>
                    <div class="padding-inputs">
                        <input type="number" id="padding-top" placeholder="Top" value="10">
                        <input type="number" id="padding-right" placeholder="Right" value="10">
                        <input type="number" id="padding-bottom" placeholder="Bottom" value="10">
                        <input type="number" id="padding-left" placeholder="Left" value="10">
                    </div>
                </div>
                <div class="setting-group">
                    <label>Background Color</label>
                    <input type="color" id="bg-color" value="#ffffff">
                </div>
            </div>
        `,
			showCancelButton: true,
			confirmButtonText: 'Apply',
			customClass: {
				container: 'column-settings-modal'
			}
		});

		if (result.isConfirmed) {
			// Apply settings
			const width = document.getElementById('column-width').value;
			const bgColor = document.getElementById('bg-color').value;
			const padding = {
				top: document.getElementById('padding-top').value,
				right: document.getElementById('padding-right').value,
				bottom: document.getElementById('padding-bottom').value,
				left: document.getElementById('padding-left').value
			};

			this._applyColumnSettings(index, {
				width: `${width}%`,
				backgroundColor: bgColor,
				padding
			});
		}
	}

	_applyColumnSettings(index, settings) {
		const column = this.colWrapper.querySelector(`.editorjs_col_${index}`);

		if (settings.width) {
			column.style.width = settings.width;
			this._updateSizeIndicators();
		}

		if (settings.backgroundColor) {
			column.style.backgroundColor = settings.backgroundColor;
		}

		if (settings.padding) {
			column.style.padding = `${settings.padding.top}px ${settings.padding.right}px ${settings.padding.bottom}px ${settings.padding.left}px`;
		}
	}

	_initColumnDrag(e, index) {
		const column = this.colWrapper.querySelector(`.editorjs_col_${index}`);
		const columns = Array.from(this.colWrapper.querySelectorAll('.ce-editorjsColumns_col'));

		let startX = e.clientX;
		let startIndex = index;

		const moveHandler = (moveEvent) => {
			const diff = moveEvent.clientX - startX;
			const step = this.colWrapper.offsetWidth / columns.length;
			const newIndex = Math.floor((moveEvent.clientX - this.colWrapper.getBoundingClientRect().left) / step);

			if (newIndex !== startIndex && newIndex >= 0 && newIndex < columns.length) {
				this._swapColumns(startIndex, newIndex);
				startIndex = newIndex;
				startX = moveEvent.clientX;
			}
		};

		const upHandler = () => {
			document.removeEventListener('mousemove', moveHandler);
			document.removeEventListener('mouseup', upHandler);
			column.classList.remove('dragging');
		};

		column.classList.add('dragging');
		document.addEventListener('mousemove', moveHandler);
		document.addEventListener('mouseup', upHandler);
	}

	_swapColumns(fromIndex, toIndex) {
		const columns = Array.from(this.colWrapper.querySelectorAll('.ce-editorjsColumns_col'));
		const fromCol = columns[fromIndex];
		const toCol = columns[toIndex];

		if (fromIndex < toIndex) {
			toCol.parentNode.insertBefore(fromCol, toCol.nextSibling);
		} else {
			toCol.parentNode.insertBefore(fromCol, toCol);
		}

		// Update data array
		const temp = this.data.cols[fromIndex];
		this.data.cols[fromIndex] = this.data.cols[toIndex];
		this.data.cols[toIndex] = temp;

		// Update editors array
		const tempEditor = this.editors.cols[fromIndex];
		this.editors.cols[fromIndex] = this.editors.cols[toIndex];
		this.editors.cols[toIndex] = tempEditor;
	}

	calculateColumnSize(width) {
		// Convert percentage to columns out of 12
		const percentage = parseFloat(width);
		return Math.round((percentage / 100) * 12);
	}

	async save() {
		if (!this.readOnly) {
			for (let index = 0; index < this.editors.cols.length; index++) {
				let colData = await this.editors.cols[index].save();
				const column = this.colWrapper.querySelector(`.editorjs_col_${index}`);

				colData.width = column.style.width || this.data.cols[index].width;
				colData.gridSize = this.data.cols[index].gridSize;
				colData.settings = {
					backgroundColor: column.style.backgroundColor || null,
					padding: column.style.padding || null
				};

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


	static get layouts() {
		return {
			'1': {
				cols: 1,
				widths: ['100%'],
				gridSizes: [12]
			},
			'1-1': {
				cols: 2,
				widths: ['50%', '50%'],
				gridSizes: [6, 6]
			},
			'2-1': {
				cols: 2,
				widths: ['66.66%', '33.33%'],
				gridSizes: [8, 4]
			},
			'1-2': {
				cols: 2,
				widths: ['33.33%', '66.66%'],
				gridSizes: [4, 8]
			},
			'1-1-1': {
				cols: 3,
				widths: ['33.33%', '33.33%', '33.33%'],
				gridSizes: [4, 4, 4]
			},
			'3-6-3': {
				cols: 3,
				widths: ['25%', '50%', '25%'],
				gridSizes: [3, 6, 3]
			}
		};
	}
}

export {EditorJsColumns as default};
