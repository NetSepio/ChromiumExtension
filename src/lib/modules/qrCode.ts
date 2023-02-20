import qrcode from 'qrcode';

export async function generateQRCode(text: string): Promise<string> {
  try {
    const qrCodeDataUrl = await qrcode.toDataURL(text);
    return qrCodeDataUrl;
  } catch (error) {
    console.error(error);
    return '';
  }
}