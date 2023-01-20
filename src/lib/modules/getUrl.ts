export function listenForUrl() {
    chrome.runtime.onMessage.addListener((request) => {
        return request.url;
    });
}
