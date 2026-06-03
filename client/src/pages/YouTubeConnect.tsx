import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { Youtube, CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function YouTubeConnect() {
  const [, setLocation] = useLocation();
  const [channelId, setChannelId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!channelId.trim()) {
      toast.error("Please enter your YouTube Channel ID");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate YouTube API connection
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("YouTube channel connected successfully!");
      setIsConnected(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error("Failed to connect YouTube channel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-3xl font-bold tracking-tighter">HYPETIMIZE</div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="py-12 md:py-24">
        <div className="max-w-2xl mx-auto px-6">
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-1 bg-red-600"></div>
              <span className="text-sm text-gray-400">Step 2 of 2</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Connect Your YouTube Channel</h1>
            <p className="text-gray-400">
              Link your YouTube channel to unlock AI-powered optimization for your videos.
            </p>
          </div>

          {/* Red Divider */}
          <div className="h-1 bg-red-600 mb-12"></div>

          {/* Success State */}
          {isConnected && (
            <Card className="bg-green-900 border border-green-700 p-8 mb-8">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-100">Channel Connected!</h3>
                  <p className="text-green-200 text-sm">Redirecting to your dashboard...</p>
                </div>
              </div>
            </Card>
          )}

          {/* Connection Card */}
          {!isConnected && (
            <Card className="bg-gray-900 border border-gray-800 p-8 mb-8">
              <div className="flex items-center justify-center mb-8">
                <Youtube className="w-16 h-16 text-red-600" />
              </div>

              <div className="space-y-6">
                {/* Channel ID Input */}
                <div>
                  <label className="block text-sm font-bold mb-2">YouTube Channel ID</label>
                  <Input
                    type="text"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    placeholder="UCxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    Find your Channel ID in YouTube Studio → Settings → Channel → Basic info
                  </p>
                </div>

                {/* Info Box */}
                <Card className="bg-gray-800 border border-gray-700 p-4">
                  <p className="text-gray-300 text-sm">
                    <strong>🔒 Privacy:</strong> We only read your public channel data. Your credentials are never stored.
                  </p>
                </Card>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={handleSkip}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
                    disabled={isLoading}
                  >
                    Skip for Now
                  </Button>
                  <Button
                    onClick={handleConnect}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connecting..." : "Connect Channel"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Benefits */}
          <Card className="bg-gray-900 border border-gray-800 p-6">
            <h3 className="font-bold mb-4">What You'll Unlock</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-red-600">✓</span> AI-powered thumbnail generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-600">✓</span> SEO metadata optimization
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-600">✓</span> Automatic highlight clip extraction
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-600">✓</span> Performance analytics integration
              </li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}
