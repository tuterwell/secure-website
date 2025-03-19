import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 text-center">
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-lg font-bold">Message Board</h2>
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className="p-2 bg-gray-200 rounded">{msg}</div>
            ))}
          </div>
          <div className="flex space-x-2 mt-4">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Leave a message" />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}