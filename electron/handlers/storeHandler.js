const { BrowserWindow } = require('electron');
const { addImgToProcess, addTextToTraduction } = require('./queueHandler');
const EventEmitter = require('events');

/**
 * Estructura del objeto que guardamos para cada input de traducción
 * "1234": {
 *      id: "123" --> id única UUID
 *      img: "", --> Imagen en DataURL Base64
 *      text: "", --> Texto detectado
 *      trad: "" --> Texto traducido
 * }
 */

const items = {};
const eventEmitter = new EventEmitter();

function cleanAll() {
  items = {};
}

function deleteItemById(id) {
  delete items[id];
  eventEmitter.emit('entryDeleted', id);
}

//Añade una nueva entrada
function addNewEntry(imgObj) {
  console.log('Guardando nueva imagen');
  imgObj['text'] = null;
  imgObj['trad'] = null;
  items[imgObj.id] = imgObj;
  eventEmitter.emit('newEntryAdded', imgObj);
}

//Añade un texto a una imagen almacenada
function addTextToImg(textObj) {
  console.log('Guardando texto detectado');
  items[textObj.id]['text'] = textObj.text;
  eventEmitter.emit('newText', textObj);
}

//Añade la traducción a una imagen y texto almacenado
function addTraductionToImg(tradObj) {
  console.log('Guardando texto traducido');
  items[tradObj.id]['trad'] = tradObj.trad;
  eventEmitter.emit('newTrad', tradObj);
}

//Si se añade una nueva imagen, la enviamos a front para añadirla a la lista
//Luego la añadimos a la lista para su procesamiento en el OCR
eventEmitter.on('newEntryAdded', (imgObj) => {
  //Enviar a la pantalla principal TODO, Optimizar para reducir iteración ?
  BrowserWindow.getAllWindows().forEach((win) => {
    if (win.title === 'Visual-GTP-Translator') {
      win.webContents.send('newEntry', imgObj);
    }
  });

  //Inicia proceso de OCR
  addImgToProcess(imgObj, addTextToImg);
});

//Cuando una imagen ya ha pasado por el OCR
eventEmitter.on('newText', (textObj) => {
  //Enviar a la pantalla principal TODO, Optimizar para reducir iteración ?
  BrowserWindow.getAllWindows().forEach((win) => {
    if (win.title === 'Visual-GTP-Translator') {
      win.webContents.send('addText', textObj);
    }
  });

  //Inicia proceso de traduccion
  addTextToTraduction(textObj, addTraductionToImg);
});

//Cuando una imagen ya tiene su texto y traduccion
eventEmitter.on('newTrad', (tradObj) => {
  //Enviar a la pantalla principal TODO, Optimizar para reducir iteración ?
  BrowserWindow.getAllWindows().forEach((win) => {
    if (win.title === 'Visual-GTP-Translator') {
      win.webContents.send('addTrad', tradObj);
    }
  });
});

//Cuando se elimina una entrada
eventEmitter.on('entryDeleted', (entryId) => {
  //Enviar a la pantalla principal TODO, Optimizar para reducir iteración ?
  BrowserWindow.getAllWindows().forEach((win) => {
    if (win.title === 'Visual-GTP-Translator') {
      win.webContents.send('entryDeleted', entryId);
    }
  });
});

module.exports = {
  addNewEntry,
  addTextToImg,
  deleteItemById,
  cleanAll,
};
