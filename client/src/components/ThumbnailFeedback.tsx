import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ThumbnailFeedbackProps {
  assetId: string;
  onFeedbackSubmitted?: () => void;
}

export function ThumbnailFeedback({ assetId, onFeedbackSubmitted }: ThumbnailFeedbackProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { data: stats } = trpc.feedback.getAverageRating.useQuery(
    { assetId },
    { enabled: !!assetId }
  );

  const submitFeedback = trpc.feedback.create.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your feedback!");
      setRating(0);
      setComment("");
      setHelpful(null);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      onFeedbackSubmitted?.();
    },
    onError: () => {
      toast.error("Failed to submit feedback");
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    submitFeedback.mutate({
      assetId,
      rating,
      comment: comment || undefined,
      helpful: helpful !== null ? helpful : undefined,
    });
  };

  return (
    <Card className="bg-gray-900 border border-gray-800 p-6 mt-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Rate This Thumbnail</h3>
        <p className="text-gray-400 text-sm mb-4">Help us improve by rating this generated thumbnail</p>

        {/* Star Rating */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-600"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Average Rating Display */}
        {stats && stats.totalFeedback > 0 && (
          <p className="text-sm text-gray-400 mb-4">
            Average rating: <span className="font-bold text-yellow-400">{stats.averageRating}</span> ({stats.totalFeedback} ratings)
          </p>
        )}
      </div>

      {/* Comment Section */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Comments (Optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What could we improve? Any specific feedback?"
          className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-red-600 min-h-24"
        />
      </div>

      {/* Helpful Toggle */}
      <div className="mb-6 flex gap-2">
        <Button
          onClick={() => setHelpful(helpful === true ? null : true)}
          className={`flex-1 ${
            helpful === true
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          Helpful
        </Button>
        <Button
          onClick={() => setHelpful(helpful === false ? null : false)}
          className={`flex-1 ${
            helpful === false
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Not Helpful
        </Button>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={submitFeedback.isPending || submitted}
        className="w-full bg-red-600 hover:bg-red-700"
      >
        {submitted ? "✓ Feedback Submitted" : "Submit Feedback"}
      </Button>
    </Card>
  );
}
