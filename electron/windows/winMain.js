const path = require('path');
const url = require('url');
const { app, BrowserWindow } = require('electron');
const { inDevMode } = require('../helpers/helpers');

function createMainWindow() {
  //Instancia ventana
  let mainWindow = new BrowserWindow({
    title: 'Visual-GTP-Translator',
    width: 1100,
    height: 800,
    show: false,
    transparent: true, //OJO
    frame: false, //OJO
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
  if (process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:3000',
      hash: '/',
      pathname: 'index.html',
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      hash: '/',
      pathname: path.join(__dirname, '..', '..', 'dist', 'index.html'),
      slashes: true,
    });
  }

  //Evita que el nombre de la ventana sea cambiado por React
  mainWindow.on('page-title-updated', function (e) {
    e.preventDefault();
  });

  //Carga contenido de ventana
  mainWindow.loadURL(indexPath);

  //Mostramos la ventana cuando esta todo listo
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  //En caso de ser cerrada, eliminamos la ventana y cerramos el programa
  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });
}

module.exports = {
  createMainWindow,
};
