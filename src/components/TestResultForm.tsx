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
  name: z.string().min(1, "Test name is required"),
  obtainedMarks: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Must be a valid number"),
  totalMarks: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a valid number greater than 0"),
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
      name: "",
      obtainedMarks: "",
      totalMarks: "",
    },
  });

  useEffect(() => {
    const loadedTests = processTestData();
    setTests(loadedTests || []);
  }, []);

  useEffect(() => {
    if (selectedTests.length === 1) {
      const selectedTestData = tests.find(test => test.title === selectedTests[0]);
      form.setValue("name", selectedTests[0]);
      if (selectedTestData?.totalQuestions) {
        form.setValue("totalMarks", selectedTestData.totalQuestions.toString());
      }
    } else if (selectedTests.length > 1) {
      form.setValue("name", `${selectedTests.length} tests selected`);
      const totalQuestions = selectedTests.reduce((total, testName) => {
        const test = tests.find(t => t.title === testName);
        return total + (test?.totalQuestions || 0);
      }, 0);
      form.setValue("totalMarks", totalQuestions.toString());
    }
  }, [selectedTests, tests, form]);

  const handleSubmit = (values: FormSchema) => {
    if (selectedTests.length === 0) {
      toast({
        title: "No tests selected",
        description: "Please select at least one test.",
        variant: "destructive",
      });
      return;
    }

    selectedTests.forEach(testName => {
      const test = tests.find(t => t.title === testName);
      onSubmit({
        name: testName,
        obtainedMarks: Number(values.obtainedMarks),
        totalMarks: test?.totalQuestions || Number(values.totalMarks),
      });
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="obtainedMarks"
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
          <FormField
            control={form.control}
            name="totalMarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Marks</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter total marks" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">Add Test Results</Button>
      </form>
    </Form>
  );
}