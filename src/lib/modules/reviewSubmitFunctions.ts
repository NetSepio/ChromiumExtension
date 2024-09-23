// Import necessary libraries and environment variables
import { NFTStorage, File } from 'nft.storage';
import {
	PUBLIC_NFT_STORAGE_API_KEY,
	PUBLIC_GATEWAY_URL,
	PUBLIC_PINATA_JWT
} from '$env/static/public';
import { jwtToken } from '$lib/store/store';

// Initialize NFT.Storage client with the API key
const client = new NFTStorage({ token: PUBLIC_NFT_STORAGE_API_KEY });

// Define metadata structureol
interface MetaDataType {
	name: string;
	description: string;
	category: string;
	image: string;
	domainAddress: string;
	siteUrl: string | undefined;
	siteType: string;
	siteTag: string;
	siteSafety: string;
	siteRating: number;
}

// Define review structure
interface ReviewType {
	category: string;
	domainAddress: string;
	siteUrl: string | undefined;
	siteType: string;
	siteTag: string;
	siteSafety: string;
	metaDataUri: string;
}

// Function to store metadata using NFT.Storage
export const storeMetaData = async (data: MetaDataType) => {
	try {
		// Convert metadata to a JSON string
		const objectString = JSON.stringify(data);
		// Create a Blob from the JSON string
		const objectBlob = new Blob([objectString], { type: 'application/json' });
		// Store the metadata using NFT.Storage and get the CID
		const metadata = await client.storeBlob(objectBlob);
		// Return the CID and no error
		return [metadata, null];
	} catch (error) {
		// If an error occurs, log it and return [null, error]
		console.error(error);
		return [null, error];
	}
};

// Function to create a review
export const createReview = async (data: ReviewType) => {
	try {
		let token = '';
		// Get the JWT token from the store
		jwtToken.subscribe((val) => (token = val));

		// Define HTTP request options
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(data)
		};

		// Make a POST request to the public gateway for review creation
		let response = await fetch(`${PUBLIC_GATEWAY_URL}/delegateReviewCreation`, options);
		let result = await response.json();

		// Return the result of the review creation
		return result;
	} catch (error) {
		// If an error occurs, log it and return [null, error]
		console.error(error);
		return [null, error];
	}
};

// Function to store metadata using Pinata
export async function storeMetaDataPin(data: MetaDataType) {
	try {
		// Convert metadata to JSON string and then to a Blob
		const objectString = JSON.stringify(data);
		const objectBlob = new Blob([objectString], { type: 'application/json' });

		// Pin the metadata Blob to Pinata
		const metadataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${PUBLIC_PINATA_JWT}`
			},
			body: objectBlob
		});

		const metadata = await metadataResponse.json();

		// Create FormData object and append file and metadata
		const formData = new FormData();

		formData.append('metadata', JSON.stringify(metadata));

		// Upload the file to your API endpoint

		console.log(metadata.IpfsHash);

		// Return the metadata
		return [metadata.IpfsHash, null];
	} catch (error) {
		console.error(error);

		return [null, error];
	}
}
