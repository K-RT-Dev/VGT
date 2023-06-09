const async = require('async');
const axios = require('axios');
const { getQueryConfig } = require('../helpers/config');

const queue = async.queue(function (task) {
  try {
    task();
  } catch (e) {}
}, 1);

async function processImg(imgObj, callback) {
  //Enviamos la imagen a nuestro back de Python para reconocer los caracteres
  let text = 'Error';
  try {
    const res = await axios.post(
      'http://localhost:8000/translateDataUrlImg',
      { id: imgObj.id, img: imgObj.img, config: getQueryConfig() },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    text = res.data.text;
    if(text === ""){
      text = "NULL";
    }
  } catch (e) {
    console.log(e);
  }
  callback({ id: imgObj.id, text: text });
}

async function traductionText(textObj, callback) {
  //Enviamos el texto raw a nuestro back de Python para que traduzca
  let trad = 'Error';

  try {
    const res = await axios.post(
      'http://localhost:8000/translateText',
      { id: textObj.id, text: textObj.text, config: getQueryConfig() },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    trad = res.data.trad;
    if(trad === ""){
      trad = "NULL";
    }
  } catch (e) {
    console.log(e);
  }

  callback({ id: textObj.id, trad: trad });
}

function addImgToProcess(imgObj, callback) {
  queue.push(processImg(imgObj, callback));
}

function addTextToTraduction(textObk, callback) {
  queue.push(traductionText(textObk, callback));
}

module.exports = {
  addImgToProcess,
  addTextToTraduction,
};
