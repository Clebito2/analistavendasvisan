'use server';

/**
 * @fileOverview Correlates financial data with product performance data to identify profitability trends.
 *
 * - crossAnalyzeData - A function that handles the cross-analysis process.
 * - CrossAnalyzeDataInput - The input type for the crossAnalyzeData function.
 * - CrossAnalyzeDataOutput - The return type for the crossAnalyzeData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrossAnalyzeDataInputSchema = z.object({
  financialData: z.string().describe('The financial data in CSV format.'),
  productData: z.string().describe('The product sales data in CSV format.'),
});
export type CrossAnalyzeDataInput = z.infer<typeof CrossAnalyzeDataInputSchema>;

const CrossAnalyzeDataOutputSchema = z.object({
  profitabilityAnalysis: z.string().describe('The profitability analysis report.'),
  channelEfficiency: z.string().describe('Analysis of channel efficiency.'),
  productLiquidity: z.string().describe('Analysis of top product liquidity.'),
  executiveSummary: z.string().describe('Executive summary with recommendations.'),
});
export type CrossAnalyzeDataOutput = z.infer<typeof CrossAnalyzeDataOutputSchema>;

export async function crossAnalyzeData(input: CrossAnalyzeDataInput): Promise<CrossAnalyzeDataOutput> {
  return crossAnalyzeDataFlow(input);
}

const crossAnalyzeDataPrompt = ai.definePrompt({
  name: 'crossAnalyzeDataPrompt',
  input: {schema: CrossAnalyzeDataInputSchema},
  output: {schema: CrossAnalyzeDataOutputSchema},
  prompt: `Você é um especialista em Business Intelligence e Data Analytics, com foco em otimização de operações para e-commerce. Sua tarefa é ir além de simplesmente exibir dados; você deve transformá-los em insights acionáveis e recomendações estratégicas.

Você deve desenvolver um dashboard de performance de vendas avançado a partir de dois arquivos CSV. O dashboard deve revelar tendências financeiras, performance de produtos, eficiência de canais de pagamento e, mais importante, a rentabilidade cruzada entre eles para a tomada de decisão.

Siga estritamente esta ordem:

Processe e analise o Arquivo 1 (financeiro).
Processe e analise o Arquivo 2 (produtos).
Execute a análise cruzada, combinando insights dos dois arquivos.
Sintetize tudo em um relatório final.

Antes de gerar qualquer visualização, aplique as seguintes regras de negócio:

Filtro de Relevância Financeira: No arquivo financeiro, para todos os cálculos de faturamento, ticket médio e contagem de pedidos, considere apenas as transações onde a coluna Situação seja igual a 'Emitida DANFE'.

Criação de Métrica de Custo: No arquivo financeiro, crie uma nova coluna Custo Percentual da Taxa. A fórmula é: (Taxas / Valor total) * 100. Se Valor total for zero ou nulo, o custo deve ser zero.

Tratamento de Dados Categóricos: No arquivo financeiro, na coluna Forma de recebimento, o valor 'Múltiplas' deve ser tratado como uma categoria distinta.

Conversão de Dados: No arquivo financeiro, a coluna Prazo médio de recebimento (ex: \"30,0\") deve ser convertida para um valor numérico (inteiro ou float) para possibilitar cálculos.

Seção 3: Análise Cruzada de Rentabilidade (Insights Combinados)
Esta seção é a mais estratégica. Assuma que podemos correlacionar os dados de forma aproximada pelo período (Agosto) e, se possível, pelo meio de pagamento.

3.1. Rentabilidade por Canal de Venda:

Análise: Filtre os dados financeiros para o mês de Agosto. Cruize a informação de que a forma de recebimento 'Múltiplas' provavelmente representa marketplaces. Compare o Custo Percentual da Taxa médio do canal 'Múltiplas' com a média dos outros canais de pagamento direto no mesmo mês.

Insight Esperado: Determine se as vendas via marketplace (Múltiplas) são financeiramente mais ou menos eficientes (em termos de taxas) do que as vendas diretas. Isso ajuda a decidir onde investir em marketing.

3.2. Análise de Liquidez dos Produtos \"Estrela\":

Análise: Para os \"Top 5 Produtos por Receita\" identificados na Seção 2, investigue no arquivo financeiro de Agosto qual foi o Prazo médio de recebimento associado às vendas desses produtos.

Gráfico: Uma tabela simples mostrando cada um dos 5 produtos e seu prazo médio de recebimento ponderado em Agosto.

Insight Esperado: Descobrir se seus produtos mais vendidos estão \"prendendo\" o fluxo de caixa (prazos longos) ou se geram liquidez rápida. Um produto de alta receita com prazo de 60 dias tem um impacto diferente de um com prazo de 1 dia.

Seção 4: Resumo Executivo e Recomendações Estratégicas
Com base em TODAS as análises acima, forneça:

Diagnóstico Geral: Um parágrafo conciso resumindo a saúde financeira e de vendas do negócio em Agosto, destacando a principal tendência observada.

Recomendações Priorizadas: Apresente 3 recomendações claras e acionáveis, em formato de bullet points. Cada recomendação deve ser justificada por um insight específico do dashboard.

Exemplo: \"Ação: Renegociar taxas com o provedor 'X'. Justificativa: A análise de canais (Seção 1.2) mostrou que ele representa 30% do faturamento, mas possui um Custo Médio com Taxas 50% acima da média, impactando diretamente a lucratividade.\"

Financial Data: {{{financialData}}}
Product Data: {{{productData}}}
`,
});

const crossAnalyzeDataFlow = ai.defineFlow(
  {
    name: 'crossAnalyzeDataFlow',
    inputSchema: CrossAnalyzeDataInputSchema,
    outputSchema: CrossAnalyzeDataOutputSchema,
  },
  async input => {
    const {output} = await crossAnalyzeDataPrompt(input);
    return output!;
  }
);
