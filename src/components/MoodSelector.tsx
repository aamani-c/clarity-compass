import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, Zap, Moon } from "lucide-react";

export type Mood = "energized" | "calm" | "focused" | "overwhelmed" | "neutral";

interface MoodSelectorProps {
  selectedMood: Mood;
  onMoodChange: (mood: Mood) => void;
}

const moods: { value: Mood; icon: any; label: string; color: string }[] = [
  { value: "energized", icon: Zap, label: "Energized", color: "text-accent" },
  { value: "focused", icon: Smile, label: "Focused", color: "text-primary" },
  { value: "neutral", icon: Meh, label: "Neutral", color: "text-muted-foreground" },
  { value: "calm", icon: Moon, label: "Calm", color: "text-primary/70" },
  { value: "overwhelmed", icon: Frown, label: "Overwhelmed", color: "text-destructive" },
];

export const MoodSelector = ({ selectedMood, onMoodChange }: MoodSelectorProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
      <h3 className="text-sm font-semibold text-foreground mb-4">How are you feeling?</h3>
      <div className="flex flex-wrap gap-2">
        {moods.map(({ value, icon: Icon, label, color }) => (
          <Button
            key={value}
            variant={selectedMood === value ? "default" : "outline"}
            size="sm"
            onClick={() => onMoodChange(value)}
            className={`transition-all duration-300 ${
              selectedMood === value
                ? "bg-gradient-hero text-white shadow-soft"
                : "hover:shadow-soft hover:scale-105"
            }`}
          >
            <Icon className={`w-4 h-4 mr-2 ${selectedMood !== value ? color : ""}`} />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};
