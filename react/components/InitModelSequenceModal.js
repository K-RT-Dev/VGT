import React from 'react';
import { Modal } from 'antd';

const InitModelSequenceModal = () => {
  return (
    <Modal
      centered
      open={true}
      //onOk={() => setFirstModalOpen(false)}
      //onCancel={() => setFirstModalOpen(false)}
      closable={false}
      maskClosable={false}
      footer={[]}
    >
      INICIANDO SISTEMA
    </Modal>
  );
};

export default InitModelSequenceModal;
