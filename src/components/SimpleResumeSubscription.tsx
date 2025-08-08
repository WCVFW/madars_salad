
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Play } from "lucide-react";
import { useResumeSubscription } from "@/hooks/useResumeSubscription";
import ResumeSubscriptionButton from "./ResumeSubscriptionButton";

interface SimpleResumeSubscriptionProps {
  subscriptionId: string;
  onResume: () => void;
}

const SimpleResumeSubscription = ({ subscriptionId, onResume }: SimpleResumeSubscriptionProps) => {
  const [resumeDate, setResumeDate] = useState('');
  const { resumeSubscription, loading } = useResumeSubscription();

  const handleResumeWithDate = async () => {
    const success = await resumeSubscription(subscriptionId, resumeDate);
    if (success) {
      onResume();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-green-600" />
          Resume Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <ResumeSubscriptionButton 
            subscriptionId={subscriptionId}
            onResume={onResume}
          />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeDate">Resume from specific date</Label>
            <Input
              id="resumeDate"
              type="date"
              value={resumeDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setResumeDate(e.target.value)}
            />
          </div>

          <ResumeSubscriptionButton 
            subscriptionId={subscriptionId}
            onResume={() => {
              if (resumeDate) {
                handleResumeWithDate();
              }
            }}
            disabled={!resumeDate}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleResumeSubscription;
