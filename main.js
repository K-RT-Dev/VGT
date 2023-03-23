const { app } = require('electron');
const { createMainWindow } = require('./electron/windows/winMain');
const {
  createCaptureWinShortcutHandler,
} = require('./electron/handlers/shortcutsHandler');
const { initBackend } = require('./electron/helpers/backendRunner');
const { ipcHandler } = require('./electron/handlers/ipcHandler');
const {
  checkInitialConfig,
  resetConfig,
  resetFirstInit,
} = require('./electron/helpers/config');

//Inicia el backend
initBackend();

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

//Si cerramos con CTRL+C esto no se ejecuta
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
