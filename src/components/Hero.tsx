import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Sparkles } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero blur-2xl opacity-30 rounded-full" />
            <div className="relative bg-card p-6 rounded-3xl shadow-medium">
              <Brain className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>
        
        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            From <span className="bg-gradient-hero bg-clip-text text-transparent">Confusion</span>
            <br />
            to <span className="bg-gradient-hero bg-clip-text text-transparent">Clarity</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your AI-powered companion that transforms overwhelm into actionable insight
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8">
          {[
            { icon: Sparkles, text: "Mood-Aware Suggestions" },
            { icon: Brain, text: "Smart Prioritization" },
            { icon: ArrowRight, text: "Next-Step Generator" },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-4 transition-all duration-300 hover:shadow-soft hover:scale-105"
            >
              <feature.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">{feature.text}</p>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="pt-8">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-gradient-hero hover:opacity-90 text-white text-lg px-8 py-6 rounded-full shadow-medium transition-all duration-300 hover:shadow-soft hover:scale-105"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        
        {/* Subtle tagline */}
        <p className="text-sm text-muted-foreground pt-4">
          No confusion. No overwhelm. Just clarity.
        </p>
      </div>
    </div>
  );
};
