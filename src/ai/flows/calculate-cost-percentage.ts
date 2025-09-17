'use server';

/**
 * @fileOverview Calculates the 'Cost Percentage of Rate' for each transaction in the financial data.
 *
 * - calculateCostPercentage - A function that calculates the cost percentage.
 * - CalculateCostPercentageInput - The input type for the calculateCostPercentage function.
 * - CalculateCostPercentageOutput - The return type for the calculateCostPercentage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateCostPercentageInputSchema = z.object({
  taxas: z.number().describe('The amount of taxes for the transaction.'),
  valorTotal: z.number().describe('The total value of the transaction.'),
});
export type CalculateCostPercentageInput = z.infer<typeof CalculateCostPercentageInputSchema>;

const CalculateCostPercentageOutputSchema = z.number().describe('The calculated cost percentage of the rate.');
export type CalculateCostPercentageOutput = z.infer<typeof CalculateCostPercentageOutputSchema>;

export async function calculateCostPercentage(input: CalculateCostPercentageInput): Promise<CalculateCostPercentageOutput> {
  return calculateCostPercentageFlow(input);
}

const calculateCostPercentageFlow = ai.defineFlow(
  {
    name: 'calculateCostPercentageFlow',
    inputSchema: CalculateCostPercentageInputSchema,
    outputSchema: CalculateCostPercentageOutputSchema,
  },
  async input => {
    const {taxas, valorTotal} = input;
    let custoPercentualDaTaxa = 0;

    if (valorTotal !== 0) {
      custoPercentualDaTaxa = (taxas / valorTotal) * 100;
    }

    return custoPercentualDaTaxa;
  }
);
