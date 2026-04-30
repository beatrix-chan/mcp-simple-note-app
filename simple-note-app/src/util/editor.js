window.appUtils = window.appUtils || {};
window.appUtils.editor = (function () {
	let textarea = null;
	let undoStack = [];
	let redoStack = [];
	let lastValue = '';

	function init(id) {
		textarea = document.getElementById(id);
		if (!textarea) return;
		lastValue = textarea.value;
		textarea.addEventListener('input', onInput);
	}

	function onInput() {
		undoStack.push(lastValue);
		lastValue = textarea.value;
		redoStack = [];
	}

	function undo() {
		if (!textarea) return;
		if (undoStack.length === 0) return;
		redoStack.push(textarea.value);
		const v = undoStack.pop();
		textarea.value = v;
		lastValue = v;
	}

	function redo() {
		if (!textarea) return;
		if (redoStack.length === 0) return;
		undoStack.push(textarea.value);
		const v = redoStack.pop();
		textarea.value = v;
		lastValue = v;
	}

	function getValue() {
		return textarea ? textarea.value : '';
	}

	function clear() {
		if (!textarea) return;
		textarea.value = '';
		lastValue = '';
		undoStack = [];
		redoStack = [];
	}

	return { init, undo, redo, getValue, clear };
})();
