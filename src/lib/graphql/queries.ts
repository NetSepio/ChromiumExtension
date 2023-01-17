export const GET_SITE_REVIEWS = `
	query getSiteReviews {
		reviews {
			id
			siteURL
			siteSafety
			siteTag
			siteType
		}
	}
`;
