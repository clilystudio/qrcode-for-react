/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import React from 'react';
import QRCode from './core/QRCode';

const QRCodeSVG = (props) => {
  const matrix = QRCode.generate(props.data, props.config);
  const darkColor = props.config.dark === undefined ? 'black' : props.config.dark;
  const lightColor = props.config.light === undefined ? 'white' : props.config.light;
  return (
    <div className="qrcode-svg">
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 177 177">
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
        <rect width="100%" height="100%" class="qrcode-module light" />
        <rect x="10" y="10" width="30" height="30" class="qrcode-module dark" />
        <rect x="10" y="40" width="30" height="30" class="qrcode-module dark" />
        <rect x="40" y="40" width="30" height="30" class="qrcode-module dark" />
      </svg>
    </div>
  );
};

export default QRCodeSVG;
