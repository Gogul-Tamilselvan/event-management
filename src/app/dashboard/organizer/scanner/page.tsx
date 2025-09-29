
'use client';

import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import type { Html5QrcodeResult } from 'html5-qrcode/esm/html5-qrcode';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { verifyAttendeeAction } from '@/actions/verify-attendee';
import { Barcode } from 'lucide-react';

const QR_READER_ID = "qr-reader";

export default function ScannerPage() {
  const { toast } = useToast();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const lastScannedId = useRef<string | null>(null);
  const scanTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // This function will only run on the client
    const onScanSuccess = (decodedText: string, result: Html5QrcodeResult) => {
      // Prevent re-scanning the same code for a few seconds
      if (decodedText === lastScannedId.current) {
        return;
      }
      lastScannedId.current = decodedText;

      // Set a timeout to clear the last scanned ID
      if (scanTimeout.current) {
        clearTimeout(scanTimeout.current);
      }
      scanTimeout.current = setTimeout(() => {
        lastScannedId.current = null;
      }, 3000); // 3-second cooldown

      // Pause the scanner to prevent immediate re-scans
      if (scannerRef.current) {
        scannerRef.current.pause(true);
      }

      (async () => {
        const response = await verifyAttendeeAction(decodedText);

        if (response.success) {
          toast({
            title: 'Check-in Successful',
            description: `${response.attendeeName} has been checked in.`,
          });
        } else {
          toast({
            title: 'Check-in Failed',
            description: response.message,
            variant: 'destructive',
          });
        }

        // Resume scanning after a short delay
        setTimeout(() => {
            if(scannerRef.current?.getState() === 2) { // 2 is PAUSED state
                 scannerRef.current.resume();
            }
        }, 2000);

      })();
    };

    const onScanFailure = (error: any) => {
      // This is called frequently, so we can ignore it unless we want to log errors.
      // console.warn(`QR error = ${error}`);
    };

    if (typeof window !== 'undefined') {
        scannerRef.current = new Html5QrcodeScanner(
            QR_READER_ID,
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                rememberLastUsedCamera: true,
            },
            /* verbose= */ false
        );
        scannerRef.current.render(onScanSuccess, onScanFailure);
    }
    
    // Cleanup function to stop the scanner
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner.", error);
        });
      }
      if (scanTimeout.current) {
          clearTimeout(scanTimeout.current);
      }
    };
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Scanner</CardTitle>
        <CardDescription>Scan attendee QR codes to check them in.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full max-w-md mx-auto">
          <div id={QR_READER_ID} />
        </div>
         <div className="mt-4 text-center text-muted-foreground flex items-center justify-center gap-2">
            <Barcode className="h-5 w-5"/>
            <p>Point the camera at a QR code</p>
        </div>
      </CardContent>
    </Card>
  );
}
