import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Test } from '@/types/test.types';
import data from '@/data/data.json';
import { useEffect, useState } from 'react';

interface TestSelectorProps {
	tests: Test[];
	selectedTests: string[];
	onSelectTest: (value: string[]) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onClearAll: () => void;
}

export function TestSelector({
	selectedTests = [],
	onSelectTest,
	open,
	onOpenChange,
	onClearAll,
}: TestSelectorProps) {
	const [testData, setTestData] = useState<{
		name: string;
		tests: Test[];
	}[]>([]);

	useEffect(() => {
		const subjects: {
			name: string;
			tests: Test[];
		}[] = [];

		data.categories.forEach((category) => {
			category.subjects.forEach((subject) => {
				const tests: Test[] = [];
				subject.topics.forEach((topic) => {
					topic.tests.forEach((test) => {
						tests.push({
							title: test.title,
							questions: test.questions,
							isgiven: test.isgiven,
							totalQuestions: test.totalQuestions,
							topic: topic.topic,
						});
					});
				});
				subjects.push({
					name: subject.name,
					tests,
				});
			});
		});
		setTestData(subjects);
	}, []);

	const handleSelect = (value: string) => {
		if (selectedTests.includes(value)) {
			onSelectTest(selectedTests.filter((test) => test !== value));
		} else {
			onSelectTest([...selectedTests, value]);
		}
	};

	return (
		<div className='flex flex-col space-y-2'>
			<div className='flex justify-between items-center'>
				<FormLabel>Test Names</FormLabel>
				{selectedTests.length > 0 && (
					<Button
						variant='ghost'
						size='sm'
						onClick={onClearAll}
						className='h-8 px-2 lg:px-3'
					>
						Clear All
						<X className='ml-2 h-4 w-4' />
					</Button>
				)}
			</div>
			<Popover open={open} onOpenChange={onOpenChange}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='justify-between'
					>
						{selectedTests.length === 0
							? 'Select tests...'
							: `${selectedTests.length} test${
									selectedTests.length === 1 ? '' : 's'
							  } selected`}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-full p-0'>
					<Command>
						<CommandInput placeholder='Search tests...' />
						<CommandEmpty>No test found.</CommandEmpty>
						<CommandList>
							{testData.map((subject) => (
								<>
									<CommandGroup key={subject.name} heading={subject.name}>
										{subject.tests.map((test) => (
											<CommandItem
												key={test.title}
												value={test.title}
												onSelect={() => handleSelect(test.title)}
											>
												<Check
													className={cn(
														'mr-2 h-4 w-4',
														selectedTests.includes(test.title)
															? 'opacity-100'
															: 'opacity-0'
													)}
												/>
												{test.title}
											</CommandItem>
										))}
									</CommandGroup>
									<CommandSeparator />
								</>
							))}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}