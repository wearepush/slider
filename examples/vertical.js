import 'scalable-slider/assets/index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Slider from 'scalable-slider';

const style = { float: 'left', width: 160, height: 400, marginBottom: 160, marginLeft: 50 };
const parentStyle = { overflow: 'hidden' };

const marks = {
  '-10': '-10°C',
  0: <strong>0°C</strong>,
  26: '26°C',
  37: '37°C',
  50: '50°C',
  100: {
    style: {
      color: 'red',
    },
    label: <strong>100°C</strong>,
  },
};

function log(value) {
  console.log(value); //eslint-disable-line
}

ReactDOM.render(
  <div style={parentStyle}>
    <div style={style}>
      <p>Slider with marks, `step=null`</p>
      <Slider vertical min={-10} marks={marks} step={null} onChange={log} defaultValue={20} />
    </div>
    <div style={style}>
       <p>Slider with marks and steps</p>
      <Slider vertical dots min={-10} marks={marks} step={10} onChange={log} defaultValue={20} />
    </div>
    <div style={style}>
      <p>Slider with marks, `included=false`</p>
      <Slider vertical min={-10} marks={marks} included={false} defaultValue={20} />
    </div>
    <div style={style}>
      <p>Slider with marks and steps, `included=false`</p>
      <Slider vertical min={-10} marks={marks} step={10} included={false} defaultValue={20} />
    </div>
    <div style={style}>
      <p>Range with marks</p>
      <Slider.Range vertical min={-10} marks={marks} onChange={log} defaultValue={[20, 40]} />
    </div>
    <div style={style}>
      <p>Range with marks and steps</p>
      <Slider.Range vertical min={-10} marks={marks} step={10}
        onChange={log} defaultValue={[20, 40]}
      />
    </div>
  </div>
  , document.getElementById('__react-content'));
