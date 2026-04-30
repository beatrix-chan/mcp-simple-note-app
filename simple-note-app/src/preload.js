const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
	saveFile: (content, defaultPath) => ipcRenderer.invoke('save-file', content, defaultPath),
	openFile: () => ipcRenderer.invoke('open-file'),
});

// Helpful: expose a simple logger for renderer
contextBridge.exposeInMainWorld('nativeLog', {
	log: (...args) => ipcRenderer.invoke('renderer-log', ...args).catch(() => undefined),
});

// Note: Keep preload lightweight. All file I/O goes through ipcRenderer.invoke handlers.
