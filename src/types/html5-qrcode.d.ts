// types/html5-qrcode.d.ts
declare module 'html5-qrcode' {
  export class Html5Qrcode {
    constructor(elementId: string);
    start(
      cameraIdOrConfig: string | { facingMode: string },
      config: { fps: number; qrbox: { width: number; height: number } },
      qrCodeSuccessCallback: (decodedText: string) => void,
      qrCodeErrorCallback: (errorMessage: string) => void
    ): Promise<void>;
    stop(): Promise<void>;
    isScanning: boolean;
  }
}