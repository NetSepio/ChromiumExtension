import qrcode from 'qrcode';

export async function generateQRCode(text: string): Promise<string> {
	try {
		// Attempt to generate QR code data URL from the provided text
		const qrCodeDataUrl = await qrcode.toDataURL(text,{margin:0,scale:50});
		return qrCodeDataUrl;
	} catch (error) {
		// Handle any errors that occur during QR code generation
		console.error(error);
		return '';
	}
}
