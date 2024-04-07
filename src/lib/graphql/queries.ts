export const GET_SITE_REVIEWS = `
query MyQuery($url: String!) {
  reviewCreateds(where: {siteURL: $url}) {
    id
	  siteURL
    category
    siteType
    siteType
    siteTag
    siteSafety
    domainAddress
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

export const GET_THIS_USER_NFTS = `
query MyQuery($walletAddress: String!) {
  reviewCreateds(where: {receiver: $walletAddress}) {
    tokenId
    domainAddress
    metadataURI
  }
}
`;

export	const ACCOUNT_TRANSACTIONS_QUERY = `
		query AccountTransactionsData($address: String, $limit: Int, $offset: Int) {
			address_version_from_move_resources(
				where: { address: { _eq: $address } }
				order_by: { transaction_version: desc }
				limit: $limit
				offset: $offset
			) {
				transaction_version
			}
		}
	`;

  export const COIN_ACTIVITY = `
  query CoinActivity($owner_address: String, $offset: Int) {
  coin_activities(
    where: {owner_address: {_eq: $owner_address}}
    order_by: {transaction_version: desc}
    offset: $offset
  ) {
    activity_type
    amount
    coin_type
    entry_function_id_str
    transaction_version
    transaction_timestamp
  }
}`

export const COIN_TYPE = `query CoinType($coin_type:String!) {
  coin_infos(
    where: {coin_type: {_eq: $coin_type}}
  ) {
    name
    decimals
    symbol
  }
}
`

export const TOKENS = `query GetToken($owner_address: String!) {
  current_token_ownerships_v2(where: {owner_address: {_eq: $owner_address}}) {
    amount
    current_token_data {
      description
      cdn_asset_uris {
        cdn_image_uri
      }
      token_name
    }
  }
}
`