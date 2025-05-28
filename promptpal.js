"use client";
import React from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: user } = useUser();
  const messagesEndRef = useRef(null);
  const [streamingMessage, setStreamingMessage] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleFinish = useCallback((message) => {
    setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    setStreamingMessage("");
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      content: inputMessage,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: inputMessage }],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      handleStreamResponse(response);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">PromptPal</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-8">
              <h3 className="mb-2 text-sm font-semibold text-gray-500">
                RECENT CHATS
              </h3>
              <div className="space-y-2">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="cursor-pointer rounded-lg p-2 hover:bg-gray-100"
                  >
                    <p className="text-sm text-gray-600">Chat {i + 1}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-500">
                DISCOVER
              </h3>
              <div className="space-y-2">
                <div className="cursor-pointer rounded-lg p-2 hover:bg-gray-100">
                  <p className="text-sm text-gray-600">🎯 Popular Topics</p>
                </div>
                <div className="cursor-pointer rounded-lg p-2 hover:bg-gray-100">
                  <p className="text-sm text-gray-600">💡 Tips & Tricks</p>
                </div>
                <div className="cursor-pointer rounded-lg p-2 hover:bg-gray-100">
                  <p className="text-sm text-gray-600">📚 Learning Resources</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-700">
                  {user?.email || "Guest"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-[#357AFF] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            {streamingMessage && (
              <div className="mb-4 flex justify-start">
                <div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
                  <p>{streamingMessage}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t bg-white p-4">
          <div className="mx-auto max-w-3xl">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center space-x-4"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#357AFF] px-6 py-2 text-white hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;