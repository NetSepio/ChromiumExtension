import { ApiHelper } from './helper/ApiHelper';
import { BASE_URL } from './helper/config';

const apiHelper = new ApiHelper();

console.log(BASE_URL,"..baseUrl")
export class ProfileService {
  fetchFlowByID(walletAddress) {
    const uri = `${BASE_URL}/flowid?walletAddress=${walletAddress}`;
    return apiHelper.get(uri);
  }
  createToken(val) {
    const uri = `${BASE_URL}/authenticate`;
    return apiHelper.post(uri, val);
  }
  fetchRoleById(roleId) {
    const uri = `${BASE_URL}/roleId/${roleId}`;
    return apiHelper.get(uri);
  }
  createRole(val) {
    const uri = `${BASE_URL}/claimrole`;
    return apiHelper.post(uri, val);
  }
  claimRole(val) {
    const uri = `${BASE_URL}/profile`;
    return apiHelper.post(uri, val);
  }
  createReview(data) {
    const uri = `${BASE_URL}/delegateReviewCreation`;
    return apiHelper.post(uri, data);
  }
}
