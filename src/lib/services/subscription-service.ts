/**
 * Subscription service for checking user subscription status
 */

export interface SubscriptionStatus {
	isActive: boolean;
	status?: string;
	error?: string;
	hasNoSubscription?: boolean; // New field to indicate if user has no subscription data
	expiryDate?: string; // ISO date string
	daysRemaining?: number;
	subscriptionType?: string; // trial, basic, premium, etc.
}

export interface TrialResult {
	success: boolean;
	message?: string;
	error?: string;
}

/**
 * Calculate days remaining until expiry
 */
function calculateDaysRemaining(expiryDate: string): number {
	try {
		const expiry = new Date(expiryDate);
		const now = new Date();
		const diffTime = expiry.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return Math.max(0, diffDays);
	} catch {
		return 0;
	}
}

/**
 * Check if user has an active subscription
 * @param jwtToken - JWT token for authentication
 * @returns Promise resolving to subscription status
 */
export async function checkUserSubscription(jwtToken: string | null): Promise<SubscriptionStatus> {
	try {
		const response = await fetch('https://gateway.netsepio.com/api/v1.0/subscription', {
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {})
			}
		});

		if (!response.ok) {
			// Handle 404 or similar - might mean no subscription exists
			if (response.status === 404) {
				return {
					isActive: false,
					hasNoSubscription: true,
					error: 'No subscription found'
				};
			}
			return { isActive: false, error: 'Failed to check subscription' };
		}

		const data = await response.json();
		console.log('Subscription data:', data);

		// Check if subscription data exists and has status
		if (!data || typeof data.status === 'undefined') {
			return {
				isActive: false,
				hasNoSubscription: true,
				error: 'No subscription status found'
			};
		}

		// Handle "notFound" status - user has no subscription/trial
		if (data.status === 'notFound') {
			return {
				isActive: false,
				hasNoSubscription: true,
				status: data.status,
				error: 'No subscription found'
			};
		}

		// Extract subscription details from nested structure
		const subscription = data.subscription || {};
		const subscriptionType = subscription.type || data.type || undefined;
		const expiryDate = subscription.endTime || data.expiryDate || data.expires_at || data.endDate;

		return {
			isActive: data.status === 'active',
			status: data.status,
			hasNoSubscription: false,
			expiryDate: expiryDate,
			subscriptionType: subscriptionType,
			daysRemaining: expiryDate ? calculateDaysRemaining(expiryDate) : undefined
		};
	} catch {
		return {
			isActive: false,
			hasNoSubscription: true,
			error: 'Network error while checking subscription'
		};
	}
}

/**
 * Request a trial subscription for the user
 * @param jwtToken - JWT token for authentication
 * @returns Promise resolving to trial request result
 */
export async function requestTrial(jwtToken: string | null): Promise<TrialResult> {
	if (!jwtToken) {
		return { success: false, error: 'Authentication required' };
	}

	try {
		const response = await fetch('https://gateway.netsepio.com/api/v1.0/subscription/trial', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${jwtToken}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			return {
				success: false,
				error: errorData.message || `Failed to create trial (${response.status})`
			};
		}

		const data = await response.json();
		console.log('Trial response:', data);

		return {
			success: true,
			message: data.status || 'Trial subscription created successfully'
		};
	} catch (error) {
		console.error('Trial request error:', error);
		return {
			success: false,
			error: 'Network error while requesting trial'
		};
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
