//Ver si hay configuraciones guardadas
//Sino no hay aplicar las por defecto y gardarlas

//Habilitar interfaz para leer dichas configuraciones
//Habilitar interfaz para guardar dicjas configuraciones

//se instalo electron-store

const Store = require('electron-store');

const store = new Store();

//Set de configuraciones iniciales
const defaultPrompt = "Esta es la prompt por defecto"

const defaultConfigsValues = {
  basePrompt: defaultPrompt,
  screenshotModifierKey: 'CTRL',
  screenshotLetterKey: 'T',
  basePromptOptions: [defaultPrompt, 'B', 'C'],
};

//Realiza una carga inicial de todas las configuraciones cuando se inicia el programa por primera vez.
function checkInitialConfig() {
  const basePrompt = store.get('basePrompt');
  if (!basePrompt) {
    store.set('basePrompt', defaultConfigsValues.basePrompt);
  }

  const screenshotModifierKey = store.get('screenshotModifierKey');
  if (!screenshotModifierKey) {
    store.set(
      'screenshotModifierKey',
      defaultConfigsValues.screenshotModifierKey,
    );
  }

  const screenshotLetterKey = store.get('screenshotLetterKey');
  if (!screenshotLetterKey) {
    store.set('screenshotLetterKey', defaultConfigsValues.screenshotLetterKey);
  }

  const basePromptOptions = store.get('basePromptOptions');
  if (!basePromptOptions) {
    store.set('basePromptOptions', defaultConfigsValues.basePromptOptions);
  }
}

//Recupera todas las configuraciones
function getConfigs() {
  return {
    openaiApiKey: store.get('openaiApiKey') || '', //Retornamos un string vació en caso de no tener key
    basePrompt: store.get('basePrompt'),
    screenshotModifierKey: store.get('screenshotModifierKey'),
    screenshotLetterKey: store.get('screenshotLetterKey'),
    basePromptOptions: store.get('basePromptOptions'),
  };
}

//Guarda nuevas configuraciones
//Estas deben existir y ser distintas a las actualmente guardadas
function saveConfig(newConfigs) {
  const currentsConfigs = getConfigs();

  //Aceptamos, en caso de la Key, guardar un string vació
  if (newConfigs.openaiApiKey || newConfigs.openaiApiKey === '') {
    if (newConfigs.openaiApiKey !== currentsConfigs.openaiApiKey) {
      store.set('openaiApiKey', newConfigs.openaiApiKey);
    }
  }

  if (newConfigs.basePrompt) {
    if (newConfigs.basePrompt !== currentsConfigs.basePrompt) {
      store.set('basePrompt', newConfigs.basePrompt);
    }
  }

  if (newConfigs.screenshotModifierKey) {
    if (
      newConfigs.screenshotModifierKey !== currentsConfigs.screenshotModifierKey
    ) {
      store.set('screenshotModifierKey', newConfigs.screenshotModifierKey);
    }
  }

  if (newConfigs.screenshotLetterKey) {
    if (
      newConfigs.screenshotLetterKey !== currentsConfigs.screenshotLetterKey
    ) {
      store.set('screenshotLetterKey', newConfigs.screenshotLetterKey);
    }
  }
}

//Reinicia las configuraciones a las guardadas por defecto
function resetConfig() {
  store.delete('openaiApiKey');
  store.set('basePrompt', defaultConfigsValues.basePrompt);
  store.set(
    'screenshotModifierKey',
    defaultConfigsValues.screenshotModifierKey,
  );
  store.set('screenshotLetterKey', defaultConfigsValues.screenshotLetterKey);
}

module.exports = {
  checkInitialConfig,
  getConfigs,
  saveConfig,
  resetConfig,
};
