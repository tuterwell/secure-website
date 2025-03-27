import { Card, CardContent } from "../components/ui/card";
import profileImg from "../image/profile.jpg";

export default function About() {
  return (
    <div className="max-w-lg mx-auto p-6 space-y-6 text-center">
      <img src={profileImg} alt="Profile" className="w-55 h-64 mx-auto rounded-full" />
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold">資管四 蔡銪宸</h2>
          <p className="text-gray-600 text-left">大家好，我是蔡銪宸。雖然我沒有很厲害，但我會盡力完成作業的！</p>
        </CardContent>
      </Card>
    </div>
  );
}