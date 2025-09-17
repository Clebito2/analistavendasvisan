'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { generateAnalysis, State } from '@/app/actions';
import { UploadForm } from './upload-form';
import { AnalysisCard } from './analysis-card';
import { DollarSign, LineChart, ShoppingCart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const initialState: State = { message: null, analysis: null };

export function DashboardClient() {
  const [state, formAction] = useFormState(generateAnalysis, initialState);
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
          <h2 className="text-3xl font-bold text-center font-headline tracking-tight">
            Dashboard de Performance de Vendas
          </h2>
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
            <AnalysisCard
              title="Liquidez do Produto"
              icon={<ShoppingCart className="h-6 w-6 text-primary" />}
              content={state.analysis.productLiquidity}
              className="md:col-span-2"
            />
            <AnalysisCard
              title="Resumo Executivo e Recomendações"
              icon={<FileText className="h-6 w-6 text-primary" />}
              content={state.analysis.executiveSummary}
              className="md:col-span-2"
            />
          </div>
          <div className="text-center">
            <Button onClick={handleNewAnalysis}>Analisar Novos Arquivos</Button>
          </div>
        </div>
      ) : (
        <UploadForm formAction={formAction} />
      )}
    </div>
  );
}
