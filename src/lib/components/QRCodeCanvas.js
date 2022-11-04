import React from 'react';

const QRCodeCanvas = (props) => {
    return (
        <div className="qrcode-canvas">
            <h4>{props.data || ''}</h4>
        </div>
    );
}

export default QRCodeCanvas;
