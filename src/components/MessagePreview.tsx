import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestResult } from "@/pages/Index";
import { Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      `${test.name}: ${test.obtainedMarks}/${test.totalMarks}`
    ).join("\n");

    return `Test Results:\n${testsMessage}\n\nRegards`;
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
            <h3 className="text-sm font-medium mb-2">Test Results:</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Obtained Marks</TableHead>
                  <TableHead>Total Marks</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.name}</TableCell>
                    <TableCell>{test.obtainedMarks}</TableCell>
                    <TableCell>{test.totalMarks}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveTest(test.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap text-sm">{generateMessage()}</pre>
        </div>
      </div>
    </Card>
  );
}