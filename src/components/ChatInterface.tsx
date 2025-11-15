import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Image as ImageIcon, CheckSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mood } from "./MoodSelector";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  tasks?: string[];
}

interface ChatInterfaceProps {
  mood: Mood;
}

export const ChatInterface = ({ mood }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("clarity-assistant", {
        body: {
          messages: [...messages, userMessage],
          mood,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        imageUrl: data.imageUrl,
        tasks: data.tasks,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-lg mb-2">👋 Hi! I'm your clarity assistant.</p>
            <p className="text-sm">
              Ask me to help you prioritize tasks, generate next steps, create visual plans, or
              just chat about what's on your mind.
            </p>
          </div>
        )}

        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <Card
              className={`max-w-[80%] p-4 ${
                message.role === "user"
                  ? "bg-gradient-hero text-white"
                  : "bg-card border-border shadow-soft"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>

              {message.imageUrl && (
                <div className="mt-4 rounded-lg overflow-hidden border border-border">
                  <img
                    src={message.imageUrl}
                    alt="Generated plan"
                    className="w-full h-auto"
                  />
                </div>
              )}

              {message.tasks && message.tasks.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <CheckSquare className="w-4 h-4" />
                    <span>Tasks:</span>
                  </div>
                  <ul className="space-y-2">
                    {message.tasks.map((task, taskIdx) => (
                      <li
                        key={taskIdx}
                        className="flex items-start gap-2 text-sm bg-muted/50 rounded-lg p-2"
                      >
                        <span className="text-primary font-semibold">{taskIdx + 1}.</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card border-border shadow-soft p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 bg-background border-border focus-visible:ring-primary"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-hero text-white hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
