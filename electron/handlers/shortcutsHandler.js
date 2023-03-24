const { globalShortcut, BrowserWindow } = require('electron');
const { createCaptureWindow } = require('../windows/winCapture');
const {
  getShortcutConfig,
  getFirstInitReady,
  getInitModelSequenceReady,
} = require('../helpers/config');

//Elimina todos los handler y crea un nuevo handler para la ventana de captura
function reloadCaptureWinShortcutHandler() {
  //Cerramos cualquier ventana de captura que ya este abierta
  BrowserWindow.getAllWindows().forEach((win) => {
    if (win.title === 'capture') {
      win.close();
    }
  });
  //Sacamos el registro de las capturas de shortcuts
  globalShortcut.unregisterAll();
  //Creamos un nuevo handler
  createCaptureWinShortcutHandler();
}

//Crea un nuevo handler para el shortcut que crea la ventana de captura
function createCaptureWinShortcutHandler() {
  //TODO, solo aceptar si estan todas las condiciones para poder efectuar traducciones

  const shortcutKeys = getShortcutConfig();
  const shortcutCombination =
    shortcutKeys.screenshotModifierKey + '+' + shortcutKeys.screenshotLetterKey;

  globalShortcut.register(shortcutCombination, () => {
    //Solo creamos la ventana si no existe
    let captureIsDisplayed = false;
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.title === 'capture') {
        captureIsDisplayed = true;
      }
    });
    //Solo creamos la ventana en caso que no exista; y que el usuario ya pasara por el primer inicio; y la secuencia de verificación inicial del modelo ya esta lista
    if (
      !captureIsDisplayed &&
      getFirstInitReady() &&
      getInitModelSequenceReady()
    ) {
      createCaptureWindow();
    }
  });
}

module.exports = {
  createCaptureWinShortcutHandler,
  reloadCaptureWinShortcutHandler,
};
