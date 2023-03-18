const { globalShortcut, BrowserWindow } = require('electron');
const { createCaptureWindow } = require('../windows/winCapture');

function eventsHandler() {


  //TODO, cerrar capturador con ESC en caso de estar sobre el capturador
  //TODO, solo aceptar si estan todas las condiciones para poder efectuar traducciones
  globalShortcut.register('Shift+T', () => {
    console.log('Electron loves global shortcuts! T');
    //Solo creamos la ventana si no existe
    let captureIsDisplayed = false;
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.title === 'capture') {
        captureIsDisplayed = true;
      }
    });
    if (!captureIsDisplayed) {
      createCaptureWindow();
    }
  });


}

module.exports = {
  eventsHandler,
};
