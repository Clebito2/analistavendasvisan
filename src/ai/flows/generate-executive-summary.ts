'use server';

/**
 * @fileOverview Generates an executive summary of sales and financial performance, including prioritized recommendations.
 *
 * - generateExecutiveSummary - A function that generates the executive summary.
 * - GenerateExecutiveSummaryInput - The input type for the generateExecutiveSummary function.
 * - GenerateExecutiveSummaryOutput - The return type for the generateExecutiveSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExecutiveSummaryInputSchema = z.object({
  financialAnalysis: z
    .string()
    .describe('The analysis of financial data from relatorio-financeiro-vendas.csv.'),
  productPerformance: z
    .string()
    .describe('The analysis of product performance data from relatorio-de-vendas_agosto.csv.'),
  profitabilityAnalysis: z
    .string()
    .describe('The cross-analysis of profitability between sales channels.'),
  liquidityAnalysis: z
    .string()
    .describe('The analysis of the liquidity of top 5 products.'),
});
export type GenerateExecutiveSummaryInput = z.infer<typeof GenerateExecutiveSummaryInputSchema>;

const GenerateExecutiveSummaryOutputSchema = z.object({
  executiveSummary: z.string().describe('A concise executive summary of the sales and financial performance.'),
  recommendations: z.string().describe('Prioritized recommendations to improve business outcomes.'),
});
export type GenerateExecutiveSummaryOutput = z.infer<typeof GenerateExecutiveSummaryOutputSchema>;

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  return generateExecutiveSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExecutiveSummaryPrompt',
  input: {schema: GenerateExecutiveSummaryInputSchema},
  output: {schema: GenerateExecutiveSummaryOutputSchema},
  prompt: `You are an expert in Business Intelligence and Data Analytics, specializing in optimizing operations for e-commerce.

  Based on the following analysis, provide a concise executive summary and prioritized recommendations.

  Financial Analysis: {{{financialAnalysis}}}
  Product Performance: {{{productPerformance}}}
  Profitability Analysis: {{{profitabilityAnalysis}}}
  Liquidity Analysis: {{{liquidityAnalysis}}}

  Instructions:
  1.  Executive Summary: Summarize the overall financial and sales health of the business in August, highlighting key trends.
  2.  Recommendations: Provide 3 clear, actionable recommendations in bullet points. Justify each recommendation with a specific insight from the analysis.
`,
});

const generateExecutiveSummaryFlow = ai.defineFlow(
  {
    name: 'generateExecutiveSummaryFlow',
    inputSchema: GenerateExecutiveSummaryInputSchema,
    outputSchema: GenerateExecutiveSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
