import React from 'react';
import { Select as SelectAnt } from 'antd';

const App = () => {
  return (
    <div style={{ background: 'white' }}>
      <div>Holi Fede 2</div>
      <div>
        <SelectAnt style={{ minWidth: 80, marginRight: 10 }} value={'A'}>
          <SelectAnt.Option value="A">A</SelectAnt.Option>
          <SelectAnt.Option value="B">B</SelectAnt.Option>
        </SelectAnt>
      </div>
    </div>
  );
};

export default App;
