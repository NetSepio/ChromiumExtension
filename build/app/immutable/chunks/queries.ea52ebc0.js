import{c as a}from"./public.dc121523.js";const i=async(t,s={})=>{try{const e=await(await fetch(a,{method:"POST",redirect:"follow",body:JSON.stringify({query:t,variables:s})})).json();if(e.errors)throw new Error(e.errors[0].message);return e.data}catch(r){throw r}},d=`
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
`,n=`
query MyQuery($walletAddress: String!) {
  reviewCreateds(where: {receiver: $walletAddress}) {
    tokenId
    domainAddress
    metadataURI
  }
}
`;export{d as G,n as a,i as f};
