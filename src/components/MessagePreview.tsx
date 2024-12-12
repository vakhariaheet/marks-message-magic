import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestResult } from "@/pages/Index";
import { Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function MessagePreview({ 
  tests,
  onRemoveTest
}: { 
  tests: TestResult[];
  onRemoveTest: (id: string) => void;
}) {
  const { toast } = useToast();

  const generateMessage = () => {
    if (tests.length === 0) return "Please add some test results to generate a message.";
    
    const testsMessage = tests.map(test => 
      `in ${test.name} I got ${test.obtainedMarks}/${test.totalMarks}`
    ).join(", ");

    return `Hi Sir,\n\nJust wanted to update you about my test results - ${testsMessage}.\n\nThanks!\n\nRegards`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMessage());
    toast({
      title: "Copied to clipboard",
      description: "The message has been copied to your clipboard.",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Generated Message</h2>
          {tests.length > 0 && (
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          )}
        </div>
        
        {tests.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Added Tests:</h3>
            <div className="space-y-2">
              {tests.map((test) => (
                <div key={test.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm">
                    {test.name}: {test.obtainedMarks}/{test.totalMarks}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveTest(test.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap text-sm">{generateMessage()}</pre>
        </div>
      </div>
    </Card>
  );
}