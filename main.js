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
const { initModelSequence } = require('./electron/helpers/initModelSequence');

//resetConfig();
//resetFirstInit();

checkInitialConfig(); //Setea las configuraciones iniciales y/o carga las configuraciones guardadas

ipcHandler(); //Inicia los handlers

initBackend(); //Inicia el backend

app.on('ready', () => {
  //Iniciamos la secuencia de carga de modelos del back, cuando estamos listos cargamos la ventana principal
  initModelSequence().then(() => {
    createMainWindow();
    createCaptureWinShortcutHandler();
  });
});

/* Necesario ??
app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
*/

//Si cerramos con CTRL+C esto no se ejecuta
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
