'use client';

import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Rocket } from 'lucide-react';
import { VisanLogo } from './visan-logo';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando...
        </>
      ) : (
        <>
          <Rocket className="mr-2 h-4 w-4" />
          Gerar Insights
        </>
      )}
    </Button>
  );
}

export function UploadForm({ formAction }: { formAction: (payload: FormData) => void }) {
  return (
    <Card className="max-w-2xl mx-auto animate-in fade-in-50 duration-500">
      <CardHeader className="items-center text-center">
        <VisanLogo className="h-12 w-12 mb-4" />
        <CardTitle className="text-2xl font-headline">Carregar Arquivos de Dados</CardTitle>
        <CardDescription>
          Carregue os arquivos CSV financeiros e de vendas de produtos para iniciar a análise.
        </CardDescription>
        <CardDescription className="pt-2 text-xs text-muted-foreground">
          <b>Onde obter os relatórios?</b><br />
          Os relatórios mensais podem ser obtidos pelo Olist (Tiny), que é o ERP da Visan, ou diretamente pelos sites dos marketplaces. Para uma análise mais precisa, utilize o relatório completo do período que deseja analisar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="financialData">Relatório Financeiro (CSV)</Label>
            <Input id="financialData" name="financialData" type="file" accept=".csv" required />
            <p className="text-xs text-muted-foreground">Ex: relatorio-financeiro-vendas.csv</p>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="productData">Relatório de Vendas de Produtos (CSV)</Label>
            <Input id="productData" name="productData" type="file" accept=".csv" required />
            <p className="text-xs text-muted-foreground">Ex: relatorio-de-vendas_agosto.csv</p>
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
