/**
 * Port checker service for validating node connectivity
 */

export interface PortCheckResult {
	isOpen: boolean;
	error?: string;
}

/**
 * Check if a specific port is open on a given host
 * @param host - The host IP address to check
 * @param port - The port number to check (default: 8088)
 * @returns Promise resolving to port check result
 */
export async function checkPortStatus(host: string, port: number = 8088): Promise<PortCheckResult> {
	try {
		const response = await fetch('https://portchecker.io/api/query', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ host, ports: [port] })
		});

		if (!response.ok) {
			return { isOpen: false, error: 'Portchecker API error' };
		}

		const data = await response.json();

		if (data.error || !data.check || !Array.isArray(data.check)) {
			return { isOpen: false, error: 'Could not check connection (API error)' };
		}

		const status = data.check[0]?.status;
		return { isOpen: status === true };
	} catch {
		return { isOpen: false, error: 'Could not check connection (network error)' };
	}
}
