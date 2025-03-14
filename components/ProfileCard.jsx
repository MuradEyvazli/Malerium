const getFriendUser = (friend) => {
    const senderId = friend.sender?._id || friend.sender;
    return senderId === currentUser?._id ? friend.receiver : friend.sender;
  };
  const [showFriendsModal, setShowFriendsModal] = useState(false); // Modal için

  const FriendsModal = () => {
    if (!showFriendsModal) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Arkaplan Blur + Siyah */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowFriendsModal(false)}
        />
        {/* Modal kutu */}
        <div className="relative z-10 bg-white w-full max-w-sm p-5 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Arkadaşların</h2>
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setShowFriendsModal(false)}
            >
              Kapat
            </button>
          </div>
          {friends.length === 0 ? (
            <p className="text-sm text-gray-500">Henüz arkadaşın yok...</p>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-3">
              {friends.map((friend) => {
                const friendUser = getFriendUser(friend);
                return (
                  <Link
                    key={friend._id}
                    href={`/profile/${friendUser._id}`}
                    className="flex items-center gap-3 bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition"
                    onClick={() => setShowFriendsModal(false)}
                  >
                    <div className="relative w-10 h-10">
                      <Image
                        src={
                          friendUser.avatar ||
                          "https://images.pexels.com/photos/30327309/pexels-photo-30327309.jpeg"
                        }
                        alt={friendUser.name || "Friend Avatar"}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {friendUser.name || "Arkadaş"}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };