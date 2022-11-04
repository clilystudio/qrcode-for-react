import React from 'react';

const QRCodeSVG = (props) => {
    return (
        <div className="qrcode-svg">
            <h4>{props.data || ''}</h4>
        </div>
    );
}

export default QRCodeSVG;
