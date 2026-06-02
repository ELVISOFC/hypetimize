import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Loader2, LogOut, Plus, Settings, Video } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  const { data: workspaces, isLoading: workspacesLoading } = trpc.workspace.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !workspaceId) {
      setWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, workspaceId]);

  const { data: subscription } = trpc.subscription.getCurrent.useQuery(
    { workspaceId: workspaceId || "" },
    { enabled: !!workspaceId }
  );

  const { data: videos } = trpc.video.list.useQuery(
    { workspaceId: workspaceId || "", limit: 5 },
    { enabled: !!workspaceId }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">Please sign in to access the dashboard.</p>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (workspacesLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  const currentWorkspace = workspaces?.[0];

  if (!currentWorkspace) {
    // Redirect to onboarding if no workspace exists
    setLocation("/onboarding");
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Setting up your workspace...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 p-6">
        <div className="text-2xl font-bold mb-8">HYPETIMIZE</div>
        
        {/* Workspace Switcher */}
        {workspaces && workspaces.length > 0 && (
          <div className="mb-8 pb-6 border-b border-gray-800">
            <p className="text-xs text-gray-500 mb-2">WORKSPACE</p>
            <select
              value={workspaceId || ""}
              onChange={(e) => setWorkspaceId(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm"
            >
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <nav className="space-y-4">
          <Link href="/dashboard">
            <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
              <Video className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/upload">
            <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700">
              <Plus className="w-4 h-4 mr-2" />
              Upload Video
            </Button>
          </Link>
          <Link href="/subscription">
            <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700">
              Subscription
            </Button>
          </Link>
          <Link href="/settings">
            <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </nav>
        <div className="mt-12 pt-6 border-t border-gray-800">
          <Button onClick={() => logout()} className="w-full justify-start bg-gray-800 hover:bg-gray-700">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-2">{currentWorkspace.name}</h1>
            <p className="text-gray-400">Welcome back, {user?.name}!</p>
          </div>

          <div className="divider-red"></div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 my-12">
            <Card className="bg-gray-900 border border-gray-800 p-8">
              <p className="text-gray-400 text-sm mb-2">Thumbnails Generated</p>
              <h3 className="text-3xl font-bold">0</h3>
            </Card>

            <Card className="bg-gray-900 border border-gray-800 p-8">
              <p className="text-gray-400 text-sm mb-2">SEO Runs</p>
              <h3 className="text-3xl font-bold">0</h3>
            </Card>

            <Card className="bg-gray-900 border border-gray-800 p-8">
              <p className="text-gray-400 text-sm mb-2">Clips Created</p>
              <h3 className="text-3xl font-bold">0</h3>
            </Card>
          </div>

          <div className="divider-red"></div>

          {/* Videos */}
          <div className="my-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold">Recent Videos</h2>
              <Link href="/upload">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </Link>
            </div>

            {videos && videos.length > 0 ? (
              <div className="space-y-4">
                {videos.map((video) => (
                  <Card key={video.id} className="bg-gray-900 border border-gray-800 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{video.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">
                          Status: <span className="capitalize">{video.processingStatus}</span>
                        </p>
                      </div>
                      <Link href={`/video/${video.id}`}>
                        <Button className="bg-gray-800 hover:bg-gray-700">View</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-900 border border-gray-800 p-12 text-center">
                <p className="text-gray-400 mb-6">No videos yet. Upload your first video to get started.</p>
                <Link href="/upload">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
