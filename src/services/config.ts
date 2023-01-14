const baseUrl = process.env.REACT_APP_API_BASE_URL;
const nodeUrl = process.env.REACT_APP_API_NODE_URL;

console.log(baseUrl, "baserUrl");
console.log(nodeUrl, "nodeurl");

export const BASE_URL = `${baseUrl}`;
export const NODE_URL = `${nodeUrl}`;