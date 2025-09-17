import { config } from 'dotenv';
config();

import { genkit } from 'genkit';
import '@/ai/flows/generate-executive-summary.ts';
import '@/ai/flows/cross-analyze-data.ts';
import '@/ai/flows/calculate-cost-percentage.ts';

export default genkit;
