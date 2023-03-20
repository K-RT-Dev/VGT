import React from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import AppMenu from './AppMenu';
import Mode1 from './Mode1';
import Config from './Config';
import Capture from './Capture';
import FirstInitModal from './FisrtInitModal';
import { useGlobalState } from './state';
import { GithubOutlined } from '@ant-design/icons';

const Main = () => {
  //El Menu, Footer y el uso de un fondo para el contenido solo lo usamos en caso que la ruta cargada no sea /capture, ya que esa tiene una forma especial de ser aplicada
  //TODO: Mejorar el código respecto a lo anterior

  const [firstInitReady] = useGlobalState('firstInitReady');

  // Solo hacer render si no hemos pasado por el firstInit
  const renderFirstInitModal = () => {
    if (!firstInitReady) {
      return <FirstInitModal />;
    }
    return null;
  };

  return (
    <HashRouter>
      <div id="global">
        {window.location.href.includes('/capture') ? null : <AppMenu />}
        <div
          id="content"
          style={{
            background: window.location.href.includes('/capture')
              ? null
              : 'gray',
          }}
        >
          <Routes>
            <Route path="/" element={<Mode1 />} />
            <Route path="/config" element={<Config />} />
            <Route path="/capture" element={<Capture />} />
          </Routes>
        </div>
        {window.location.href.includes('/capture') ? null : (
          <div id="footer">
            <div style={{ textAlign: 'center', padding: '4px' }}>
              <GithubOutlined style={{ marginRight: 5 }} />
              Github
            </div>
          </div>
        )}
        {renderFirstInitModal()}
      </div>
    </HashRouter>
  );
};

export default Main;
