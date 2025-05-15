export const removeIpfsPrefix = (input: string | undefined) => {
	// Check if input is not undefined before performing replace
	return input?.replace('ipfs://', '');
};
