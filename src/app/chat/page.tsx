import ChatClient from "./ChatClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <ChatClient />
    </Suspense>
  );
}
