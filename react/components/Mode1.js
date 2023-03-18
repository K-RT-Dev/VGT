import React from 'react';
import { Layout, Col, Row } from 'antd';
import TraductionCard from './TraductionCard';
import { useGlobalState } from './state';

//TODO: Mensaje inicial con tutorial
//TODO: No se puede usar hasta que se especifique una API Key (mensaje de error especial en caso de llamada a API que retorne un error relacionado a la cuenta)
const Mode1 = () => {
  const [entries] = useGlobalState('entries');

  //Hacemos el render en orden inverso
  return (
    <Layout.Content className="site-layout content-padding">
      <Row gutter={[8, 8]}>
        {Object.keys(entries).map((_entry, index, array) => (
          <Col key={entries[array[array.length - 1 - index]].id} span={24}>
            <TraductionCard entry={entries[array[array.length - 1 - index]]} />
          </Col>
        ))}
      </Row>
    </Layout.Content>
  );
};

export default Mode1;
