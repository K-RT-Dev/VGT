const { ipcRenderer, shell } = require('electron');
import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import {
  Button,
  Input,
  Popconfirm,
  Card,
  Radio,
  Spin,
  Popover,
  Select as SelectAnt,
} from 'antd';

import { FormOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useGlobalState } from './state';

//TODO: Opción para eliminar el modelo del cache (cerrar programa ?)

const apiKeyHelp = (
  <div style={{ maxWidth: '300px' }}>
    You need to create an account in OpenAI and then generate a Key and put its
    value here.
    <br />
    <a
      onClick={() =>
        shell.openExternal('https://platform.openai.com/account/api-keys')
      }
    >
      Follow this link
    </a>
  </div>
);

const basePromptHelp = (
  <div style={{ maxWidth: '300px' }}>
    It is the instruction that precedes the text that will be translated by the
    OpenIA model.
    <br />
    <a
      onClick={() =>
        shell.openExternal(
          'https://platform.openai.com/docs/guides/completion#:~:text=You%20input%20some%20text%20as,I%20am%22%20with%20high%20probability.',
        )
      }
    >
      More info here
    </a>
  </div>
);

const Config = () => {
  const [config] = useGlobalState('config');

  const [loading, setLoading] = useState(true); //Determina si ya tenemos las configuraciones cargadas de main
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [basePromptOptions, setBasePromptOptions] = useState([]); //Listado de prompt para el dropdown
  const [usePrebuildPrompt, setUsePrebuildPrompt] = useState(true); //True en caso que el valor de "basePrompt" se encuentre en el listado de "basePromptOptions"
  const [basePrompt, setBasePrompt] = useState(null); //Valor de prompt seleccionado del dropdown
  const [customBasePrompt, setCustomBasePrompt] = useState(''); //Valor personalizado de prompt
  const [screenshotModifierKey, setScreenshotModifierKey] = useState('Ctrl');
  const [screenshotLetterKey, setScreenshotLetterKey] = useState('T');
  const [isConfigChanged, setIsConfigChange] = useState(false); //Para saber, si respecto a la configuración inicial, se ha realizado algún cambio
  const [isApiKeyValid, setIsApiKeyValid] = useState(true); //Para controlar un mensaje de feedback en caso que la API Key no sea valida

  useEffect(() => {
    setIsConfigChange(false); //Al cargar una nueva config de main, asumimos que aun no se han realizado cambios
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

  //Para detectar si se ha realizado un cambio en las configuraciones
  useEffect(() => {
    if (!loading) {
      let changeInForm = false;
      if (openaiApiKey !== config.openaiApiKey) {
        changeInForm = true;
      }
      if (usePrebuildPrompt) {
        if (basePrompt !== config.basePrompt) {
          changeInForm = true;
        }
      } else {
        if (customBasePrompt !== config.basePrompt) {
          changeInForm = true;
        }
      }
      if (screenshotModifierKey !== config.screenshotModifierKey) {
        changeInForm = true;
      }
      if (screenshotLetterKey !== config.screenshotLetterKey) {
        changeInForm = true;
      }
      setIsConfigChange(changeInForm);
    }
  }, [
    openaiApiKey,
    screenshotModifierKey,
    screenshotLetterKey,
    basePrompt,
    customBasePrompt,
  ]);

  //Para remover el mensaje de alerta de API Key incorrecta en caso que se vacié el input
  useEffect(() => {
    if (openaiApiKey === '') {
      setIsApiKeyValid(true);
    }
  }, [openaiApiKey]);

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
  const onApplyConfig = async () => {
    //Configuraciones que siempre van a estar seleccionadas
    const config = {
      screenshotModifierKey: screenshotModifierKey,
    };

    //Validamos de forma asíncrona que la API KEY ingresada sea valida
    //Si el valor introducido es un string vació, nos saltamos la verificación, ya que puede ser el usuario simplemente eliminando sus credenciales
    if (openaiApiKey.trim() !== '') {
      const isValid = await ipcRenderer.invoke('checkApiKey');
      if (isValid) {
        setIsApiKeyValid(true);
        config['openaiApiKey'] = openaiApiKey.trim();
      } else {
        setIsApiKeyValid(false);
        return;
      }
    }else{
      setIsApiKeyValid(true);
      config['openaiApiKey'] = openaiApiKey.trim();
    }

    //Validamos la letra para capturar screenshots
    if (screenshotLetterKey.trim() !== '') {
      config['screenshotLetterKey'] = screenshotLetterKey.trim();
    } else {
      return;
    }

    //Vemos si el usuario selecciono una prompt del listado o una custom
    if (usePrebuildPrompt) {
      if (basePrompt) {
        config['basePrompt'] = basePrompt;
      } else {
        return;
      }
    } else {
      //Nos aseguramos que la custom sea valida
      if (customBasePrompt.trim() !== '') {
        config['basePrompt'] = customBasePrompt.trim();
      } else {
        return;
      }
    }

    //Enviamos evento a main con las configs
    ipcRenderer.send('setConfig', config);
  };

  const renderApiAlert = () => {
    if (!openaiApiKey || openaiApiKey === '') {
      return (
        <div style={{ fontSize: '12px', color: '#cc5800' }}>
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
    if (!customBasePrompt || customBasePrompt === '') {
      return (
        <div style={{ fontSize: '12px', color: 'red' }}>
          You need to define a Prompt
        </div>
      );
    }
    return;
  };

  const onResetConfig = async () => {
    await ipcRenderer.send('resetConfig');
  };

  const renderWrongApiKeyAlert = () => {
    if (!isApiKeyValid) {
      return (
        <div style={{ fontSize: '12px', color: 'red' }}>
          The Key is not valid
        </div>
      );
    }
    return;
  };

  //Cargamos el contenido o un mensaje de carga si aun no tenemos las configs de main
  const renderContent = () => {
    if (!loading) {
      return (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Popover content={apiKeyHelp}>
              <QuestionCircleOutlined style={{ fontSize: '14px' }} />
            </Popover>
            <div style={{ fontWeight: 'bold', marginRight: 5, marginLeft: 5 }}>
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
          {renderWrongApiKeyAlert()}
          <br />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Popover content={basePromptHelp}>
              <QuestionCircleOutlined style={{ fontSize: '14px' }} />
            </Popover>
            <div style={{ fontWeight: 'bold', marginRight: 5, marginLeft: 5 }}>
              Base Prompt
            </div>
          </div>
          <Radio.Group
            onChange={handleUsePrebuildPromptChange}
            value={usePrebuildPrompt ? 'prebuild' : 'custom'}
          >
            <Radio value="prebuild">Pre-built Prompts</Radio>
            <Radio value="custom">Custom Prompt</Radio>
          </Radio.Group>
          {usePrebuildPrompt ? (
            <>
              <SelectAnt
                style={{ width: '100%' }}
                placeholder="Select prompt"
                value={basePrompt || basePromptOptions[0]}
                onChange={handleBasePromptChange}
              >
                {basePromptOptions.map((e) => (
                  <SelectAnt.Option key={e} value={e}>
                    {e}
                  </SelectAnt.Option>
                ))}
              </SelectAnt>
              <br />
            </>
          ) : (
            <>
              <Input.TextArea
                placeholder="Enter your custom prompt"
                value={customBasePrompt}
                onChange={handleCustomBasePromptChange}
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
              <br />
              {renderCustomBasePromptAlert()}
            </>
          )}
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
              <SelectAnt.Option value="Ctrl">CTRL</SelectAnt.Option>
              <SelectAnt.Option value="Shift">SHIFT</SelectAnt.Option>
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              type="primary"
              size="middle"
              onClick={() => onApplyConfig()}
              disabled={!isConfigChanged}
            >
              Aplicar
            </Button>
            <Popconfirm
              title="Reset"
              description="Are you sure you want to reset the settings?"
              onConfirm={onResetConfig}
              okText="Yes"
              cancelText="No"
            >
              <a>Reset to default</a>
            </Popconfirm>
          </div>
        </>
      );
    } else {
      return (
        <div style={{ textAlign: 'center' }}>
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
