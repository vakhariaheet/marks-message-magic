import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface TestSelectorProps {
  tests: any[];
  selectedTest: string;
  onSelectTest: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestSelector({
  tests = [],
  selectedTest = "",
  onSelectTest,
  open,
  onOpenChange
}: TestSelectorProps) {
  // Ensure tests is always an array
  const safeTests = Array.isArray(tests) ? tests : [];

  return (
    <div className="flex flex-col">
      <FormLabel>Test Name</FormLabel>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selectedTest || "Select test..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search test..." />
            <CommandEmpty>No test found.</CommandEmpty>
            <CommandList>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {safeTests.map((test) => (
                <CommandItem
                  key={test.title}
                  value={test.title}
                  onSelect={(currentValue) => {
                    onSelectTest(currentValue === selectedTest ? "" : currentValue);
                    onOpenChange(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTest === test.title ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {test.title}
                </CommandItem>
              ))}
            </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}