import { createSlice } from "@reduxjs/toolkit";

// Load messages from localStorage on app start
const loadMessagesFromStorage = () => {
  try {
    const savedMessages = localStorage.getItem('chatflow-messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  } catch (error) {
    console.error('Error loading messages from localStorage:', error);
    return [];
  }
};

// Save messages to localStorage
const saveMessagesToStorage = (messages) => {
  try {
    localStorage.setItem('chatflow-messages', JSON.stringify(messages));
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'chatflow-messages',
      newValue: JSON.stringify(messages)
    }));
  } catch (error) {
    console.error('Error saving messages to localStorage:', error);
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    message: loadMessagesFromStorage(),
  },
  reducers: {
    sendMessage: (state, action) => {
      state.message.push(action.payload);
      saveMessagesToStorage(state.message);
    },
    clearMessage: (state) => {
      state.message = [];
      saveMessagesToStorage([]);
    },
    syncMessages: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { sendMessage, clearMessage, syncMessages } = chatSlice.actions;
export default chatSlice.reducer;
