//Ver si hay configuraciones guardadas
//Sino no hay aplicar las por defecto y gardarlas

//Habilitar interfaz para leer dichas configuraciones
//Habilitar interfaz para guardar dicjas configuraciones

//se instalo electron-store

const Store = require('electron-store');

const store = new Store();

//Set de configuraciones iniciales
const defaultPrompt = "Translate this text from Japanese to English:"

const defaultConfigsValues = {
  basePrompt: defaultPrompt,
  screenshotModifierKey: 'Ctrl',
  screenshotLetterKey: 'T',
  basePromptOptions: [defaultPrompt, 'Traduce este testo del Japones al Español:'],
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
function getFullConfigs() {
  return {
    openaiApiKey: store.get('openaiApiKey') || '', //Retornamos un string vació en caso de no tener key
    basePrompt: store.get('basePrompt'),
    screenshotModifierKey: store.get('screenshotModifierKey'),
    screenshotLetterKey: store.get('screenshotLetterKey'),
    basePromptOptions: store.get('basePromptOptions'),
  };
}

//Retorna las configuraciones necesarias por el back de Python para realizar sus operaciones
function getQueryConfig() {
  return {
    openaiApiKey: store.get('openaiApiKey') || '', //Retornamos un string vació en caso de no tener key
    basePrompt: store.get('basePrompt'),
  };
}

//Retorna la configuración relacionada a la combinación de teclas para la ejecución de la captura de pantallas
function getShortcutConfig() {
  return {
    screenshotModifierKey: store.get('screenshotModifierKey'),
    screenshotLetterKey: store.get('screenshotLetterKey'),
  };
}

//Guarda nuevas configuraciones
//Estas deben existir y ser distintas a las actualmente guardadas
function saveConfig(newConfigs) {
  const currentsConfigs = getFullConfigs();

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
  store.set('basePromptOptions', defaultConfigsValues.basePromptOptions);
}

module.exports = {
  checkInitialConfig,
  getFullConfigs,
  getQueryConfig,
  getShortcutConfig,
  saveConfig,
  resetConfig,
};
