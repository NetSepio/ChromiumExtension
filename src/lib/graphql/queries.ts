export const GET_SITE_REVIEWS = `
query MyQuery($url: String!) {
  reviews(where: {siteURL: $url}) {
    id
	siteURL
    category
    siteType
    siteType
    siteTag
    siteSafety
  }
}
`;

export const GET_THIS_USER_DATA = `
query MyQuery($id: ID!) {
  user(id: $id) {
    id
    roles
  }
}
`;
