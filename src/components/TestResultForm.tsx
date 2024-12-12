import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TestResult } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Test name is required"),
  obtainedMarks: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Must be a valid number"),
  totalMarks: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a valid number greater than 0"),
});

type FormSchema = z.infer<typeof formSchema>;

export function TestResultForm({ onSubmit }: { onSubmit: (test: Omit<TestResult, "id">) => void }) {
  const { toast } = useToast();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      obtainedMarks: "",
      totalMarks: "",
    },
  });

  const handleSubmit = (values: FormSchema) => {
    onSubmit({
      name: values.name,
      obtainedMarks: Number(values.obtainedMarks),
      totalMarks: Number(values.totalMarks),
    });
    form.reset();
    toast({
      title: "Test added successfully",
      description: "Your test result has been added to the list.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter test name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
        <Button type="submit" className="w-full">Add Test Result</Button>
      </form>
    </Form>
  );
}