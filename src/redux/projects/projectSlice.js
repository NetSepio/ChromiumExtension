import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  mnemonic: '',
  walletAddress: '',
  privateKey: '',
  activeStep: 0,
  tab: 0,
  hashedMnem: '',
  dynamicUrl: '',
  flow: {
    eula: '',
    flowId: '',
    token: '',
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
    updateTab: (state, action) => {
      return {
        ...state,
        tab: action.payload.data,
      };
    },
    clearProject: () => {
      return initialState;
    },
    createFlowId: (state, action) => {
      return {
        ...state,
        flow: {
          eula: action.payload.eula,
          flowId: action.payload.flowId,
        },
      };
    },
    saveToken: (state, action) => {
      return {
        ...state,
        flow: {
          ...state.flow,
          token: action.payload.token,
        },
      };
    },
    savePrivateKey: (state, action) => {
      return {
        ...state,
        privateKey: action.payload.data,
      };
    },
    changeDynamicURL: (state, action) => {
      return {
        ...state,
        dynamicUrl: action.payload.data,
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
  updateTab,
  saveWalletAddress,
  saveToken,
  savePrivateKey,
  changeDynamicURL,
} = projectSlice.actions;
export default projectSlice.reducer;
