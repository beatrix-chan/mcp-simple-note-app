const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
	saveFile: (content, defaultPath) => ipcRenderer.invoke('save-file', content, defaultPath),
	openFile: () => ipcRenderer.invoke('open-file'),
	onMenuSaveFile: (callback) => {
		if (typeof callback !== 'function') return;
		ipcRenderer.on('menu-save-file', callback);
	},
	onMenuOpenFile: (callback) => {
		if (typeof callback !== 'function') return;
		ipcRenderer.on('menu-open-file', callback);
	},
});

// Note: Keep preload lightweight. All file I/O goes through ipcRenderer.invoke handlers.
