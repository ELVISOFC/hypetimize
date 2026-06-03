import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export default function ProfileSetup() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    channelName: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.channelName.trim()) {
      toast.error("Channel name is required");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate profile update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Profile updated successfully!");
      
      // Redirect to YouTube connection
      setLocation("/youtube-connect");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setLocation("/youtube-connect");
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
              <span className="text-sm text-gray-400">Step 1 of 2</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Complete Your Profile</h1>
            <p className="text-gray-400">
              Let us know more about you and your channel so we can tailor HYPETIMIZE to your needs.
            </p>
          </div>

          {/* Red Divider */}
          <div className="h-1 bg-red-600 mb-12"></div>

          {/* Form Card */}
          <Card className="bg-gray-900 border border-gray-800 p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold mb-2">Full Name</label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold mb-2">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
                  required
                />
              </div>

              {/* Channel Name */}
              <div>
                <label className="block text-sm font-bold mb-2">YouTube Channel Name</label>
                <Input
                  type="text"
                  name="channelName"
                  value={formData.channelName}
                  onChange={handleInputChange}
                  placeholder="My Awesome Channel"
                  className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
                  required
                />
                <p className="text-gray-500 text-sm mt-2">
                  This helps us personalize your dashboard and recommendations.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  onClick={handleSkip}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
                  disabled={isLoading}
                >
                  Skip for Now
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Continue"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>

          {/* Info Box */}
          <Card className="bg-gray-900 border border-gray-800 p-6">
            <p className="text-gray-400 text-sm">
              <strong>💡 Tip:</strong> You can update your profile anytime in workspace settings.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
