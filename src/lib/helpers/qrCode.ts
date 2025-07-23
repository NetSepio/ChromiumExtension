/**
 * Generate QR Code for wallet address
 * @param address - Wallet address to generate QR code for
 * @returns Promise<string | null> - QR code data URL or null if failed
 */
export async function generateQRCode(address: string): Promise<string | null> {
	try {
		// Simple QR code generation using a free service
		// In production, you might want to use a proper QR code library
		const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`;
		return qrUrl;
	} catch (error) {
		console.error('Error generating QR code:', error);
		return null;
	}
}
