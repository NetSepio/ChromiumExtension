import { jwtToken } from '$lib/store/store';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';

export const fetchUserProfileData = async () => {
	let jwt = '';
	let error = '';
	jwtToken.subscribe((value) => (jwt = value));

	try {
		let response = await fetch(`${PUBLIC_GATEWAY_URL}/profile`, {
			method: 'GET',
			headers: {
				Authorization: jwt
			}
		});
		let data = await response.json();
		return [data, null];
	} catch (err: any) {
		error = err;
		return [null, error];
	}
};
