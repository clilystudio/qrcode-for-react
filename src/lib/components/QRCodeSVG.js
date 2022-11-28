/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import React from 'react';
import QRCode from './core/QRCode';

const QRCodeSVG = (props) => {
  const darkColor = props.config.dark === undefined ? 'black' : props.config.dark;
  const lightColor = props.config.light === undefined ? 'white' : props.config.light;
  const matrix = QRCode.generate(props.data, props.config);
  const size = matrix.version * 4 + 17;
  const symbolSize = size + 8;
  const modules = [];
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (matrix.getBit(x, y)) {
        modules.push(<rect x={x + 4} y={y + 4} width="1" height="1" className="qrcode-module dark" key={x * size + y} />);
      }
    }
  }
  return (
    <div className="qrcode-svg">
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox={'0 0 ' + symbolSize + ' ' + symbolSize}>
        <defs>
            <style type="text/css">
              {`
              .qrcode-module {
                stroke-width: 0;
                shape-rendering: crispEdges;
              }
              .qrcode-module.dark {
                fill: ${darkColor};
              }
              .qrcode-module.light {
                fill: ${lightColor};
              }
              `}
            </style>
        </defs>
        <rect width="100%" height="100%" className="qrcode-module light" />
        {modules}
      </svg>
    </div>
  );
};

export default QRCodeSVG;
