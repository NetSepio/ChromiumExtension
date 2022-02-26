import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  mnemonic: '',
  walletAddress: '',
  activeStep: 0,
  flow: {
    eula: '',
    flowId:'',
    token:''
  },
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addMnemonic: (state, action) => {
      return {
        ...state,
        mnemonic: action.payload.data,
      };
    },
    saveHashedMnemonic: (state, action) => {
      return {
        ...state,
        hashedMnem: action.payload.data,
      };
    },
    saveWalletAddress: (state, action) => {
      return {
        ...state,
        walletAddress: action.payload.data,
      };
    },
    updateStep: (state, action) => {
      return {
        ...state,
        activeStep: action.payload.data,
      };
    },
    clearProject: () => {
      return initialState;
    },
    createFlowId: (state, action) => {
      return {
        ...state,
        flow: {
          eula:action.payload.eula,
          flowId: action.payload.flowId,
        },
      };
    },
    saveToken: (state, action) => {
      return {
        ...state,
        flow: {
          ...state.flow,
          token:action.payload.token
        },
      };
    },
  },
});

export const {
  clearProject,
  createFlowId,
  addMnemonic,
  saveHashedMnemonic,
  updateStep,
  saveWalletAddress,
  saveToken
} = projectSlice.actions;
export default projectSlice.reducer;
