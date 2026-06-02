import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function UploadPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [uploadType, setUploadType] = useState<"file" | "youtube">("file");
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: workspaces } = trpc.workspace.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createVideoMutation = trpc.video.create.useMutation({
    onSuccess: (video) => {
      toast.success("Video uploaded successfully!");
      setLocation(`/video/${video.id}`);
    },
    onError: (error) => {
      toast.error("Failed to upload video");
      console.error(error);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentWorkspace = workspaces?.[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkspace) return;

    if (!title.trim()) {
      toast.error("Please enter a video title");
      return;
    }

    if (uploadType === "youtube" && !youtubeUrl.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    setIsLoading(true);
    createVideoMutation.mutate({
      workspaceId: currentWorkspace.id,
      title,
      sourceType: uploadType === "file" ? "upload" : "youtube_url",
      youtubeUrl: uploadType === "youtube" ? youtubeUrl : undefined,
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 p-6">
        <div className="text-2xl font-bold mb-12">HYPETIMIZE</div>
        <nav className="space-y-4">
          <Link href="/dashboard">
            <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700">
              Dashboard
            </Button>
          </Link>
          <Link href="/upload">
            <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </Button>
          </Link>
          <Link href="/subscription">
            <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700">
              Subscription
            </Button>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-8 py-12">
          <Link href="/dashboard">
            <Button className="bg-gray-800 hover:bg-gray-700 mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-5xl font-bold mb-4">Upload Video</h1>
          <p className="text-gray-400 mb-12">Submit a video for AI processing</p>

          <div className="divider-red mb-12"></div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold mb-3">Video Title</label>
              <Input
                type="text"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-900 border border-gray-800 text-white placeholder-gray-500"
              />
            </div>

            {/* Upload Type */}
            <div>
              <label className="block text-sm font-bold mb-3">Source</label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => setUploadType("file")}
                  className={uploadType === "file" ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"}
                >
                  Upload File
                </Button>
                <Button
                  type="button"
                  onClick={() => setUploadType("youtube")}
                  className={uploadType === "youtube" ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"}
                >
                  YouTube URL
                </Button>
              </div>
            </div>

            {/* File Upload */}
            {uploadType === "file" && (
              <Card className="bg-gray-900 border-2 border-dashed border-gray-700 p-12 text-center">
                <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Drag and drop your video here or click to browse</p>
                <p className="text-gray-500 text-sm mt-2">Supported: MP4, WebM (max 2GB)</p>
              </Card>
            )}

            {/* YouTube URL */}
            {uploadType === "youtube" && (
              <div>
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="bg-gray-900 border border-gray-800 text-white placeholder-gray-500"
                />
              </div>
            )}

            <div className="divider-red"></div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading || createVideoMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
            >
              {isLoading || createVideoMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Process
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
