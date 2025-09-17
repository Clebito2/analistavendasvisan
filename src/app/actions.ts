
'use server';

import { crossAnalyzeData, CrossAnalyzeDataOutput } from '@/ai/flows/cross-analyze-data';

export type State = {
  message?: string | null;
  analysis?: CrossAnalyzeDataOutput | null;
  isError?: boolean;
};

export async function generateAnalysis(prevState: State | undefined, formData: FormData): Promise<State> {
  const financialFile = formData.get('financialData') as File;
  const productFile = formData.get('productData') as File;

  if (!financialFile || financialFile.size === 0) {
    return { message: 'Financial data file is required.', isError: true };
  }
  if (financialFile.type !== 'text/csv') {
    return { message: 'Financial data file must be a CSV.', isError: true };
  }

  if (!productFile || productFile.size === 0) {
    return { message: 'Product data file is required.', isError: true };
  }
  if (productFile.type !== 'text/csv') {
    return { message: 'Product data file must be a CSV.', isError: true };
  }

  try {
    const financialData = await financialFile.text();
    const productData = await productFile.text();

    const result = await crossAnalyzeData({ financialData, productData });

    return { message: 'Analysis complete.', analysis: result, isError: false };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { message: `Analysis failed: ${errorMessage}`, isError: true };
  }
}
