import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Zap, Image, Sparkles, Play } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-3xl font-bold tracking-tighter">HYPETIMIZE</div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">Dashboard</Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-red-600 hover:bg-red-700 text-white">Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="brutalist-section py-24 md:py-40">
        <div className="brutalist-center">
          <h1 className="mb-6">AI-Powered YouTube Optimization</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Generate stunning thumbnails, optimize SEO metadata, and extract highlight clips—all powered by AI. Built for creators who demand excellence.
          </p>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
                Get Started Free
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Red Divider */}
      <div className="divider-red"></div>

      {/* Features Section */}
      <section className="brutalist-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center mb-16">Core Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Thumbnail Generation */}
            <Card className="bg-black border border-gray-800 p-8">
              <div className="mb-6">
                <Image className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Thumbnail Generation</h3>
              <p className="text-gray-400">
                Generate multiple AI-powered thumbnail variants. Choose the best performer for your audience.
              </p>
            </Card>

            {/* SEO Optimization */}
            <Card className="bg-black border border-gray-800 p-8">
              <div className="mb-6">
                <Sparkles className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">SEO Optimization</h3>
              <p className="text-gray-400">
                AI-generated titles, descriptions, tags, and chapters optimized for search and discovery.
              </p>
            </Card>

            {/* Highlight Clips */}
            <Card className="bg-black border border-gray-800 p-8">
              <div className="mb-6">
                <Play className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Highlight Clips</h3>
              <p className="text-gray-400">
                Automatically extract the most engaging moments from your videos for social media.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Red Divider */}
      <div className="divider-red"></div>

      {/* Pricing Section */}
      <section className="brutalist-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center mb-16">Pricing Tiers</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card className="bg-black border border-gray-800 p-8">
              <h3 className="text-3xl font-bold mb-2">Free</h3>
              <p className="text-gray-400 mb-6">Perfect for getting started</p>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-400">/mo</span></div>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li>✓ 2 videos/month</li>
                <li>✓ Basic SEO metadata</li>
                <li>✓ Standard thumbnails</li>
              </ul>
              <a href={getLoginUrl()}>
                <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">Get Started</Button>
              </a>
            </Card>

            {/* Pro Tier */}
            <Card className="bg-black border-2 border-red-600 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 px-4 py-1 text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-3xl font-bold mb-2">Pro</h3>
              <p className="text-gray-400 mb-6">For serious creators</p>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-400">/mo</span></div>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li>✓ 20 videos/month</li>
                <li>✓ Advanced SEO optimization</li>
                <li>✓ Premium thumbnails</li>
                <li>✓ Highlight clips</li>
              </ul>
              <a href={getLoginUrl()}>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Start Pro</Button>
              </a>
            </Card>

            {/* Studio Tier */}
            <Card className="bg-black border border-gray-800 p-8">
              <h3 className="text-3xl font-bold mb-2">Studio</h3>
              <p className="text-gray-400 mb-6">For power users</p>
              <div className="text-4xl font-bold mb-6">$99<span className="text-lg text-gray-400">/mo</span></div>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li>✓ Unlimited videos</li>
                <li>✓ Full AI suite</li>
                <li>✓ Priority processing</li>
                <li>✓ Team collaboration</li>
              </ul>
              <a href={getLoginUrl()}>
                <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">Start Studio</Button>
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Red Divider */}
      <div className="divider-red"></div>

      {/* CTA Section */}
      <section className="brutalist-section py-24">
        <div className="brutalist-center">
          <h2 className="mb-8">Ready to Transform Your Videos?</h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of creators using HYPETIMIZE to optimize their content and grow their channels.
          </p>
          <a href={getLoginUrl()}>
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
              Start Free Today
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-gray-500">© 2026 HYPETIMIZE. All rights reserved.</p>
          <div className="flex gap-6 text-gray-500">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
