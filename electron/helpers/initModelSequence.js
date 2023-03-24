const { BrowserWindow } = require('electron');
const axios = require('axios');
const { setInitModelSequenceReady } = require('./config');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function checkBackend() {
  let failCount = 0;
  while (failCount < 10) {
    try {
      const res = await axios.get('http://localhost:8000/check');
      if (res.status === 200) {
        return;
      }
      failCount++;
      await sleep(500);
    } catch (e) {
      failCount++;
      await sleep(500);
    }
  }
  console.log('Error conectando con el backend');
  process.exit();
}

async function checkModelStatus() {
  try {
    let res = await axios.get('http://localhost:8000/modelCheck'); //TODO: Dejar de usar check para validar estado de back y usar este para reducir tiempo de inicio
    if (res.status === 200) {
      //Si esta en disco realizamos el POST pero **sin** await, ya que el proceso de carga en memoria es bien rápido y no queremos repentizar mas al usuario
      if (res.data === 'inDisk') {
        axios.post(
          'http://localhost:8000/loadMangaOCR',
          {},
          { timeout: 60000 * 1 },
        );
        return;
        //En caso que no este en disco, lo descargamos. Aquí si usamos await, ya que es un proceso lento y queremos evitar que el usuario pueda usar el sistema si esto no esta listo
      } else {
        res = await axios.post(
          'http://localhost:8000/loadMangaOCR',
          {},
          { timeout: 60000 * 5 },
        );
        if (res.status === 200) {
          return;
        }
      }
    }
  } catch (e) {}
  console.log('Error con peticiones para cargar modelo inicial');
  process.exit();
}

/**
 * Este secuencia inicial sirve para comprobar si el backend de python ya ha descargado el modelo usado por Manga Ocr
 * La secuencia en primer lugar fija una config para que front despliegue un Modal para avisar y mostrar el estado de comprobación del  modelo
 * Luego la secuencia busca establecer conexión con el back (en caso de fallar reiteradas veces el programa se cierra)
 * Posteriormente se ve si el modelo ya ha sido descargado. En caso de serlo se cambia la config y se emite un evento para que front remueva el Modal
 * En caso contrario el Modal se mantendrá mientras se descarga el modelo
 *
 * Solo luego de terminar este proceso se podrá acceder a otra funcionalidades como el Modal "primer inicio" y/o el shortcutHandler
 */
async function initModelSequence() {
  setInitModelSequenceReady(false); //Marcamos para que front despliegue el Modal de carga inicial
  await checkBackend(); //Comprobamos estado de back
  await checkModelStatus(); //Vemos el estado del modelo en el disco y cargamos si es necesario

  //Cambiamos esta a secuencia lista y enviamos evento a front
  setInitModelSequenceReady(true);
  BrowserWindow.getAllWindows().forEach((win) => {
    if (win.title === 'Visual-GTP-Translator') {
      win.webContents.send('initModelSequenceReady');
    }
  });
}

module.exports = { initModelSequence };
