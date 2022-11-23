/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import React from 'react';

const QRCodeSVG = (props) => {
    return (
        <div className="qrcode-svg">
            <h4>{props.data || ''}</h4>
        </div>
    );
};

export default QRCodeSVG;
