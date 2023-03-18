const { ipcRenderer } = require('electron');
import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import {
  Button,
  Input,
  Space,
  Form,
  Card,
  Radio,
  Spin,
  Select as SelectAnt,
} from 'antd';

import { FormOutlined } from '@ant-design/icons';
import { useGlobalState } from './state';

const Config = () => {
  const [config] = useGlobalState('config');

  const [loading, setLoading] = useState(true); //Determina si ya tenemos las configuraciones cargadas de main
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [basePromptOptions, setBasePromptOptions] = useState([]); //Listado de prompt para el dropdown
  const [usePrebuildPrompt, setUsePrebuildPrompt] = useState(true); //True en caso que el valor de "basePrompt" se encuentre en el listado de "basePromptOptions"
  const [basePrompt, setBasePrompt] = useState('Esta es la prompt por defecto'); //Valor de prompt seleccionado del dropdown
  const [customBasePrompt, setCustomBasePrompt] = useState(''); //Valor personalizado de prompt
  const [screenshotModifierKey, setScreenshotModifierKey] = useState('CTRL');
  const [screenshotLetterKey, setScreenshotLetterKey] = useState('T');

  useEffect(() => {
    //Cada vez que cambie la config de main, actualizamos los hooks del componente.
    if (Object.keys(config).length > 0) {
      //No recorremos en caso de que las config aun no las tengamos. Esto sucede en el primer render.
      setOpenaiApiKey(config.openaiApiKey);
      setBasePromptOptions(config.basePromptOptions);

      //Para ver si tenemos guardado un customPrompt o algo del listado basePromptOptions
      if (config.basePromptOptions?.includes(config.basePrompt)) {
        setUsePrebuildPrompt(true);
        setBasePrompt(config.basePrompt);
      } else {
        setUsePrebuildPrompt(false);
        setCustomBasePrompt(config.basePrompt);
      }

      setScreenshotModifierKey(config.screenshotModifierKey);
      setScreenshotLetterKey(config.screenshotLetterKey);

      setLoading(false); //Marcamos que ya tenemos la carga inicial de configuraciones
    }
  }, [config]);

  const handleUsePrebuildPromptChange = (e) => {
    setUsePrebuildPrompt(e.target.value === 'prebuild');
  };

  const handleBasePromptChange = (value) => {
    setBasePrompt(value);
  };

  const handleCustomBasePromptChange = (e) => {
    setCustomBasePrompt(e.target.value);
  };

  const handleOpenaiApiKeyChange = (event) => {
    setOpenaiApiKey(event.target.value);
  };

  const handleScreenshotModifierChange = (value) => {
    setScreenshotModifierKey(value.toUpperCase());
  };

  const handleScreenshotLetterChange = (event) => {
    setScreenshotLetterKey(event.target.value.toUpperCase());
  };

  //Al hacer click en Aplicar
  const onApplyConfig = () => {
    //Configuraciones que siempre van a estar seleccionadas
    const config = {
      openaiApiKey: openaiApiKey,
      screenshotModifierKey: screenshotModifierKey,
    };

    //Validamos la letra para capturar screenshots
    if (screenshotLetterKey !== '') {
      config['screenshotLetterKey'] = screenshotLetterKey;
    } else {
      return;
    }

    //Vemos si el usuario selecciono una prompt del listado o una custom
    if (usePrebuildPrompt) {
      config['basePrompt'] = basePrompt;
    } else {
      //Nos aseguramos que la custom sea valida
      if (customBasePrompt.trim() !== '') {
        config['basePrompt'] = customBasePrompt.trim();
      } else {
        console.log('El custom no puede estar vació');
        return;
      }
    }

    //Enviamos evento a main con las configs
    ipcRenderer.send('setConfig', config);
  };

  const renderApiAlert = () => {
    if (!openaiApiKey || openaiApiKey === '') {
      return (
        <div style={{ fontSize: '12px', color: 'red' }}>
          The translation cannot be performed without the API KEY
        </div>
      );
    }
    return null;
  };

  const renderScreenshotLetterKeyAlert = () => {
    if (!screenshotLetterKey || screenshotLetterKey === '') {
      return (
        <div style={{ fontSize: '12px', color: 'red' }}>
          You need to define a letter to be able to use the shortcut command
        </div>
      );
    }
    return null;
  };

  const renderCustomBasePromptAlert = () => {
    return;
  };

  //Cargamos el contenido o un mensaje de carga si aun no tenemos las configs de main
  const renderContent = () => {
    if (!loading) {
      return (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', marginRight: 5 }}>
              API KEY OpenAI
            </div>
            <div style={{ color: 'red' }}>*</div>
          </div>
          <Input.Password
            placeholder="API KEY"
            value={openaiApiKey}
            onChange={handleOpenaiApiKeyChange}
            maxLength={50}
            style={{ maxWidth: 300 }}
            suffix={<FormOutlined />}
            required
          />
          <br />
          {renderApiAlert()}
          <br />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', marginRight: 5 }}>
              Base Prompt
            </div>
          </div>
          <Radio.Group
            onChange={handleUsePrebuildPromptChange}
            value={usePrebuildPrompt ? 'prebuild' : 'custom'}
          >
            <Radio value="prebuild">Pre-built Base Prompt</Radio>
            <Radio value="custom">Custom Prompt</Radio>
          </Radio.Group>
          {usePrebuildPrompt ? (
            <SelectAnt
              style={{ width: '100%' }}
              placeholder="Select prompt"
              value={basePrompt}
              onChange={handleBasePromptChange}
            >
              {basePromptOptions.map((e) => (
                <SelectAnt.Option key={e} value={e}>
                  {e}
                </SelectAnt.Option>
              ))}
            </SelectAnt>
          ) : (
            <Input.TextArea
              placeholder="Enter your custom prompt"
              value={customBasePrompt}
              onChange={handleCustomBasePromptChange}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          )}
          <br />
          <br />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', marginRight: 5 }}>
              Screenshot shortcut
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SelectAnt
              style={{ minWidth: 80, marginRight: 10 }}
              placeholder="Select modifier key"
              value={screenshotModifierKey}
              onChange={handleScreenshotModifierChange}
            >
              <SelectAnt.Option value="CTRL">CTRL</SelectAnt.Option>
              <SelectAnt.Option value="SHIFT">SHIFT</SelectAnt.Option>
            </SelectAnt>
            <div style={{ marginRight: '10px', alignSelf: 'center' }}>+</div>
            <Input
              placeholder="Enter letter key"
              value={screenshotLetterKey}
              onChange={handleScreenshotLetterChange}
              maxLength={1}
              style={{ width: 50, textAlign: 'center' }}
            />
          </div>
          {renderScreenshotLetterKeyAlert()}
          <br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" size="middle" onClick={onApplyConfig}>
              Aplicar
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <div>
          <Spin />
        </div>
      );
    }
  };

  return (
    <Layout.Content className="site-layout content-padding">
      <Card
        title="Basic configurations"
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        {renderContent()}
      </Card>
    </Layout.Content>
  );
};

export default Config;
