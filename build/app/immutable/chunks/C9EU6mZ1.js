const _=async(r,n={},o)=>{try{const e=await(await fetch(o,{method:"POST",redirect:"follow",body:JSON.stringify({query:r,variables:n})})).json();if(e.errors)throw new Error(e.errors[0].message);return e.data}catch(t){throw t}},s=`query CoinType($coin_type:String!) {
  coin_infos(
    where: {coin_type: {_eq: $coin_type}}
  ) {
    name
    decimals
    symbol
  }
}
`,a=`query GetSingleToken($owner_address: String!, $token_data_id: String!) {
   current_token_ownerships_v2(
    where: {owner_address: {_eq: $owner_address}, token_data_id: {_eq: $token_data_id}}
  ) {
    token_data_id
    current_token_data {
      description
      cdn_asset_uris {
        cdn_image_uri
      }
      token_name
      token_properties
      current_collection {
        creator_address
        collection_name
         cdn_asset_uris {
          cdn_image_uri
        }
      }
    }
    owner_address
  }
  token_activities_v2(
    where: {token_data_id: {_eq: $token_data_id}, _not: {to_address: {_is_null: true}}}
    order_by: {transaction_version: desc}
  ) {
    entry_function_id_str
    from_address
    to_address
    transaction_timestamp
    transaction_version
  }
}
`;export{s as C,a as T,_ as f};
