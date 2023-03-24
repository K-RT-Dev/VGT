const { BrowserWindow } = require('electron');

function handleBackendTerminal(data) {
  let line = data.trim();

  //En caso que la linea parta con "Downloading", usamos procesamos el texto para enviar una linea al front
  //Esta linea es dibujada en el front.
  //Actualmente esto se hace para informar sobre el estado de descarga del modelo
  if (line.includes('Downloading')) {
    let aux = line
      .replace('Downloading', '...')
      .replace(' ', '')
      .replace('(�)', '')
      .replace(/\|.*?\|/, '');
    aux = aux.split('[');
    aux = aux[0] + '[' + aux[1].split(',')[1].replace(' ', '');

    //Enviamos el string a front
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.title === 'Visual-GTP-Translator') {
        win.webContents.send('backendTerminalStreaming', aux);
      }
    });
  }
}

module.exports = {
  handleBackendTerminal,
};
