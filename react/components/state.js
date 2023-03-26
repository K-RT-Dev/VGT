import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  entries: {},
  config: {},
  firstInitReady: true, //Por defecto asumimos que el usuario ya paso por el primer inicio
  initModelSequenceReady: false, //Por defecto asumimos que el modelo no esta cargado en disco
  backendTerminalStreaming: [], //Para almacenar un buffer con el output de la terminal del backend
};
const { setGlobalState, useGlobalState } = createGlobalState(initialState);

export const addNewEntry = (newEntry) => {
  setGlobalState('entries', (oldEntries) => {
    const newObjAux = { ...oldEntries };
    newObjAux[newEntry.id] = newEntry;
    return newObjAux;
  });
};

export const deleteEntry = (entryId) => {
  setGlobalState('entries', (oldEntries) => {
    const newObjAux = { ...oldEntries };
    delete newObjAux[entryId];
    return newObjAux;
  });
};

export const addText = (newText) => {
  setGlobalState('entries', (oldEntries) => {
    const newObjAux = { ...oldEntries };
    newObjAux[newText.id]['text'] = newText.text;
    return newObjAux;
  });
};

export const addTrad = (newTrad) => {
  setGlobalState('entries', (oldEntries) => {
    const newObjAux = { ...oldEntries };
    newObjAux[newTrad.id]['trad'] = newTrad.trad;
    return newObjAux;
  });
};

export const updateConfig = (config) => {
  setGlobalState('config', config);
};

export const updateFirstInitReady = (status) => {
  setGlobalState('firstInitReady', status);
};

export const updateInitModelSequenceReady = (status) => {
  setGlobalState('initModelSequenceReady', status);
};

export const updateBackendTerminalStreaming = (line) => {
  setGlobalState('backendTerminalStreaming', (oldEntries) => {
    const newArrObj = [...oldEntries];
    if (newArrObj.length > 100) {
      //Solo almacenamos las ultimas 100 lineas de la terminal
      newArrObj.shift();
    }
    newArrObj.push(line);
    return newArrObj;
  });
};

export { useGlobalState };
