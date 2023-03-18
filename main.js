const electron = require('electron');
const { mainWin } = require('./electron/win');

electron.app.on('ready', () => {
  mainWin();
});
