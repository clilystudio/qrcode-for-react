/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import React from 'react';
import QRCode from './core/QRCode';

const QRCodeCanvas = (props) => {
    const matrix = QRCode.generate(props.data, props.config);
    return (
        <div className="qrcode-canvas">
            <h4>{props.data || ''}</h4>
        </div>
    );
};

export default QRCodeCanvas;
