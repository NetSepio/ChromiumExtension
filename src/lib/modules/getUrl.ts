// Function to listen for messages from the Chrome extension
export function listenForUrl() {
	// Using chrome.runtime.onMessage to add a listener for incoming messages
	chrome.runtime.onMessage.addListener((request) => {
		// Returning the URL from the received message
		return request.url;
	});
}
