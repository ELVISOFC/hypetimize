import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, Download, Loader2, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function VideoDetail() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/video/:id");
  const videoId = params?.id;

  const { data: video, isLoading } = trpc.video.get.useQuery(
    { id: videoId || "" },
    { enabled: !!videoId && isAuthenticated }
  );

  const { data: jobs } = trpc.job.list.useQuery(
    { videoId: videoId || "" },
    { enabled: !!videoId && isAuthenticated }
  );

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Video Not Found</h1>
          <Link href="/dashboard">
            <Button className="bg-red-600 hover:bg-red-700">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const seoJob = jobs?.find((j) => j.type === "seo_metadata");
  const thumbnailJob = jobs?.find((j) => j.type === "thumbnail_generation");

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
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <Link href="/dashboard">
            <Button className="bg-gray-800 hover:bg-gray-700 mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-5xl font-bold mb-2">{video.title}</h1>
          <p className="text-gray-400 mb-8">
            Status: <span className="capitalize font-bold text-red-600">{video.processingStatus}</span>
          </p>

          <div className="divider-red mb-12"></div>

          {/* Job Progress */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Processing Status</h2>
            <div className="space-y-4">
              {jobs?.map((job) => (
                <Card key={job.id} className="bg-gray-900 border border-gray-800 p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold capitalize">{job.type.replace(/_/g, " ")}</h3>
                      <p className="text-gray-400 text-sm capitalize">{job.status}</p>
                    </div>
                    <div className="text-right">
                      <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-600 transition-all"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{job.progress}%</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="divider-red mb-12"></div>

          {/* SEO Results */}
          {seoJob?.status === "completed" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">SEO Optimization</h2>

              {/* Titles */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Title Variants</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-gray-900 border border-gray-800 p-4">
                      <p className="font-bold">Variant {i}: AI-Generated Title Option {i}</p>
                      <p className="text-gray-400 text-sm mt-1">Style: Curiosity Gap | CTR: High</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Optimized Description</h3>
                <Card className="bg-gray-900 border border-gray-800 p-6">
                  <p className="text-gray-300">
                    This is your AI-generated video description optimized for SEO. It includes relevant keywords and a compelling hook to improve click-through rates and search visibility.
                  </p>
                </Card>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Tags</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Broad Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {["tag1", "tag2", "tag3"].map((tag) => (
                        <span key={tag} className="bg-red-600 text-white px-3 py-1 text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Medium Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {["tag4", "tag5", "tag6"].map((tag) => (
                        <span key={tag} className="bg-gray-800 text-white px-3 py-1 text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Long-tail Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {["tag7", "tag8", "tag9"].map((tag) => (
                        <span key={tag} className="bg-gray-700 text-white px-3 py-1 text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapters */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Chapters</h3>
                <div className="space-y-2">
                  {[
                    { time: "0:00", title: "Introduction" },
                    { time: "1:30", title: "Main Topic" },
                    { time: "5:00", title: "Deep Dive" },
                    { time: "8:45", title: "Conclusion" },
                  ].map((chapter, i) => (
                    <Card key={i} className="bg-gray-900 border border-gray-800 p-4">
                      <p className="font-bold">{chapter.time} - {chapter.title}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {seoJob?.status !== "completed" && (
            <div className="mb-12 text-center">
              <p className="text-gray-400">SEO results will appear here once processing is complete.</p>
            </div>
          )}

          <div className="divider-red mb-12"></div>

          {/* Thumbnail Results */}
          {thumbnailJob?.status === "completed" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Thumbnail Variants</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-gray-900 border border-gray-800 overflow-hidden">
                    <div className="w-full h-48 bg-gradient-to-br from-red-600 to-gray-900 flex items-center justify-center">
                      <p className="text-gray-400">Thumbnail {i}</p>
                    </div>
                    <div className="p-4">
                      <Button className="w-full bg-gray-800 hover:bg-gray-700 mb-2">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button className="w-full bg-red-600 hover:bg-red-700">Select</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {thumbnailJob?.status !== "completed" && (
            <div className="mb-12 text-center">
              <p className="text-gray-400">Thumbnail results will appear here once processing is complete.</p>
            </div>
          )}

          <div className="divider-red mb-12"></div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button className="bg-gray-800 hover:bg-gray-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">Copy Results</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
