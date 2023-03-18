import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

const AppMenu = () => {
  const [current, setCurrent] = useState('mode1');

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <div id="header">
      <Menu
        theme="dark"
        mode="horizontal"
        onClick={onClick}
        selectedKeys={[current]}
      >
        <Menu.Item key="mode1">
          <Link to="/">Mode 1</Link>
        </Menu.Item>
        <Menu.Item key="config">
          <Link to="/config">Config</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AppMenu;
