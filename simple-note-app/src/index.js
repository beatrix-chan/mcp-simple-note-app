const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// IPC handlers
ipcMain.handle('save-file', async (event, content, defaultPath) => {
  try {
    const saveOptions = {
      title: 'Save note',
      defaultPath: defaultPath || 'note.txt',
      buttonLabel: 'Save',
      filters: [{ name: 'Text', extensions: ['txt'] }],
    };

    const { canceled, filePath } = await dialog.showSaveDialog(saveOptions);

    if (canceled || !filePath) return { canceled: true };

    // If file exists, confirm overwrite
    if (fs.existsSync(filePath)) {
      const resp = await dialog.showMessageBox({
        type: 'question',
        message: 'File already exists. Overwrite? ',
        buttons: ['Overwrite', 'Cancel'],
        defaultId: 0,
        cancelId: 1,
      });

      if (resp.response === 1) {
        return { canceled: true, message: 'Save cancelled by user' };
      }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    return { canceled: false, filePath };
  } catch (err) {
    console.error('save-file error', err);
    throw err;
  }
});

ipcMain.handle('open-file', async () => {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Text', extensions: ['txt'] }],
    });
    if (canceled || !filePaths || filePaths.length === 0) return { canceled: true };
    const content = fs.readFileSync(filePaths[0], 'utf8');
    return { canceled: false, filePath: filePaths[0], content };
  } catch (err) {
    console.error('open-file error', err);
    throw err;
  }
});
