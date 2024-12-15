import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Test } from "@/types/test.types";
import { UseFormReturn } from "react-hook-form";

interface TestInputProps {
  test: Test;
  index: number;
  form: UseFormReturn<any>;
}

export function TestInput({ test, index, form }: TestInputProps) {
  return (
    <div key={test.title} className="p-4 border rounded-lg space-y-4">
      <h3 className="font-medium">{test.title}</h3>
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
            value={test.totalQuestions || ''} 
            disabled 
            className="bg-gray-100"
          />
        </FormItem>
      </div>
    </div>
  );
}