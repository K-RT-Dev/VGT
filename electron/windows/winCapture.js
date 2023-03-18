const path = require('path');
const url = require('url');
const { BrowserWindow } = require('electron');
const { inDevMode } = require('../helpers/helpers');

//TODO: Forzar focus a esta ventana ?
function createCaptureWindow() {
  //Instancia ventana
  captureWindow = new BrowserWindow({
    title: "capture",
    width: 500,
    height: 500,
    show: false,
    transparent: true,
    frame: false,
    resizable: false,
    minimizable: false,
    maximize: true,
    backgroundColor: '#00ffffff',
    hasShadow: false,
    alwaysOnTop: true,
    icon: `${__dirname}/../assets/ghost.png`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  //Genera elemento a cargar en la ventana dado el ambiente de ejecución
  //Usamos hash para indicar la ruta que debe ser ejecutada en el contenido
  //Ojo que en el path.join usamos ".." para llegar correctamente al .html
  let indexPath;
  if (inDevMode() && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:3000',
      hash: '/capture',
      pathname: 'index.html',
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      hash: '/capture',
      pathname: path.join(__dirname, '..' , '..' ,'dist', 'index.html'),
      slashes: true,
    });
  }

  //Selecciona en que pantalla abrrir el capturador
  //const screenList = screen.getAllDisplays();
  //captureWindow.setBounds(screenList[1].workArea);

  //Evita que el nombre de la ventana sea cambiado por React
  captureWindow.on('page-title-updated', function(e) {
    e.preventDefault()
  });

  //Carga contenido de ventana
  captureWindow.loadURL(indexPath);

  //captureWindow.setBackgroundColor('#00000000');

  captureWindow.maximize(); // ?Pasar como propiedad al instancias ventana

  //Mostramos la ventana cuando esta todo listo
  captureWindow.once('ready-to-show', () => {
    captureWindow.show();
  });

  //En caso de ser cerrada, eliminamos la ventana
  captureWindow.on('closed', () => (captureWindow = null));
}

module.exports = {
  createCaptureWindow,
};
