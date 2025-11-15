import { useState } from "react";
import { Hero } from "@/components/Hero";
import { MoodSelector, Mood } from "@/components/MoodSelector";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [mood, setMood] = useState<Mood>("neutral");

  if (!showChat) {
    return <Hero onGetStarted={() => setShowChat(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl h-screen flex flex-col py-8 px-4">
        <div className="mb-6">
          <MoodSelector selectedMood={mood} onMoodChange={setMood} />
        </div>
        <div className="flex-1 bg-card border border-border rounded-2xl shadow-medium overflow-hidden">
          <ChatInterface mood={mood} />
        </div>
      </div>
    </div>
  );
};

export default Index;
