"use client";

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {QRCode} from '@/components/ui/qr-code';
import {useState} from "react";

export default function QRCodePaymentPage() {
  const [qrCodeValue, setQrCodeValue] = useState('SardexPayment:12345');

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>QR Code Payment</CardTitle>
          <CardDescription>Scan the QR code to make a payment.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <QRCode value={qrCodeValue} size={256} level="H"/>
          <p className="mt-4 text-sm text-muted-foreground">
            Or, use this value directly: <strong>{qrCodeValue}</strong>
          </p>
          <Button className="mt-4">Confirm Payment</Button>
        </CardContent>
      </Card>
    </div>
  );
}
