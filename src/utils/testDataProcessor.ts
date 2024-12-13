import { Test } from "@/types/test.types";
import data from "@/data/data.json";

export const processTestData = (): Test[] => {
  const typedData = data as any;
  
  if (!typedData?.categories || !Array.isArray(typedData.categories)) {
    console.warn('Invalid or missing categories in data');
    return [];
  }

  const tests: Test[] = [];
  
  try {
    typedData.categories.forEach(category => {
      if (category?.subjects && Array.isArray(category.subjects)) {
        category.subjects.forEach(subject => {
          if (subject?.topics && Array.isArray(subject.topics)) {
            subject.topics.forEach(topic => {
              if (topic?.tests && Array.isArray(topic.tests)) {
                topic.tests.forEach(test => {
                  if (test && test.title) {
                    tests.push({
                      title: test.title,
                      questions: test.questions || '',
                      isgiven: test.isgiven || false,
                      totalQuestions: test.totalQuestions || 0,
                      topic: topic.topic || 'Unknown Topic'
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error processing test data:', error);
    return [];
  }

  return tests;
}