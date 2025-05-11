// Function to download mnemonic as a text file
export const downloadMnemonic = (secretKey: string) => {
	// Set the filename for the downloaded file
	const filename = 'mnemonic.txt';

	// Create a Blob (Binary Large Object) containing the secretKey with MIME type 'text/plain'
	const blob = new Blob([secretKey], { type: 'text/plain' });

	// Create a URL for the Blob
	const url = window.URL.createObjectURL(blob);

	// Create an anchor element
	const a = document.createElement('a');

	// Set the href attribute of the anchor to the Blob URL
	a.href = url;

	// Set the download attribute to specify the filename
	a.download = filename;

	// Simulate a click on the anchor to trigger the download
	a.click();

	// Revoke the Blob URL to free up resources
	window.URL.revokeObjectURL(url);
};
