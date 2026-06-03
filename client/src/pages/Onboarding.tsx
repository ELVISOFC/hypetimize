import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingPage() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [workspaceName, setWorkspaceName] = useState(user?.name ? `${user.name}'s Workspace` : "My Workspace");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"name" | "youtube">("name");

  const createWorkspace = trpc.workspace.create.useMutation({
    onSuccess: (workspace) => {
      toast.success("Workspace created!");
      setLocation("/profile-setup");
    },
    onError: (error) => {
      toast.error("Failed to create workspace");
      console.error(error);
      setIsLoading(false);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Redirecting...</h1>
        </div>
      </div>
    );
  }

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspaceName.trim()) {
      toast.error("Please enter a workspace name");
      return;
    }

    setIsLoading(true);
    const slug = workspaceName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    createWorkspace.mutate({
      name: workspaceName.trim(),
      slug: slug || "workspace",
    });
  };

  const handleSkip = () => {
    if (step === "name") {
      setStep("youtube");
    } else {
      handleCreateWorkspace(new Event("submit") as any);
    }
  };

  const handleYouTubeSkip = () => {
    setLocation("/profile-setup");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-red-600 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter">HYPETIMIZE</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto py-16 px-6">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex gap-2 mb-4">
            <div className={`h-1 flex-1 ${step === "name" ? "bg-red-600" : "bg-gray-700"}`} />
            <div className={`h-1 flex-1 ${step === "youtube" ? "bg-red-600" : "bg-gray-700"}`} />
          </div>
          <p className="text-sm text-gray-400">
            Step {step === "name" ? "1" : "2"} of 2
          </p>
        </div>

        {/* Step 1: Workspace Name */}
        {step === "name" && (
          <div>
            <h2 className="text-5xl font-bold mb-4 tracking-tight">Welcome, {user?.name}!</h2>
            <p className="text-xl text-gray-400 mb-12">
              Let's set up your workspace. This is where you'll manage your videos and AI optimizations.
            </p>

            <form onSubmit={handleCreateWorkspace} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Workspace Name</label>
                <Input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="My Workspace"
                  className="bg-gray-900 border-gray-700 text-white text-lg py-6"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  You can change this later in settings
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: YouTube Channel (Optional) */}
        {step === "youtube" && (
          <div>
            <h2 className="text-5xl font-bold mb-4 tracking-tight">Connect YouTube</h2>
            <p className="text-xl text-gray-400 mb-12">
              (Optional) Connect your YouTube channel to auto-fill video metadata.
            </p>

            <div className="space-y-6">
              <div className="border border-gray-700 rounded p-6 text-center">
                <p className="text-gray-400 mb-4">YouTube integration coming soon</p>
                <p className="text-sm text-gray-500">
                  You can connect your channel anytime in workspace settings.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("name")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleYouTubeSkip}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading}
                >
                  Continue to Profile
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Red Divider */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-red-600" />
    </div>
  );
}
