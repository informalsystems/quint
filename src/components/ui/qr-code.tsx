"use client";

import QRCode from 'qrcode.react';
import * as React from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
}

const QRCodeComponent = React.forwardRef<SVGSVGElement, QRCodeProps>(
  ({ value, size = 256, level = "H" }, ref) => {
    return (
      <QRCode
        ref={ref}
        value={value}
        size={size}
        level={level}
      />
    );
  }
);
QRCodeComponent.displayName = "QRCodeComponent";

export { QRCodeComponent as QRCode };
