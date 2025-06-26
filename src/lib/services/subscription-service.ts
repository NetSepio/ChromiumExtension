/**
 * Subscription service for checking user subscription status
 */

export interface SubscriptionStatus {
	isActive: boolean;
	status?: string;
	error?: string;
}

/**
 * Check if user has an active subscription
 * @param jwtToken - JWT token for authentication
 * @returns Promise resolving to subscription status
 */
export async function checkUserSubscription(jwtToken: string | null): Promise<SubscriptionStatus> {
	try {
		const response = await fetch('https://gateway.erebrus.io/api/v1.0/subscription/', {
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {})
			}
		});

		if (!response.ok) {
			return { isActive: false, error: 'Failed to check subscription' };
		}

		const data = await response.json();
		console.log('Subscription data:', data);

		return {
			isActive: data.status === 'active',
			status: data.status
		};
	} catch {
		return { isActive: false, error: 'Network error while checking subscription' };
	}
}

/**
 * Redirect user to subscription dashboard
 * @param delay - Delay in milliseconds before redirecting (default: 3000)
 */
export function redirectToSubscriptionDashboard(delay: number = 3000): void {
	setTimeout(() => {
		window.open('https://erebrus.io/dashboard', '_blank');
	}, delay);
}
