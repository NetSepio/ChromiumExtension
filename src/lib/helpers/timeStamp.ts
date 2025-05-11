// Store data with a timestamp
export function setData(key: string, value: string, expirationMinutes: number) {
	const now = new Date();
	const item = {
		value: value,
		expiration: now.getTime() + expirationMinutes * 60 * 1000 // Convert minutes to milliseconds
	};
	localStorage.setItem(key, JSON.stringify(item));
}

// Retrieve data and check if it's expired
export function getData(key: string) {
	const itemStr = localStorage.getItem(key);
	if (!itemStr) return null;

	const item = JSON.parse(itemStr);
	const now = new Date().getTime();
	if (now > item.expiration) {
		// Data has expired, remove it
		localStorage.removeItem(key);
		return null;
	}

	return item.value;
}
