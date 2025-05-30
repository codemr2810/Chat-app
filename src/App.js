import "./App.css";
import ChatBox from "./feature/chat-box";
import store from "./app/store"
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <ChatBox />
    </Provider>
  );
}

export default App;
