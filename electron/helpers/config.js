const Store = require('electron-store');

const store = new Store();

//Set de configuraciones iniciales
const defaultPrompt = 'Translate this text from Japanese to English:';

const defaultOpenAiModel = {
  name: 'GPT 3.5 Turbo 0301',
  fullname: 'gpt-3.5-turbo-0301',
  mode: 'chat',
  abbreviation: 'GPT-3.5-Tur',
};

const defaultConfigsValues = {
  basePrompt: defaultPrompt,
  screenshotModifierKey: 'Ctrl',
  screenshotLetterKey: 'T',
  basePromptOptions: [
    defaultPrompt,
    'Traduce este testo del Japones al Español:',
  ],
  openIaModels: [
    defaultOpenAiModel,
    {
      name: 'Davinci 003',
      fullname: 'text-davinci-003',
      mode: 'completion',
      abbreviation: 'Dav-3',
    },
  ],
  selectedOpenAiModel: defaultOpenAiModel.fullname,
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

  const openIaModels = store.get('openIaModels');
  if (!openIaModels) {
    store.set('openIaModels', defaultConfigsValues.openIaModels);
  }

  const selectedOpenAiModel = store.get('selectedOpenAiModel');
  if (!selectedOpenAiModel) {
    store.set('selectedOpenAiModel', defaultConfigsValues.selectedOpenAiModel);
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
    openIaModels: store.get('openIaModels'),
    selectedOpenAiModel: store.get('selectedOpenAiModel'),
  };
}

//Retorna las configuraciones necesarias por el back de Python para realizar sus operaciones
function getQueryConfig() {
  return {
    openaiApiKey: store.get('openaiApiKey') || '', //Retornamos un string vació en caso de no tener key
    basePrompt: store.get('basePrompt'),
    selectedOpenAiModel: getSelectedOpenAiModelProprieties(), //Retorna las configuraciones completas del modelo seleccionado
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

  if (newConfigs.selectedOpenAiModel) {
    if (
      newConfigs.selectedOpenAiModel !== currentsConfigs.selectedOpenAiModel
    ) {
      store.set('selectedOpenAiModel', newConfigs.selectedOpenAiModel);
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
  store.set('openIaModels', defaultConfigsValues.openIaModels);
  store.set('selectedOpenAiModel', defaultConfigsValues.selectedOpenAiModel);
}

//Retorna las propiedades del modelo de OpenAi seleccionado
function getSelectedOpenAiModelProprieties() {
  return store
    .get('openIaModels')
    .find((e) => e.fullname === store.get('selectedOpenAiModel'));
}

//Reinicia la opción "primer inicio" para pasar por el proceso de primer inicio nuevamente
function resetFirstInit() {
  store.set('firstInitReady', false);
}

//Para marcar el primer inicio como completado
function setFirstInitReady(status) {
  store.set('firstInitReady', status);
}

//Obtenemos el estado del primer inicio
//Por defecto el primer inicio aun no se ha realizado (false)
function getFirstInitReady() {
  return store.get('firstInitReady') || false;
}

//Para cambiar el estado de la secuencia inicial de verificación del modelo
function setInitModelSequenceReady(status) {
  store.set('initModelSequenceReady', status);
}

//Para obtener el estado de la secuencia inicial de verificación del modelo
//Por defecto la verificación no ha terminado (false)
function getInitModelSequenceReady() {
  return store.get('initModelSequenceReady') || false;
}

module.exports = {
  checkInitialConfig,
  getFullConfigs,
  getQueryConfig,
  getShortcutConfig,
  saveConfig,
  resetConfig,
  resetFirstInit,
  setFirstInitReady,
  getFirstInitReady,
  setInitModelSequenceReady,
  getInitModelSequenceReady,
  getSelectedOpenAiModelProprieties,
};
