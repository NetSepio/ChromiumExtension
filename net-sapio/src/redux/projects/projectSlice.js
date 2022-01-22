import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  mnemonic: '',
  activeStep:0
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
    saveHashedMnemonic:(state,action)=>{
      return {
        ...state,
        hashedMnem: action.payload.data,
      };
    },
    updateStep:(state,action)=>{
      return {
        ...state,
        activeStep: action.payload.data,
      };
    },
    clearProject: () => {
      return initialState;
    },
  },
});

export const { clearProject, addMnemonic,saveHashedMnemonic,updateStep } = projectSlice.actions;
export default projectSlice.reducer;
