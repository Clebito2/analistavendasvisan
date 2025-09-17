
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
    return { message: 'O arquivo de dados financeiros é obrigatório.', isError: true };
  }
  if (financialFile.type !== 'text/csv') {
    return { message: 'O arquivo de dados financeiros deve ser um CSV.', isError: true };
  }

  if (!productFile || productFile.size === 0) {
    return { message: 'O arquivo de dados de produtos é obrigatório.', isError: true };
  }
  if (productFile.type !== 'text/csv') {
    return { message: 'O arquivo de dados do produto deve ser um CSV.', isError: true };
  }

  try {
    const financialData = await financialFile.text();
    const productData = await productFile.text();

    const result = await crossAnalyzeData({ financialData, productData });

    return { message: 'Análise completa.', analysis: result, isError: false };
  } catch (e) {
    console.error(e);
    let errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    if (errorMessage.includes('503 Service Unavailable') || errorMessage.includes('model is overloaded')) {
      errorMessage = 'O serviço de análise está sobrecarregado no momento. Por favor, tente novamente mais tarde.';
    }
    return { message: `A análise falhou: ${errorMessage}`, isError: true };
  }
}
