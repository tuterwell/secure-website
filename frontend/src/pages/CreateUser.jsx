import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function MessageBoard() {
  const [input, setInput] = useState("");

  return (
    <div className="max-w-lg mx-auto p-6 text-center">
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-lg font-bold">Create User</h2>
          <div className="flex space-x-2 mt-4">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="User name" />
            <Button >Create</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}