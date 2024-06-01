import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IAuthState {
  user: {} | null;
  loading: boolean;
  error: string | null;
}

const initialState: IAuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{}>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearState: (state) => {
      localStorage.clear();
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, clearState } = authSlice.actions;
export const authReducer = authSlice.reducer;
