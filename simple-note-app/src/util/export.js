window.appUtils = window.appUtils || {};
window.appUtils.export = (function () {
	async function save(content) {
		return window.api.saveFile(content, 'note.txt');
	}

	async function open() {
		return window.api.openFile();
	}

	return { save, open };
})();
