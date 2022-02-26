import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createFlowId, saveToken } from '../projects/projectSlice';
import { ethers } from 'ethers';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const requestFlowId = createAsyncThunk(
  'requestFlowId',
  async (walletAddress, thunkAPI) => {
    const { data } = await axios.get(
      `${BASE_URL}/flowid?walletAddress=${walletAddress}`
    );
    if (data?.status === 200) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
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
    const { data } = await axios.post(`${BASE_URL}/authenticate`, body);
    console.log(data, 'hey data');
    thunkAPI.dispatch(saveToken(data?.payload));
    return data;
  }
);
