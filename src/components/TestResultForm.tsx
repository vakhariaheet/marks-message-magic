import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { TestSelector } from "./TestSelector";
import { processTestData } from "@/utils/testDataProcessor";
import { Test, TestResult } from "@/types/test.types";

const formSchema = z.object({
  testMarks: z.array(z.object({
    testName: z.string(),
    obtainedMarks: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Must be a valid number"),
  }))
});

type FormSchema = z.infer<typeof formSchema>;

export function TestResultForm({ onSubmit }: { onSubmit: (test: Omit<TestResult, "id">) => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [tests, setTests] = useState<Test[]>([]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testMarks: [],
    },
  });

  useEffect(() => {
    const loadedTests = processTestData();
    setTests(loadedTests || []);
  }, []);

  useEffect(() => {
    const testMarks = selectedTests.map(testName => ({
      testName,
      obtainedMarks: "",
    }));
    form.setValue("testMarks", testMarks);
  }, [selectedTests, form]);

  const handleSubmit = (values: FormSchema) => {
    if (selectedTests.length === 0) {
      toast({
        title: "No tests selected",
        description: "Please select at least one test.",
        variant: "destructive",
      });
      return;
    }

    values.testMarks.forEach(({ testName, obtainedMarks }) => {
      const test = tests.find(t => t.title === testName);
      if (test) {
        onSubmit({
          name: testName,
          obtainedMarks: Number(obtainedMarks),
          totalMarks: test.totalQuestions,
        });
      }
    });

    form.reset();
    setSelectedTests([]);
    toast({
      title: "Tests added successfully",
      description: `${selectedTests.length} test${selectedTests.length === 1 ? '' : 's'} added to the list.`,
    });
  };

  const handleClearAll = () => {
    setSelectedTests([]);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <TestSelector
          tests={tests}
          selectedTests={selectedTests}
          onSelectTest={setSelectedTests}
          open={open}
          onOpenChange={setOpen}
          onClearAll={handleClearAll}
        />
        
        {selectedTests.length > 0 && (
          <div className="space-y-4">
            {selectedTests.map((testName, index) => {
              const test = tests.find(t => t.title === testName);
              return (
                <div key={testName} className="p-4 border rounded-lg space-y-4">
                  <h3 className="font-medium">{testName}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`testMarks.${index}.obtainedMarks`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Obtained Marks</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter obtained marks" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>Total Marks</FormLabel>
                      <Input 
                        type="number" 
                        value={test?.totalQuestions || ''} 
                        disabled 
                        className="bg-gray-100"
                      />
                    </FormItem>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <Button type="submit" className="w-full">Add Test Results</Button>
      </form>
    </Form>
  );
}