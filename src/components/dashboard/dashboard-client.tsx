'use client';

import { useEffect, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateAnalysis, State } from '@/app/actions';
import { UploadForm } from './upload-form';
import { AnalysisCard } from './analysis-card';
import { DollarSign, LineChart, ShoppingCart, FileText, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataBarChart } from './charts/data-bar-chart';
import { DataPieChart } from './charts/data-pie-chart';

const initialState: State = { message: null, analysis: null };

export function DashboardClient() {
  const [state, formAction] = useActionState(generateAnalysis, initialState);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Erro' : 'Sucesso',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
    }
    if (state.analysis) {
      setShowResults(true);
    }
  }, [state, toast]);

  const handleNewAnalysis = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {showResults && state.analysis ? (
        <div className="space-y-8 animate-in fade-in-50 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <h2 className="text-3xl font-bold font-headline tracking-tight">
              Dashboard de Performance de Vendas
            </h2>
            <Button onClick={handleNewAnalysis}>Analisar Novos Arquivos</Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DataBarChart
              title="Top 5 Produtos por Receita"
              data={state.analysis.topProductsChartData}
              dataKey="value"
              indexKey="name"
              className="lg:col-span-2"
              valueFormatter={(value) => `R$${value.toLocaleString('pt-BR')}`}
            />
            <DataPieChart
              title="Faturamento por Canal de Venda"
              data={state.analysis.salesByChannelChartData}
              dataKey="value"
              indexKey="name"
              valueFormatter={(value) => `R$${value.toLocaleString('pt-BR')}`}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <AnalysisCard
              title="Análise de Rentabilidade"
              icon={<DollarSign className="h-6 w-6 text-primary" />}
              content={state.analysis.profitabilityAnalysis}
            />
            <AnalysisCard
              title="Eficiência do Canal"
              icon={<LineChart className="h-6 w-6 text-primary" />}
              content={state.analysis.channelEfficiency}
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <DataBarChart
              title="Receita por Pagamento"
              data={state.analysis.revenueByPaymentMethodChartData}
              dataKey="value"
              indexKey="name"
              valueFormatter={(value) => `R$${value.toLocaleString('pt-BR')}`}
            />
            <DataBarChart
              title="Custo Médio por Canal (%)"
              data={state.analysis.costByPaymentMethodChartData}
              dataKey="value"
              indexKey="name"
              valueFormatter={(value) => `${value.toFixed(2)}%`}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-1">
            <AnalysisCard
              title="Liquidez do Produto"
              icon={<ShoppingCart className="h-6 w-6 text-primary" />}
              content={state.analysis.productLiquidity}
              className="md:col-span-1"
            />
            <AnalysisCard
              title="Resumo Executivo e Recomendações"
              icon={<FileText className="h-6 w-6 text-primary" />}
              content={state.analysis.executiveSummary}
              className="md:col-span-1"
            />
          </div>
        </div>
      ) : (
        <UploadForm formAction={formAction} />
      )}
    </div>
  );
}
