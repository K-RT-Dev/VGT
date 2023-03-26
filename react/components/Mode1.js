import React from 'react';
import { Layout, Col, Row } from 'antd';
import TraductionCard from './TraductionCard';
import { useGlobalState } from './state';
import { Link } from 'react-router-dom';

//TODO: Mensaje inicial con tutorial
//TODO: No se puede usar hasta que se especifique una API Key (mensaje de error especial en caso de llamada a API que retorne un error relacionado a la cuenta)
const Mode1 = () => {
  const [config] = useGlobalState('config');
  const [entries] = useGlobalState('entries');

  const tutorialContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '650px',
        margin: '0 auto',
        padding: '30px',
        borderRadius: '30px',
        background: '#b3b3b3',
      }}
    >
      <div>
        <h3 style={{ textAlign: 'center' }}>
          Use the key combination "{config.screenshotModifierKey} +{' '}
          {config.screenshotLetterKey}" to take your first screenshot and
          translation
        </h3>
      </div>
      {config.openaiApiKey === '' ? (
        <div>
          Remember to <Link to="/config">configure</Link> your OpenIA Api Key to
          use the translation system of GPT for translation
        </div>
      ) : null}
    </div>
  );

  const renderContent = () => {
    if (Object.keys(entries).length > 0) {
      return (
        <Row gutter={[8, 8]}>
          {Object.keys(entries).map((_entry, index, array) => (
            <Col key={entries[array[array.length - 1 - index]].id} span={24}>
              <TraductionCard
                entry={entries[array[array.length - 1 - index]]}
              />
            </Col>
          ))}
        </Row>
      );
    } else {
      return tutorialContent;
    }
  };

  //Hacemos el render en orden inverso
  return (
    <Layout.Content className="site-layout content-padding">
      {renderContent()}
    </Layout.Content>
  );
};

export default Mode1;
