import { createAsyncThunk } from "@reduxjs/toolkit";
import { createFlowId, saveToken } from "./projectSlice";
import { ethers } from "ethers";
import { ProfileService } from "../services/profileService";

const _ProfileService = new ProfileService();

interface WalletAddress {
  address: string;
  privateKey: string;
}

export const requestFlowId = createAsyncThunk(
  "requestFlowId",
  async (walletAddress: WalletAddress | null, thunkAPI) => {
    if (!walletAddress) {
      throw new Error("walletAddress is required");
    }
    const { data } = await _ProfileService.fetchFlowByID(walletAddress.address);
    if (data?.status === 200) {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_API_NODE_URL
      );
      const signer = new ethers.Wallet(walletAddress.privateKey, provider);
      let signatureVal = await signer.signMessage(
        `${data?.payload?.eula}${data?.payload?.flowId}`
      );
      const createTokenAction = { type: 'createToken', payload: { flowId: data?.payload?.flowId, signature: signatureVal } }
      thunkAPI.dispatch(createTokenAction)
    }
    thunkAPI.dispatch(createFlowId(data?.payload));
    return data;
  }
);


export const createToken = createAsyncThunk(
  "createToken",
  async (body, thunkAPI) => {
    const { data } = await _ProfileService.createToken(body);
    thunkAPI.dispatch(saveToken(data?.payload));
    return data;
  }
);

export const claimRole = async (body, token) => {
  const { data } = await _ProfileService.createRole(body);
  return data;
};
