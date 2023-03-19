const { app } = require('electron');
const { createMainWindow } = require('./electron/windows/winMain');
const { eventsHandler } = require('./electron/handlers/eventsHandler');
const { ipcHandler } = require('./electron/handlers/ipcHandler');
const { checkInitialConfig, resetConfig } = require('./electron/helpers/config')

//resetConfig();
checkInitialConfig();

app.on('ready', () => {
  createMainWindow();
  eventsHandler(); //TODO mover a un lugar que asegurar que la ventana main ya este lista y todo este cargado como para poder iniciar capturas
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