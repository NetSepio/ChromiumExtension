import qrcode from 'qrcode';

export async function generateQRCode(address: string) {
	try {
		const qrCodeDataUrl = await qrcode.toDataURL(address, { margin: 0, scale: 50 });
		return qrCodeDataUrl;
	} catch (error) {
		alert('There seems to be something wrong: ' + error);
	}
}
