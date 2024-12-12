import { Card } from "@/components/ui/card";
import { TestResultForm } from "@/components/TestResultForm";
import { MessagePreview } from "@/components/MessagePreview";
import { useState } from "react";

export type TestResult = {
  id: string;
  name: string;
  obtainedMarks: number;
  totalMarks: number;
};

const Index = () => {
  const [tests, setTests] = useState<TestResult[]>([]);

  const addTest = (test: Omit<TestResult, "id">) => {
    setTests([...tests, { ...test, id: crypto.randomUUID() }]);
  };

  const removeTest = (id: string) => {
    setTests(tests.filter((test) => test.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Test Result Message Generator</h1>
        <div className="grid gap-8">
          <Card className="p-6">
            <TestResultForm onSubmit={addTest} />
          </Card>
          <MessagePreview tests={tests} onRemoveTest={removeTest} />
        </div>
      </div>
    </div>
  );
};

export default Index;