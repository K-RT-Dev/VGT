import React, { useRef, useEffect } from 'react';
import { Modal, Typography } from 'antd';
import { useGlobalState } from './state';

const { Paragraph } = Typography;

const InitModelSequenceModal = () => {
  const [backendTerminalStreaming] = useGlobalState('backendTerminalStreaming');

  const paragraphRef = useRef(); //Referencia para mover pragmáticamente la barra de scroll

  //Para mantener la barra siempre en la parte inferior
  useEffect(() => {
    const paragraphElement = paragraphRef.current;
    if (paragraphElement) {
      paragraphElement.scrollTop =
        paragraphElement.scrollHeight - paragraphElement.clientHeight + 10;
    }
  }, [backendTerminalStreaming]);

  //Escribimos cada linea recibida
  const renderTerminal = () => {
    const aux = [];
    backendTerminalStreaming.forEach((line) => {
      aux.push(line + '\n');
    });
    return aux;
  };

  return (
    <Modal
      title={'Downloading Character Recognition Model (OCR)'}
      style={{ minWidth: '600px' }}
      centered
      open={true}
      closable={false}
      maskClosable={false}
      footer={[]}
    >
      <Paragraph>
        This process is only necessary the first time the program is started,
        please wait a little longer.
      </Paragraph>
      <Paragraph>The model is approximately 450MB in size.</Paragraph>
      <Paragraph>
        <pre
          ref={paragraphRef}
          style={{ maxHeight: '125px', minHeight: '125px', overflow: 'auto' }}
        >
          {renderTerminal()}
        </pre>
      </Paragraph>
    </Modal>
  );
};

export default InitModelSequenceModal;
