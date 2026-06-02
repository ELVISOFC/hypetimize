import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function SubscriptionPage() {
  const { isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: workspaces } = trpc.workspace.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: plans } = trpc.subscription.listPlans.useQuery();
  const { data: currentSubscription } = trpc.subscription.getCurrent.useQuery(
    { workspaceId: workspaces?.[0]?.id || "" },
    { enabled: !!workspaces?.[0]?.id }
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
          <Link href="/subscription">
            <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
              Subscription
            </Button>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <Link href="/dashboard">
            <Button className="bg-gray-800 hover:bg-gray-700 mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-5xl font-bold mb-4">Subscription Plans</h1>
          <p className="text-gray-400 mb-12">Choose the plan that fits your needs</p>

          <div className="divider-red mb-12"></div>

          {/* Current Plan */}
          <div className="mb-12">
            <p className="text-gray-400 mb-2">Current Plan</p>
            <h2 className="text-3xl font-bold">{currentSubscription?.tier || "Free"}</h2>
          </div>

          <div className="divider-red mb-12"></div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans?.map((plan) => {
              const isCurrent = currentSubscription?.tier === plan.tier;
              const isSelected = selectedPlan === plan.tier;

              return (
                <Card
                  key={plan.id}
                  className={`border p-8 ${
                    isCurrent
                      ? "border-red-600 bg-gray-900"
                      : isSelected
                      ? "border-red-600 bg-gray-900"
                      : "border-gray-800 bg-black"
                  }`}
                >
                  {isCurrent && (
                    <div className="bg-red-600 text-white px-3 py-1 text-sm font-bold mb-4 w-fit">
                      CURRENT PLAN
                    </div>
                  )}

                  <h3 className="text-3xl font-bold mb-2">{plan.tier}</h3>
                  <div className="text-4xl font-bold mb-6">
                    ${plan.price}
                    <span className="text-lg text-gray-400">/mo</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features?.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => setSelectedPlan(plan.tier)}
                    className={`w-full ${
                      isCurrent
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {isCurrent ? "Current Plan" : "Upgrade"}
                  </Button>
                </Card>
              );
            })}
          </div>

          <div className="divider-red mb-12"></div>

          {/* Usage */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Usage This Month</h2>
            <div className="grid md:grid-cols-3 gap-8">
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
          </div>
        </div>
      </div>
    </div>
  );
}
