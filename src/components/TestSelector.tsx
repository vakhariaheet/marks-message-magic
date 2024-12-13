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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Test } from "@/types/test.types";

interface TestSelectorProps {
  tests: Test[];
  selectedTests: string[];
  onSelectTest: (value: string[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClearAll: () => void;
}

export function TestSelector({
  tests = [],
  selectedTests = [],
  onSelectTest,
  open,
  onOpenChange,
  onClearAll
}: TestSelectorProps) {
  const safeTests = Array.isArray(tests) ? tests : [];

  const handleSelect = (value: string) => {
    if (selectedTests.includes(value)) {
      onSelectTest(selectedTests.filter(test => test !== value));
    } else {
      onSelectTest([...selectedTests, value]);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <FormLabel>Test Names</FormLabel>
        {selectedTests.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="h-8 px-2 lg:px-3"
          >
            Clear All
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selectedTests.length === 0 
              ? "Select tests..." 
              : `${selectedTests.length} test${selectedTests.length === 1 ? '' : 's'} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search tests..." />
            <CommandEmpty>No test found.</CommandEmpty>
            <CommandList>
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {safeTests.map((test) => (
                  <CommandItem
                    key={test.title}
                    value={test.title}
                    onSelect={() => handleSelect(test.title)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTests.includes(test.title) ? "opacity-100" : "opacity-0"
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