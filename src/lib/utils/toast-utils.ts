/**
 * Toast notification utility functions
 */

export interface ToastState {
	toast: boolean;
	toastStatus: string;
	toastSuccess: boolean;
	toastError: boolean;
	connectionStatusMsg: string;
	connectionStatusType: string;
	disableConnect: boolean;
}

export interface ToastManager {
	showToast: (statusMsg: string, isSuccess: boolean, isError: boolean) => void;
	clearToast: () => void;
	state: ToastState;
}

/**
 * Creates a toast manager with timeout functionality
 * @param initialState - Initial state for toast
 * @param updateState - Function to update the toast state
 * @returns Toast manager object
 */
export function createToastManager(
	initialState: ToastState,
	updateState: (updates: Partial<ToastState>) => void
): ToastManager {
	let toastTimeout: ReturnType<typeof setTimeout> | null = null;

	const showToast = (statusMsg: string, isSuccess: boolean, isError: boolean) => {
		if (toastTimeout) {
			clearTimeout(toastTimeout);
		}

		updateState({
			toastStatus: statusMsg,
			toastSuccess: isSuccess,
			toastError: isError,
			toast: true,
			connectionStatusMsg: statusMsg
		});

		// Set connection status type and disable state
		if (isSuccess) {
			updateState({
				connectionStatusType: 'active',
				disableConnect: false
			});
		} else if (isError) {
			updateState({
				connectionStatusType: 'inactive',
				disableConnect: true
			});
		} else {
			updateState({
				connectionStatusType: '',
				disableConnect: false
			});
		}

		// Auto-hide toast after 3 seconds
		toastTimeout = setTimeout(() => {
			updateState({ toast: false });
		}, 3000);
	};

	const clearToast = () => {
		if (toastTimeout) {
			clearTimeout(toastTimeout);
			toastTimeout = null;
		}
		updateState({ toast: false });
	};

	return {
		showToast,
		clearToast,
		state: initialState
	};
}
