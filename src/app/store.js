import { configureStore } from '@reduxjs/toolkit';
import chatReducer from "../feature/chat-slice";

const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});

export default store;
