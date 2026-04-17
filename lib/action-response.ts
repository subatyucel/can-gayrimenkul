import { ActionResponse } from '@/types';
import { success, type ZodError } from 'zod';

export const ActionResponseFactory = {
  success: <T>(message: string, data?: T): ActionResponse<T> => ({
    success: true as const,
    message,
    data,
  }),

  error: (
    error: string,
    fieldErrors?: Record<string, string[]>,
  ): ActionResponse<never> => ({
    success: false as const,
    error,
    fieldErrors,
  }),
};

export function formatZodErrors(error: ZodError) {
  const fieldErrors: Record<string, string[]> = {};
  error.issues.forEach((issue) => {
    const fieldName = String(issue.path[0]);
    if (!fieldErrors[fieldName]) {
      fieldErrors[fieldName] = [];
    }
    fieldErrors[fieldName].push(issue.message);
  });

  return fieldErrors;
}
