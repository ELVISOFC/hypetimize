import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, Download, Loader2, RefreshCw, Copy, Share2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { ThumbnailFeedback } from "@/components/ThumbnailFeedback";

export default function VideoDetail() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/video/:id");
  const videoId = params?.id;
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: video, isLoading } = trpc.video.get.useQuery(
    { id: videoId || "" },
    { enabled: !!videoId && isAuthenticated }
  );

  const { data: jobs } = trpc.job.list.useQuery(
    { videoId: videoId || "" },
    { enabled: !!videoId && isAuthenticated }
  );

  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);

  const generateThumbnails = trpc.thumbnail.generate.useMutation({
    onMutate: () => setIsGenerating(true),
    onSuccess: (data) => {
      setThumbnails(data);
      setIsGenerating(false);
      toast.success("Thumbnails generated successfully!");
    },
    onError: () => {
      setIsGenerating(false);
      toast.error("Failed to generate thumbnails");
    },
  });

  const handleSelectThumbnail = (thumbnailId: string) => {
    setSelectedThumbnail(thumbnailId);
    toast.success("Thumbnail selected!");
  };

  const seoData = {
    titles: [
      { title: "How to Master YouTube SEO in 2026", style: "Curiosity Gap", ctr: "High" },
      { title: "YouTube SEO Tips That Actually Work", style: "How-To", ctr: "Medium" },
      { title: "The Ultimate YouTube Optimization Guide", style: "Authority", ctr: "High" },
    ],
    description: "Learn the latest YouTube SEO strategies to boost your channel visibility and reach. This comprehensive guide covers keyword research, metadata optimization, thumbnail design, and more.",
    broadTags: ["YouTube", "SEO", "Marketing"],
    mediumTags: ["YouTube Optimization", "Channel Growth", "Video SEO"],
    longTailTags: ["How to rank YouTube videos", "YouTube algorithm explained", "Creator monetization"],
    chapters: [
      { time: "0:00", title: "Introduction" },
      { time: "2:15", title: "Keyword Research" },
      { time: "5:30", title: "Metadata Optimization" },
      { time: "8:45", title: "Thumbnail Design" },
    ],
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleExportSEO = () => {
    const allTags = [...seoData.broadTags, ...seoData.mediumTags, ...seoData.longTailTags];
    const chaptersText = seoData.chapters.map(c => `${c.time} ${c.title}`).join("\n");
    
    const exportText = `TITLE VARIANTS:\n${seoData.titles.map(t => `- ${t.title} (${t.style}, CTR: ${t.ctr})`).join("\n")}\n\nDESCRIPTION:\n${seoData.description}\n\nTAGS:\n${allTags.join(", ")}\n\nCHAPTERS:\n${chaptersText}`;
    
    handleCopyToClipboard(exportText, "SEO data");
  };

  const handleDownloadThumbnail = (downloadUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${title}.svg`;
    link.click();
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
          <p className="text-gray-400 mb-12">Video ID: {video.id}</p>

          <div className="divider-red mb-12"></div>

          {/* SEO Results */}
          {seoJob?.status === "completed" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">SEO Metadata</h2>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Title Variants</h3>
                  <Button onClick={() => handleCopyToClipboard(seoData.titles.map(t => t.title).join("\n"), "Titles")} className="bg-red-600 hover:bg-red-700 text-sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </Button>
                </div>
                <div className="space-y-4">
                  {seoData.titles.map((variant, i) => (
                    <Card key={i} className="bg-gray-900 border border-gray-800 p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold">{variant.title}</p>
                          <p className="text-gray-400 text-sm">
                            Style: {variant.style} | CTR: {variant.ctr}
                          </p>
                        </div>
                        <Button onClick={() => handleCopyToClipboard(variant.title, "Title")} className="bg-gray-800 hover:bg-gray-700 ml-2" size="sm">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Optimized Description</h3>
                  <Button onClick={() => handleCopyToClipboard(seoData.description, "Description")} className="bg-red-600 hover:bg-red-700 text-sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <Card className="bg-gray-900 border border-gray-800 p-4">
                  <p className="text-gray-300">
                    {seoData.description}
                  </p>
                </Card>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Tags</h3>
                  <Button onClick={() => handleCopyToClipboard([...seoData.broadTags, ...seoData.mediumTags, ...seoData.longTailTags].join(", "), "Tags")} className="bg-red-600 hover:bg-red-700 text-sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </Button>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Broad Tags</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {seoData.broadTags.map((tag, i) => (
                      <span key={i} className="bg-gray-800 px-3 py-1 text-sm cursor-pointer hover:bg-gray-700" onClick={() => handleCopyToClipboard(tag, "Tag")}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-400 text-sm mb-2">Medium Tags</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {seoData.mediumTags.map((tag, i) => (
                      <span key={i} className="bg-gray-800 px-3 py-1 text-sm cursor-pointer hover:bg-gray-700" onClick={() => handleCopyToClipboard(tag, "Tag")}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-400 text-sm mb-2">Long-Tail Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {seoData.longTailTags.map((tag, i) => (
                      <span key={i} className="bg-gray-800 px-3 py-1 text-sm cursor-pointer hover:bg-gray-700" onClick={() => handleCopyToClipboard(tag, "Tag")}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Chapter Markers</h3>
                  <Button onClick={() => handleCopyToClipboard(seoData.chapters.map(c => `${c.time} ${c.title}`).join("\n"), "Chapters")} className="bg-red-600 hover:bg-red-700 text-sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </Button>
                </div>
                <div className="space-y-2">
                  {seoData.chapters.map((chapter, i) => (
                    <Card key={i} className="bg-gray-900 border border-gray-800 p-4">
                      <div className="flex justify-between items-center">
                        <p className="font-bold">{chapter.time} - {chapter.title}</p>
                        <Button onClick={() => handleCopyToClipboard(`${chapter.time} ${chapter.title}`, "Chapter")} className="bg-gray-800 hover:bg-gray-700" size="sm">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
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
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Thumbnail Variants</h2>
              <Button
                onClick={() => generateThumbnails.mutate({ videoTitle: video.title })}
                disabled={isGenerating || generateThumbnails.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {isGenerating || generateThumbnails.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Thumbnails
                  </>
                )}
              </Button>
            </div>

            {thumbnails.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {thumbnails.map((thumb) => (
                  <Card key={thumb.id} className="bg-gray-900 border border-gray-800 overflow-hidden">
                    <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                      {thumb.downloadUrl && (
                        <img
                          src={thumb.downloadUrl}
                          alt={thumb.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-1">{thumb.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{thumb.style}</p>
                      <Button
                        onClick={() => handleDownloadThumbnail(thumb.downloadUrl, thumb.title)}
                        className="w-full bg-gray-800 hover:bg-gray-700 mb-2"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={() => handleSelectThumbnail(thumb.id)}
                        className={`w-full ${
                          selectedThumbnail === thumb.id
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
                      >
                        {selectedThumbnail === thumb.id ? "✓ Selected" : "Select"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No thumbnails generated yet</p>
                <Button
                  onClick={() => generateThumbnails.mutate({ videoTitle: video.title })}
                  disabled={isGenerating || generateThumbnails.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isGenerating || generateThumbnails.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Now"
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Feedback Section */}
          {selectedThumbnail && (
            <ThumbnailFeedback
              assetId={selectedThumbnail}
              onFeedbackSubmitted={() => {
                // Optionally refresh feedback stats
              }}
            />
          )}

          <div className="divider-red mb-12"></div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button className="bg-gray-800 hover:bg-gray-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate All
            </Button>
            <Button onClick={handleExportSEO} className="bg-red-600 hover:bg-red-700">
              <Share2 className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
