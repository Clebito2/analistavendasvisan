'use client';

import { useEffect, useState, useActionState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateAnalysis, State } from '@/app/actions';
import { UploadForm } from './upload-form';
import { AnalysisCard } from './analysis-card';
import { DollarSign, LineChart, ShoppingCart, FileText, PieChart, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataBarChart } from './charts/data-bar-chart';
import { DataPieChart } from './charts/data-pie-chart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const initialState: State = { message: null, analysis: null };

export function DashboardClient() {
  const [state, formAction] = useActionState(generateAnalysis, initialState);
  const [showResults, setShowResults] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const analysisRef = useRef<HTMLDivElement>(null);

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

  const handleExportPDF = async () => {
    if (!analysisRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(analysisRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('analise-de-vendas.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível exportar o PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {showResults && state.analysis ? (
        <div className="space-y-8 animate-in fade-in-50 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <h2 className="text-3xl font-bold font-headline tracking-tight">
              Dashboard de Performance de Vendas
            </h2>
            <div className="flex gap-2">
              <Button onClick={handleNewAnalysis}>Analisar Novos Arquivos</Button>
              <Button onClick={handleExportPDF} disabled={isExporting}>
                {isExporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="mr-2 h-4 w-4" />
                )}
                Exportar para PDF
              </Button>
            </div>
          </div>
          
          <div ref={analysisRef} className="space-y-8 bg-background p-4 rounded-lg">
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
        </div>
      ) : (
        <UploadForm formAction={formAction} />
      )}
    </div>
  );
}