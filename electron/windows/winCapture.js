const path = require('path');
const url = require('url');
const { globalShortcut, BrowserWindow } = require('electron');

//TODO: Forzar focus a esta ventana ?
function createCaptureWindow() {
  //Instancia ventana
  captureWindow = new BrowserWindow({
    title: 'capture',
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
  if (process.env.NODE_ENV === 'development') {
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
      pathname: path.join(__dirname, '..', '..', 'dist', 'index.html'),
      slashes: true,
    });
  }

  //Selecciona en que pantalla abrrir el capturador
  //const screenList = screen.getAllDisplays();
  //captureWindow.setBounds(screenList[1].workArea);

  //Evita que el nombre de la ventana sea cambiado por React
  captureWindow.on('page-title-updated', function (e) {
    e.preventDefault();
  });

  //Carga contenido de ventana
  captureWindow.loadURL(indexPath);

  //captureWindow.setBackgroundColor('#00000000');

  captureWindow.maximize(); // ?Pasar como propiedad al instancias ventana

  //Mostramos la ventana cuando esta todo listo
  //Creamos un shortcut para cerrar la ventana en caso de usar la tecla Ecs
  captureWindow.once('ready-to-show', () => {
    globalShortcut.register('Escape', () => {
      captureWindow.close();
    });
    captureWindow.show();
  });

  //En caso de ser cerrada, eliminamos la ventana
  //Nos aseguramos de eliminar el handler de escape usado para esta venta
  captureWindow.on('closed', () => {
    captureWindow = null;
    globalShortcut.unregister('Escape');
  });
}

module.exports = {
  createCaptureWindow,
};
