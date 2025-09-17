import { VisanLogo } from './visan-logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <VisanLogo className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold font-headline">
            Analista de relatórios de vendas - Visan
          </span>
        </div>
      </div>
    </header>
  );
}
