const MessageBox = ({ currentUser, messageUser, msg, users }) => {
  const isCurrentUser = messageUser === currentUser;
  const userData = users?.find(u => u.name === messageUser) || {
    name: messageUser,
    color: "from-gray-500 to-gray-600"
  };

  return (
    <div className={`flex items-end space-x-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser && (
        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${userData.color} flex items-center justify-center text-sm font-bold text-white shadow-lg flex-shrink-0`}>
          {userData?.name?.trim()?.charAt(0)?.toUpperCase()}
        </div>
      )}

      <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} max-w-[75%]`}>
        {!isCurrentUser && (
          <span className="text-white/60 text-xs mb-1 px-2">{userData.name}</span>
        )}

        <div
          className={`px-4 py-3 rounded-2xl text-sm sm:text-base break-words shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
            isCurrentUser
              ? `bg-gradient-to-r ${userData.color} text-white rounded-br-md`
              : "bg-white/20 text-white border border-white/20 rounded-bl-md"
          }`}
        >
          <p className="leading-relaxed">{msg.text}</p>
          {msg.timestamp && (
            <p className={`text-xs mt-1 ${
              isCurrentUser ? "text-white/70" : "text-white/50"
            }`}>
              {msg.timestamp}
            </p>
          )}
        </div>
      </div>

      {isCurrentUser && (
        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${userData.color} flex items-center justify-center text-sm font-bold text-white shadow-lg flex-shrink-0`}>
          {userData?.name?.trim()?.charAt(0)?.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default MessageBox;
