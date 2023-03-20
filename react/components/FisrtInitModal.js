const { ipcRenderer, shell } = require('electron');
import React, { useState, useEffect } from 'react';
import { Button, Modal, Input } from 'antd';
import { FormOutlined } from '@ant-design/icons';

const FirstInitModal = () => {
  const [firstModelOpen, setFirstModalOpen] = useState(true);
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isApiKeyValid, setIsApiKeyValid] = useState(true);

  //Al cerrar el model, independiente de la razón,emitimos un evento para indicar que el ya se ha concretado el paso por el primer inicio
  useEffect(() => {
    if (!firstModelOpen) {
      ipcRenderer.send('setFirstInitReady', true);
    }
  }, [firstModelOpen]);

  const handleOpenaiApiKeyChange = (event) => {
    setOpenaiApiKey(event.target.value);
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

  //Al hacer click en Save API Key
  const onSetApiKey = async () => {
    const config = {};
    //Validamos de forma sincrona la Key
    //En caso de dejar
    if (openaiApiKey.trim() !== '') {
      const isValid = await ipcRenderer.invoke('checkApiKey');
      if (isValid) {
        setIsApiKeyValid(true);
        config['openaiApiKey'] = openaiApiKey.trim();

        //Enviamos evento a main con las configs
        //En este casos olo enviamos la propiedad "openaiApiKey"
        ipcRenderer.send('setConfig', config);

        //Cerrar modal
        setFirstModalOpen(false);
      }
    }
    setIsApiKeyValid(false);
    return;
  };

  return (
    <Modal
      title="Welcome - Initial setup"
      centered
      open={firstModelOpen}
      onOk={() => setFirstModalOpen(false)}
      onCancel={() => setFirstModalOpen(false)}
      closable={false}
      maskClosable={false}
      footer={[
        <Button type="primary" onClick={() => onSetApiKey()}>
          Save API Key
        </Button>,
        <Button onClick={() => setFirstModalOpen(false)}>...Set up later</Button>,
      ]}
    >
      <p style={{ textAlign: 'justify' }}>
        Enter your OpenAI API Key. If you don't have one, you can create an
        account and generate it by following
        <a
          onClick={() =>
            shell.openExternal('https://platform.openai.com/account/api-keys')
          }
        >
          {' '}
          this link{' '}
        </a>
        Without the API Key, the system won't be able to perform translations.
      </p>
      <div style={{ fontWeight: 'bold' }}>API KEY OpenAI</div>
      <Input.Password
        placeholder="API KEY"
        value={openaiApiKey}
        onChange={handleOpenaiApiKeyChange}
        maxLength={50}
        style={{ maxWidth: 300 }}
        suffix={<FormOutlined />}
        required
      />
      {renderWrongApiKeyAlert()}
      <div style={{ marginBottom: '30px' }} />
    </Modal>
  );
};

export default FirstInitModal;
