import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import icon from "./editorjs-columns.svg";

const MAX_SPAN = 12;

class EditorJsColumns {
	static get enableLineBreaks() {
		return true;
	}

	static get isReadOnlySupported() {
		return true;
	}

	static get toolbox() {
		return {
			icon: icon,
			title: "Columns",
		};
	}

	constructor({ data, config, api, readOnly }) {
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
		this.editors = {
			cols: [],
			numberOfColumns: Array.isArray(data.cols) ? data.cols.length : 2
		};

		this.colWrapper = undefined;
		this.data = data;

		if (!Array.isArray(this.data.cols)) {
			this.data.cols = [];
		}

		const n = this.data.cols.length || 2;
		this.editors.spanOfColumns = [...Array(n).keys()].map(() => MAX_SPAN / n);
	}

	get CSS() {
		return {
			settingsButton: this.api.styles.settingsButton,
			settingsButtonActive: this.api.styles.settingsButtonActive,
		};
	}

	onKeyUp(e) {
		if (e.code !== "Backspace" && e.code !== "Delete") {
			return;
		}
	}

	renderSettings() {
		return [
			{
				icon: "2",
				label: "2 Columns",
				onActivate: () => this._updateCols(2)
			},
			{
				icon: "3",
				label: "3 Columns",
				onActivate: () => this._updateCols(3)
			},
			{
				icon: "R",
				label: "Roll Cols",
				onActivate: () => this._rollCols()
			},
			{
				name: "Widen Cols",
				icon: `<div>W</div>`,
				onActivate: () => this._widenCols()
			}
		];
	}

	_rollCols() {
		this.data.cols.unshift(this.data.cols.pop());
		this.editors.cols.unshift(this.editors.cols.pop());
		this._rerender();
	}

	async _updateCols(num) {
		if (num === 2 && this.editors.numberOfColumns === 3) {
			const response = await Swal.fire({
				title: "Are you sure?",
				text: "This will delete Column 3!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Yes, delete it!",
			});

			if (response.isConfirmed) {
				this.editors.numberOfColumns = 2;
				this.data.cols.pop();
				this.editors.cols.pop();
				this._rerender();
			}
		}

		if (num === 3) {
			this.editors.numberOfColumns = 3;
			this._rerender();
		}
	}

	async _widenCols() {
		if (this.editors.numberOfColumns === 2) {
			let [s1, s2] = this.editors.spanOfColumns;
			s1 = s1 + 1 > 11 ? 1 : s1 + 1;
			s2 = MAX_SPAN - s1;
			this.editors.spanOfColumns = [s1, s2];
		} else if (this.editors.numberOfColumns === 3) {
			let [s1] = this.editors.spanOfColumns;
			s1 = s1 + 1 > 10 ? 1 : s1 + 1;
			const s2 = parseInt((MAX_SPAN - s1) / 2);
			const s3 = MAX_SPAN - s1 - s2;
			this.editors.spanOfColumns = [s1, s2, s3];
		}

		this._rerender();
	}

	async _rerender() {
		await this.save();
		this._destroyEditors();
		this._createColumns();
	}

	_destroyEditors() {
		this.editors.cols.forEach(editor => editor.destroy());
		this.editors.cols = [];
		this.colWrapper.innerHTML = "";
	}

	_createColumns() {
		for (let index = 0; index < this.editors.numberOfColumns; index++) {
			const col = this._createColumn(index);
			this.colWrapper.appendChild(col);
			this.editors.cols.push(this._createEditor(col.id, index));
		}
	}

	_createColumn(index) {
		const col = document.createElement("div");
		col.classList.add(
			"ce-editorjsColumns_col",
			`editorjs_col_${index}`,
			`ce-editorjsColumns_span-${this.editors.spanOfColumns[index]}`
		);
		col.id = uuidv4();
		return col;
	}

	_createEditor(holderId, index) {
		return new this.config.EditorJsLibrary({
			defaultBlock: "paragraph",
			holder: holderId,
			tools: this.config.tools,
			data: this.data.cols[index],
			readOnly: this.readOnly,
			minHeight: 50,
		});
	}

	render() {
		this.colWrapper = document.createElement("div");
		this.colWrapper.classList.add("ce-editorjsColumns_wrapper");

		this._setupEventListeners();
		this._createColumns();

		return this.colWrapper;
	}

	_setupEventListeners() {
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
	}

	async save() {
		if (!this.readOnly) {
			for (let index = 0; index < this.editors.cols.length; index++) {
				this.data.cols[index] = await this.editors.cols[index].save();
			}
		}
		this.data.spans = this.editors.spanOfColumns;
		return this.data;
	}
}

export default EditorJsColumns;