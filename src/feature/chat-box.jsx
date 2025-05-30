import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageBox from "./message-box";
import { clearMessage, sendMessage, syncMessages } from "./chat-slice";

const ChatBox = () => {
  const [user, setUser] = useState("Alex");
  const [inputMessage, setInputMessage] = useState("");
  // const [isSyncing, setIsSyncing] = useState(false);
  const messages = useSelector((state) => state.chat.message);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [hasLoadedDemo, setHasLoadedDemo] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'chatflow-messages' && e.newValue) {
        try {
          // setIsSyncing(true);
          const newMessages = JSON.parse(e.newValue);
          dispatch(syncMessages(newMessages));
          // setTimeout(() => setIsSyncing(false), 1000);
        } catch (error) {
          console.error('Error parsing messages from storage:', error);
          // setIsSyncing(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  const loadDemoMessages = () => {
    const demoMessages = [
      {
        user: "Sarah",
        text: "Hey Alex! 👋 Welcome to ChatFlow Pro!",
        timestamp: "10:30"
      },
      {
        user: "Alex",
        text: "Hi Sarah! This looks amazing! 🚀",
        timestamp: "10:31"
      },
      {
        user: "Sarah",
        text: "I love the new design with the gradient backgrounds and smooth animations! ✨",
        timestamp: "10:32"
      },
      {
        user: "Alex",
        text: "The glass morphism effect is really cool. Perfect for a modern chat app! 💎",
        timestamp: "10:33"
      }
    ];

    demoMessages.forEach((msg, index) => {
      setTimeout(() => {
        dispatch(sendMessage(msg));
      }, index * 800);
    });

    setHasLoadedDemo(true);
  };

  const handleSend = () => {
    if (!inputMessage?.trim()) return;

    dispatch(sendMessage({
      user,
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
    setInputMessage("");
  };

  const users = [
    { name: "Alex", color: "from-blue-500 to-purple-600" },
    { name: "Sarah", color: "from-pink-500 to-rose-600" }
  ];

  const currentUserData = users.find(u => u.name === user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-2xl">
        {/* Chat Container */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden animate-pulse-glow">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  💬
                </div>
                <div>
                  <h1 className="text-xl font-bold">ChatFlow Pro</h1>
                  <p className="text-blue-100 text-sm">Real-time messaging</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Selection */}
          <div className="p-4 bg-white/5 border-b border-white/10">
            <p className="text-white/70 text-sm mb-2 text-center">Choose your identity</p>
            <p className="text-white/50 text-xs mb-3 text-center">💡 Open in multiple tabs to see real-time sync!</p>
            <div className="flex justify-center gap-3">
              {users?.map((userData) => (
                <button
                  key={userData.name}
                  onClick={() => setUser(userData.name)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                    user === userData.name
                      ? `bg-gradient-to-r ${userData.color} text-white shadow-lg`
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  <span className="font-medium">{userData.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/5 to-white/10 custom-scrollbar">
            {messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-white/50">
                <div className="text-6xl mb-4 animate-float">💭</div>
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm mb-4">Start a conversation!</p>
                {!hasLoadedDemo && (
                  <button
                    onClick={loadDemoMessages}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    ✨ Load Demo Conversation
                  </button>
                )}
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className="message-bubble">
                    <MessageBox
                      currentUser={user}
                      messageUser={msg.user}
                      msg={msg}
                      users={users}
                    />
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${currentUserData?.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                {currentUserData?.name?.trim()?.charAt(0)?.toUpperCase()}
              </div>

              <div className="flex-1 relative">
                <input
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  placeholder={`Message as ${user}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              </div>

              <button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={!inputMessage.trim()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>

              <button
                onClick={() => dispatch(clearMessage())}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                title="Clear chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/50 text-sm">
            Built with ❤️ using React & Redux Toolkit
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
