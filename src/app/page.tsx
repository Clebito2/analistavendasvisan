import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { Header } from '@/components/dashboard/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <DashboardClient />
      </main>
    </div>
  );
}
