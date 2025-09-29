
'use client';

import { useRef, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { verifyAttendeeAction } from '@/actions/verify-attendee';
import { Barcode, ScanLine } from 'lucide-react';

export default function ScannerPage() {
  const { toast } = useToast();
  const [lastResult, setLastResult] = useState<string | null>(null);
  const processingRef = useRef(false);

  const handleScanResult = (result: string) => {
    if (result && result !== lastResult && !processingRef.current) {
        processingRef.current = true;
        setLastResult(result);

        // This function will still run asynchronously
        (async () => {
            const response = await verifyAttendeeAction(result);

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

            // Prevent re-scanning the same code for 3 seconds
            setTimeout(() => {
                processingRef.current = false;
                setLastResult(null);
            }, 3000);
        })();
    }
  };


  return (
    <Card>
        <CardHeader>
            <CardTitle>QR Code Scanner</CardTitle>
            <CardDescription>Scan attendee QR codes to check them in.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="w-full max-w-md mx-auto p-4 border-2 border-dashed rounded-lg">
                <Scanner
                    onResult={(text, result) => handleScanResult(text)}
                    onError={(error) => console.log(error?.message)}
                    containerStyle={{ width: '100%', paddingTop: '100%', position: 'relative' }}
                    videoStyle={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    scanDelay={500}
                    components={{
                        audio: false,
                        finder: ({ width, height, top, left }) => (
                            <>
                                <ScanLine className="absolute text-primary animate-pulse" style={{ top: top, left: left, width: width, height: height }} />
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: '50px solid rgba(0, 0, 0, 0.3)',
                                    boxSizing: 'border-box'
                                }}></div>
                            </>
                        ),
                    }}
                />
            </div>
            <div className="mt-4 text-center text-muted-foreground flex items-center justify-center gap-2">
                <Barcode className="h-5 w-5"/>
                <p>Point the camera at a QR code</p>
            </div>
        </CardContent>
    </Card>
  );
}


