const { ipcRenderer } = require('electron');
import React, { useEffect } from 'react';
import Main from './Main';
import {
  addNewEntry,
  addText,
  addTrad,
  updateConfig,
  deleteEntry,
} from './state';

//TODO: Tener un sistema para validar si el back esta listo para funcionar
//TODO: Añadir explicaciones de como usar el sistema
const App = () => {
  //Mapeo de eventos desde main a estados de React
  useEffect(() => {
    //Cuando main tiene una nueva entrada (imagen)
    ipcRenderer.on('newEntry', (e, newEntry) => {
      addNewEntry(newEntry);
    });
    //Cuando se elimina una entrada
    ipcRenderer.on('entryDeleted', (e, entryId) => {
      deleteEntry(entryId);
    });
    //Cuando main tiene un nuevo texto detectado de una imagen
    ipcRenderer.on('addText', (e, newText) => {
      addText(newText);
    });
    //Cuando main tiene la traducción de un texto lista
    ipcRenderer.on('addTrad', (e, newTrad) => {
      addTrad(newTrad);
    });
    //Cuando main ha cambiado las configuraciones guardadas
    ipcRenderer.on('refreshConfig', (e, config) => {
      updateConfig(config);
    });

    //Al iniciar nos aseguramos de cargar las configuraciones de main
    async function syncConfig() {
      const currentConfig = await ipcRenderer.invoke('getConfig');
      updateConfig(currentConfig);
    }
    syncConfig();
  }, []);

  return <Main />;
};

export default App;
