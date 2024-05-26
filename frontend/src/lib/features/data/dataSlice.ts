import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ChatContent {
  name: string;
  id: string;
  image: string;
  artist: string;
  message: string;
}
export interface Chat {
  type: string;
  content: ChatContent[];
}

export interface IDataState {
  chat: Chat[];
  loading: boolean;
}

const initialState: IDataState = {
  chat: [],
  loading: false,
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    addInput: (state, action: PayloadAction<string>) => {
      state.chat.push({
        type: "input",
        content: [
          {
            name: action.payload,
            id: "",
            image: "",
            artist: "",
            message: "",
          },
        ],
      });
    },

    addResult: (state, action: PayloadAction<ChatContent[]>) => {
      state.chat.push({
        type: "result",
        content: action.payload,
      });
    },

    clearState: (state) => {
      localStorage.clear();
      state.chat = [];
    },
  },
});

export const { addInput, addResult, setLoading, clearState } =
  dataSlice.actions;
export const dataReducer = dataSlice.reducer;
