const electron = require('electron');
const url = require('url');

function mainWin() {
  const win = new electron.BrowserWindow({
    show: false,
    transparent: true,
    frame: false,
    // An electron bug makes the bgcolor white on navigation/reload for #000000 and #00000000
    // backgroundColor: '#00ffffff',
    // skipTaskbar: true,
    // hasShadow: false,
    // alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  
  if (process.argv.indexOf('--noDevServer') === -1) {
    console.log("RUN IN DEV")
    const indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:3000',
      hash: '/',
      pathname: 'index.html',
      slashes: true,
    });
    win.loadURL(indexPath);
  } else {
    console.log("RUN IN BUILD")
    win.loadFile(__dirname + '/../dist/index.html');
  }

  win.on('ready-to-show', () => {
    win.show();
    console.log('showing');
  });
}

module.exports = {
  mainWin,
};
