const { ipcMain, screen, desktopCapturer, BrowserWindow } = require('electron');
const { addNewEntry, deleteItemById } = require('./storeHandler');
const uuid = require('uuid');
const {
  getFullConfigs,
  saveConfig,
  resetConfig,
  getFirstInitReady,
  setFirstInitReady,
  getInitModelSequenceReady,
  getSelectedOpenAiModelProprieties
} = require('../helpers/config');
const { reloadCaptureWinShortcutHandler } = require('./shortcutsHandler');

function ipcHandler() {
  /**
   * Eventos relacionados a la verificación inicial del modelo
   */

  //Resuelve la petición de front para saber si la verificación inicial del modelo ya esta lista
  ipcMain.handle('getInitModelSequenceReady', async () => {
    return getInitModelSequenceReady();
  });

  /**
   * Eventos relacionados a la secuencia de inicio
   */

  //Resuelve la petición de front para saber si el sistema ya paso por el primer inicio
  ipcMain.handle('getFirstInitReady', async () => {
    return getFirstInitReady();
  });

  //Cambiamos el estado del FirstInitReady
  ipcMain.on('setFirstInitReady', (e, status) => {
    setFirstInitReady(status);
  });

  /*
   * Eventos relacionados al panel de configuraciones
   */

  //Cuando react quiere obtener las configuraciones actuales
  ipcMain.handle('getConfig', async () => {
    return getFullConfigs();
  });

  //Valida que la API KEY ingresada sea correcta
  ipcMain.handle('checkApiKey', async () => {
    //TODO: Consultar a back sobre la validez de la key
    return true;
  });

  //Cuando react nos entrega un nuevo set de configuraciones
  ipcMain.on('setConfig', (e, values) => {
    const prevConfigs = getFullConfigs();
    saveConfig(values); // Guardamos las nuevas configuraciones

    //En caso de cambiar la config del shortcut para la creación de la ventana de captura, creamos nuevamente el handler de shortcut
    if (
      prevConfigs.screenshotLetterKey !== values.screenshotLetterKey ||
      prevConfigs.screenshotModifierKey !== values.screenshotModifierKey
    ) {
      reloadCaptureWinShortcutHandler();
    }

    //Emitimos un evento con las configuraciones refrescadas
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.title === 'Visual-GPT-Translator') {
        win.webContents.send('refreshConfig', getFullConfigs());
      }
    });
  });

  //Reinicia las configuraciones a por defecto
  ipcMain.on('resetConfig', async () => {
    resetConfig();

    //En caso de cambiar la config del shortcut para la creación de la ventana de captura, creamos nuevamente el handler de shortcut
    reloadCaptureWinShortcutHandler();

    //Emitimos un evento con las configuraciones refrescadas
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.title === 'Visual-GPT-Translator') {
        win.webContents.send('refreshConfig', getFullConfigs());
      }
    });
  });

  /*
   * Eventos relacionados a acciones en el pane del Mode 1
   */
  ipcMain.on('deleteEntry', (_e, entryId) => {
    deleteItemById(entryId);
  });

  /*
   * Eventos relacionados al proceso de capturar una imagen de la pantalla
   */
  let p1Coords = null;
  let p2Coords = null;

  ipcMain.on('event/mousedown', () => {
    p1Coords = screen.dipToScreenPoint(screen.getCursorScreenPoint());
  });

  ipcMain.on('event/mouseup', () => {
    p2Coords = screen.dipToScreenPoint(screen.getCursorScreenPoint());
  });

  //TODO, soporte multiples monitores
  ipcMain.handle('captureScreenshot', async () => {
    if (p1Coords && p2Coords) {
      //Calcula el rectangulo de captura
      let xOrigin = p1Coords.x;
      if (p1Coords.x > p2Coords.x) {
        xOrigin = p2Coords.x;
      }
      let yOrigin = p1Coords.y;
      if (p1Coords.y > p2Coords.y) {
        yOrigin = p2Coords.y;
      }
      //Añadimos +1 al origen y restamos -1 en las dimensiones para crear un "margen" para que no salga rastro del color de fondo usado en el proceso de recorte
      const captureRectZone = {
        x: xOrigin + 1,
        y: yOrigin + 1,
        width: Math.abs(p1Coords.x - p2Coords.x) - 1,
        height: Math.abs(p1Coords.y - p2Coords.y) - 1,
      };

      //Si la imagen es muy pequeña, no analizamos nada
      if (captureRectZone.width < 25 || captureRectZone.height < 25) {
        return;
      }

      //calcula el tamaño completo de la pantalla  //TODO: Optimizar para siempre tener actualizado dado el monitor. Debe ser cambiado si el monitor cambia o su scale factor
      const screenDetails = screen.getPrimaryDisplay();
      const screenWidth = screenDetails.size.width * screenDetails.scaleFactor;
      const screenHeight =
        screenDetails.size.height * screenDetails.scaleFactor;

      //Tomar la imagen de  la pantalla
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: screenWidth, height: screenHeight },
      });

      //Recortar la imagen del la pantalla da la zona seleccionada
      //Genera un URL con la data de la imagen
      const img = sources[0].thumbnail.crop(captureRectZone).toDataURL();
      //Todo, validar que la img tenga contenido (a veces sale sin info)

      //Guardamos la imagen con una ID única y adjuntamos el modelo seleccionado al momento de realizar la captura
      addNewEntry({
        id: uuid.v4(),
        img: img,
        selectedModel: getSelectedOpenAiModelProprieties(),
      });
    }
    p1Coords = null;
    p2Coords = null;
    return;
  });

  ipcMain.on('closeCaptureWin', () => {
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.title === 'capture') {
        win.close();
      }
    });
  });
}

module.exports = {
  ipcHandler,
};
