import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IDataState {
  input: string;
  result: string;
}

const initialState: IDataState = {
  input: "",
  result: "",
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setInput: (state, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setResult: (state, action: PayloadAction<string>) => {
      state.result = action.payload;
    },
    clearState: (state) => {
      localStorage.clear();
      state.input = "";
      state.result = "";
    },
  },
});

export const { setInput, setResult, clearState } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;
