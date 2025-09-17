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

const ChartDataSchema = z.array(
  z.object({
    name: z.string().describe('The name of the data point (e.g., product name, payment method).'),
    value: z.number().describe('The value of the data point (e.g., revenue, percentage).'),
  })
);

const CrossAnalyzeDataOutputSchema = z.object({
  profitabilityAnalysis: z.string().describe('The profitability analysis report.'),
  channelEfficiency: z.string().describe('Analysis of channel efficiency.'),
  productLiquidity: z.string().describe('Analysis of top product liquidity.'),
  executiveSummary: z.string().describe('Executive summary with recommendations.'),
  revenueByPaymentMethodChartData: ChartDataSchema.describe('Data for the revenue by payment method bar chart.'),
  topProductsChartData: ChartDataSchema.describe('Data for the top 5 products by revenue bar chart.'),
  costByPaymentMethodChartData: ChartDataSchema.describe('Data for the average cost percentage by payment method bar chart.'),
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

1.  Processe e analise o Arquivo 1 (financeiro).
2.  Processe e analise o Arquivo 2 (produtos).
3.  Execute a análise cruzada, combinando insights dos dois arquivos.
4.  Gere os dados estruturados para os gráficos.
5.  Sintetize tudo em um relatório final.

Antes de gerar qualquer visualização, aplique as seguintes regras de negócio:

*   **Filtro de Relevância Financeira**: No arquivo financeiro, para todos os cálculos de faturamento, ticket médio e contagem de pedidos, considere apenas as transações onde a coluna 'Situação' seja igual a 'Emitida DANFE'.
*   **Criação de Métrica de Custo**: No arquivo financeiro, crie uma nova coluna 'Custo Percentual da Taxa'. A fórmula é: (Taxas / 'Valor total') * 100. Se 'Valor total' for zero ou nulo, o custo deve ser zero.
*   **Tratamento de Dados Categóricos**: No arquivo financeiro, na coluna 'Forma de recebimento', o valor 'Múltiplas' deve ser tratado como uma categoria distinta.
*   **Conversão de Dados**: No arquivo financeiro, a coluna 'Prazo médio de recebimento' (ex: "30,0") deve ser convertida para um valor numérico (inteiro ou float) para possibilitar cálculos.

**Análises e Geração de Dados para Gráficos:**

**Seção 1: Análise Financeira e de Canais**
*   **1.1. Faturamento e Ticket Médio por Forma de Pagamento**:
    *   **Análise**: Calcule o faturamento total ('Valor total'), o número de pedidos, e o ticket médio (faturamento / pedidos) para cada 'Forma de recebimento', aplicando o filtro de 'Emitida DANFE'.
    *   **Output (Gráfico)**: Gere os dados para o \`revenueByPaymentMethodChartData\`. Cada item deve ter \`name\` (a forma de pagamento) e \`value\` (o faturamento total).

*   **1.2. Eficiência de Custo por Canal**:
    *   **Análise**: Calcule a média do 'Custo Percentual da Taxa' para cada 'Forma de recebimento'. Na análise de texto para \`channelEfficiency\`, inclua o ticket médio de cada canal.
    *   **Output (Texto)**: Gere a análise de texto para \`channelEfficiency\`, comparando os custos percentuais e o ticket médio.
    *   **Output (Gráfico)**: Gere os dados para o \`costByPaymentMethodChartData\`. Cada item deve ter \`name\` (a forma de pagamento) e \`value\` (o custo percentual médio).

**Seção 2: Análise de Produtos**
*   **2.1. Top 5 Produtos por Receita**:
    *   **Análise**: Identifique os 5 produtos com maior receita total. A receita por item de produto é a coluna 'Total'. Para a análise de texto \`productLiquidity\`, crie uma tabela em formato markdown contendo as colunas: "Produto", "Receita Total", "Quantidade Vendida", "Preço Médio".
    *   **Output (Gráfico)**: Gere os dados para o \`topProductsChartData\`. Cada item deve ter \`name\` (o nome do produto, coluna 'Produto') e \`value\` (a receita total, coluna 'Total').

**Seção 3: Análise Cruzada de Rentabilidade (Insights Combinados)**
*   **3.1. Rentabilidade por Canal de Venda**:
    *   **Análise**: Filtre os dados financeiros para o mês de Agosto. Cruize a informação de que a forma de recebimento 'Múltiplas' provavelmente representa marketplaces. Compare o 'Custo Percentual da Taxa' médio do canal 'Múltiplas' com a média dos outros canais de pagamento direto no mesmo mês.
    *   **Output (Texto)**: Gere o relatório de análise para \`profitabilityAnalysis\`. Determine se as vendas via marketplace (Múltiplas) são financeiramente mais ou menos eficientes (em termos de taxas) do que as vendas diretas. Isso ajuda a decidir onde investir em marketing.

*   **3.2. Análise de Liquidez dos Produtos "Estrela"**:
    *   **Análise**: Para os "Top 5 Produtos por Receita" identificados, investigue no arquivo financeiro de Agosto qual foi o 'Prazo médio de recebimento' associado às vendas desses produtos.
    *   **Output (Texto)**: Gere a análise para \`productLiquidity\` incluindo a tabela markdown criada na seção 2.1 e complemente com uma análise sobre o 'Prazo médio de recebimento' ponderado para esses produtos. Descubra se seus produtos mais vendidos estão "prendendo" o fluxo de caixa (prazos longos) ou se geram liquidez rápida.

**Seção 4: Resumo Executivo e Recomendações Estratégicas**
Com base em TODAS as análises acima, forneça para o campo \`executiveSummary\`:
*   **Diagnóstico Geral**: Um parágrafo conciso resumindo a saúde financeira e de vendas do negócio em Agosto, destacando a principal tendência observada.
*   **Recomendações Priorizadas**: Apresente 3 recomendações claras e acionáveis, em formato de bullet points. Cada recomendação deve ser justificada por um insight específico do dashboard.

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
