import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ArrowLeft, Mail, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { isAuthenticated } = useAuth();
  const [inviteEmail, setInviteEmail] = useState("");

  const { data: workspaces } = trpc.workspace.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const currentWorkspace = workspaces?.[0];

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
  };

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
            <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700">
              Upload Video
            </Button>
          </Link>
          <Link href="/settings">
            <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
              Settings
            </Button>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-8 py-12">
          <Link href="/dashboard">
            <Button className="bg-gray-800 hover:bg-gray-700 mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-5xl font-bold mb-4">Settings</h1>
          <p className="text-gray-400 mb-12">Manage your workspace and team</p>

          <div className="divider-red mb-12"></div>

          {/* Workspace Settings */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Workspace</h2>
            <Card className="bg-gray-900 border border-gray-800 p-8">
              <div className="mb-6">
                <label className="block text-sm font-bold mb-3">Workspace Name</label>
                <Input
                  type="text"
                  value={currentWorkspace?.name || ""}
                  readOnly
                  className="bg-gray-800 border border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-3">Workspace Slug</label>
                <Input
                  type="text"
                  value={currentWorkspace?.slug || ""}
                  readOnly
                  className="bg-gray-800 border border-gray-700 text-white"
                />
              </div>
            </Card>
          </div>

          <div className="divider-red mb-12"></div>

          {/* Team Management */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Team Members</h2>

            <Card className="bg-gray-900 border border-gray-800 p-8 mb-8">
              <h3 className="text-xl font-bold mb-6">Invite Team Member</h3>
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="team@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
                />
                <Button onClick={handleInvite} className="bg-red-600 hover:bg-red-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </div>
            </Card>

            <Card className="bg-gray-900 border border-gray-800 p-8">
              <h3 className="text-xl font-bold mb-6">Current Members</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-800 rounded">
                  <div>
                    <p className="font-bold">You</p>
                    <p className="text-gray-400 text-sm">Owner</p>
                  </div>
                  <span className="text-gray-400">Admin</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="divider-red mb-12"></div>

          {/* YouTube Connection */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">YouTube Connection</h2>
            <Card className="bg-gray-900 border border-gray-800 p-8">
              <p className="text-gray-400 mb-6">Connect your YouTube channel to enable direct publishing and analytics.</p>
              <Button className="bg-red-600 hover:bg-red-700">
                Connect YouTube Channel
              </Button>
            </Card>
          </div>

          <div className="divider-red mb-12"></div>

          {/* Danger Zone */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-red-600">Danger Zone</h2>
            <Card className="bg-gray-900 border border-red-600 p-8">
              <h3 className="text-xl font-bold mb-4">Delete Workspace</h3>
              <p className="text-gray-400 mb-6">This action cannot be undone. All videos and data will be permanently deleted.</p>
              <Button className="bg-red-600 hover:bg-red-700">Delete Workspace</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
