
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useResumeSubscription } from "@/hooks/useResumeSubscription";

interface ResumeSubscriptionButtonProps {
  subscriptionId: string;
  onResume?: () => void;
  disabled?: boolean;
}

const ResumeSubscriptionButton = ({ 
  subscriptionId, 
  onResume, 
  disabled 
}: ResumeSubscriptionButtonProps) => {
  const { resumeSubscription, loading } = useResumeSubscription();

  const handleResume = async () => {
    const success = await resumeSubscription(subscriptionId);
    if (success && onResume) {
      onResume();
    }
  };

  return (
    <Button 
      onClick={handleResume}
      disabled={disabled || loading}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
    >
      <Play className="h-4 w-4" />
      {loading ? "Resuming..." : "Resume Subscription"}
    </Button>
  );
};

export default ResumeSubscriptionButton;
