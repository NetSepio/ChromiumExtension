import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  mnemonic: "",
  walletAddress: "",
  privateKey: "",
  activeStep: 0,
  tab: 0,
  hashedMnem: "",
  dynamicUrl: "",
  tokenContractAddress: [],
  flow: {
    eula: "",
    flowId: "",
    token: "",
  },
};

export const projectSlice = createSlice({
  name: "project",
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
    addCustomToken: (state, action) => {
      const { tokenDecimal, tokenSymbol, balance, address } =
        action.payload.data;
      return {
        ...state,
        tokenContractAddress: [
          ...state.tokenContractAddress,
          {
            tokenDecimal: tokenDecimal,
            tokenSymbol: tokenSymbol,
            balance: parseInt(balance?._hex) / 10 ** tokenDecimal,
            address: address,
          },
        ],
      };
    },
    removeToken: (state, action) => {
      return {
        ...state,
        tokenContractAddress: action.payload.data,
      };
    },
    editCustomToken: (state, action) => {
      const { tokenDecimal, tokenSymbol, balance, address } =
        action.payload.data;
      let edited = state.tokenContractAddress.map((addr) => {
        if (addr.address === address) {
          return {
            ...addr,
            balance: parseInt(balance?._hex) / 10 ** tokenDecimal,
          };
        } else {
          return addr;
        }
      });
      return {
        ...state,
        tokenContractAddress: edited,
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
  addCustomToken,
  removeToken,
  editCustomToken,
} = projectSlice.actions;
export default projectSlice.reducer;
