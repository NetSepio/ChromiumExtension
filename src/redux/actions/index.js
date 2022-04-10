import { createAsyncThunk } from '@reduxjs/toolkit';
import { createFlowId, saveToken } from '../projects/projectSlice';
import { ethers } from 'ethers';
import { ProfileService } from '../../services/profileService';

const _ProfileService = new ProfileService();
// for data signing
export const requestFlowId = createAsyncThunk(
  'requestFlowId',
  async (walletAddress, thunkAPI) => {
    const { data } = await _ProfileService.fetchFlowByID(
      walletAddress?.address
    );
    if (data?.status === 200) {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_API_NODE_URL
      );
      const signer = new ethers.Wallet(walletAddress?.privateKey, provider);
      let signatureVal = await signer.signMessage(
        `${data?.payload?.eula}${data?.payload?.flowId}`
      );
      thunkAPI.dispatch(
        createToken({ flowId: data?.payload?.flowId, signature: signatureVal })
      );
    }
    thunkAPI.dispatch(createFlowId(data?.payload));
    return data;
  }
);
export const createToken = createAsyncThunk(
  'createToken',
  async (body, thunkAPI) => {
    // const { data } = await axios.post(`${BASE_URL}/authenticate`, body);
    const { data } = await _ProfileService.createToken(body);
    thunkAPI.dispatch(saveToken(data?.payload));
    return data;
  }
);

// for the role
export const requestFlowIdForRole = createAsyncThunk(
  'requestFlowIdForRole',
  async ({ val, privateKey, token }, thunkAPI) => {
    // const { data } = await _ProfileService.fetchRoleById(val);
    // if (data?.status === 200) {
    //   const provider = new ethers.providers.JsonRpcProvider(
    //     process.env.REACT_APP_API_NODE_URL
    //   );
    //   const signer = new ethers.Wallet(privateKey, provider);
      // let signatureVal = await signer.signMessage(
      //   `${data?.payload?.eula}${data?.payload?.flowId}`
      // );
    //   thunkAPI.dispatch(
    //     claimRole({ flowId: data?.payload?.flowId, signature: signatureVal })
    //   );
    // }
    // return data;
  }
);
export const claimRole = async (body, token) => {
  const { data } = await _ProfileService.createRole(body);
  return data;
};
