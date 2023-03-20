const { app } = require('electron');
const { createMainWindow } = require('./electron/windows/winMain');
const {
  createCaptureWinShortcutHandler,
} = require('./electron/handlers/shortcutsHandler');
const { ipcHandler } = require('./electron/handlers/ipcHandler');
const {
  checkInitialConfig,
  resetConfig,
  resetFirstInit,
} = require('./electron/helpers/config');

//resetConfig();
//resetFirstInit();
checkInitialConfig();

app.on('ready', () => {
  createMainWindow();
  createCaptureWinShortcutHandler(); //TODO mover a un lugar que asegurar que la ventana main ya este lista y todo este cargado como para poder iniciar capturas
});

ipcHandler();

/* Necesario ??
app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
*/

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Stop error Necesario ??
//app.allowRendererProcessReuse = true;
