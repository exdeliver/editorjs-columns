/*! For license information please see editorjs-columns.bundle.js.LICENSE.txt */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.editorjsColumns=e():t.editorjsColumns=e()}(self,(()=>(()=>{var t={726:t=>{t.exports='<svg width="14" height="14" viewBox="0 -1 14 14" xmlns="http://www.w3.org/2000/svg"><defs></defs><rect x="1.194" y="-0.041" width="11.601" height="12.11" rx="1" ry="1" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0); stroke-width: 1.5px;"></rect><path style="stroke: rgb(0, 0, 0); stroke-width:1.5px" d="M 7.032 -0.034 L 6.948 11.842"></path></svg>'}},e={};function o(r){var s=e[r];if(void 0!==s)return s.exports;var i=e[r]={exports:{}};return t[r](i,i.exports,o),i.exports}o.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return o.d(e,{a:e}),e},o.d=(t,e)=>{for(var r in e)o.o(e,r)&&!o.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var r={};return(()=>{"use strict";var t;o.d(r,{default:()=>p});var e=new Uint8Array(16);function s(){if(!t&&!(t="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return t(e)}const i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,a=function(t){return"string"==typeof t&&i.test(t)};for(var n=[],d=0;d<256;++d)n.push((d+256).toString(16).substr(1));const l=function(t,e,o){var r=(t=t||{}).random||(t.rng||s)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,e){o=o||0;for(var i=0;i<16;++i)e[o+i]=r[i];return e}return function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,o=(n[t[e+0]]+n[t[e+1]]+n[t[e+2]]+n[t[e+3]]+"-"+n[t[e+4]]+n[t[e+5]]+"-"+n[t[e+6]]+n[t[e+7]]+"-"+n[t[e+8]]+n[t[e+9]]+"-"+n[t[e+10]]+n[t[e+11]]+n[t[e+12]]+n[t[e+13]]+n[t[e+14]]+n[t[e+15]]).toLowerCase();if(!a(o))throw TypeError("Stringified UUID is invalid");return o}(r)};var c=o(726),u=o.n(c);class p{constructor({data:t,config:e,api:o,readOnly:r}){console.log("Constructed"),this.api=o,this.readOnly=r,this._CSS={block:this.api.styles.block,wrapper:"ce-EditorJsColumns"},this.readOnly||(this.onKeyUp=this.onKeyUp.bind(this)),this._placeholder=e.placeholder?e.placeholder:p.DEFAULT_PLACEHOLDER,this._data={},this.editors={},this.editors.editor_col_0={},this.editors.editor_col_1={},this.data=t}static get isReadOnlySupported(){return!0}onKeyUp(t){console.log("ku"),console.log(t),"Backspace"===t.code||t.code}get CSS(){return{settingsButton:this.api.styles.settingsButton,settingsButtonActive:this.api.styles.settingsButtonActive}}render(){let t=document.createElement("div");t.classList.add("ce-editorjsColumns_wrapper");let e=document.createElement("div");e.classList.add("ce-editorjsColumns_col"),e.classList.add("editorjs_col0");let o=document.createElement("div");o.classList.add("ce-editorjsColumns_col"),o.classList.add("editorjs_col1"),t.appendChild(e),t.appendChild(o);let r=l(),s=l();return e.id=r,o.id=s,this.editors.editor_col_0=new EditorJS({defaultBlock:"paragraph",holder:r,tools:window.editorjs_global_tools,data:this.data.col0,readOnly:this.readOnly,minHeight:50}),this.editors.editor_col_1=new EditorJS({defaultBlock:"paragraph",holder:s,tools:window.editorjs_global_tools,data:this.data.col1,readOnly:this.readOnly,minHeight:50}),t}validate(t){return!0}async save(t){console.log("Saving Col 0");let e=await this.editors.editor_col_0.save();console.log("Saving Col 1");let o=await this.editors.editor_col_1.save();return this.data.col0=e,this.data.col1=o,this.data}onPaste(t){const e={text:t.detail.data.innerHTML};this.data=e}static get sanitize(){return{text:{br:!0}}}static get toolbox(){return{icon:u(),title:"Columns"}}}})(),r.default})()));