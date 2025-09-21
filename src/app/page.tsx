import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Bluetooth, MessageCircleCode } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <BrainCircuit className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-charcoal">Synapse</span>
            </div>
            <Button asChild>
                <Link href="/demo">Request a Demo</Link>
            </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative py-20 md:py-32 bg-off-white">
            <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'url(/abstract-nodes.svg)', backgroundSize: 'cover' }}></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                <h1 className="text-4xl md:text-6xl font-bold text-charcoal leading-tight">
                Synapse: Your Workplace, Understood.
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-gray">
                Move beyond attendance. Leverage predictive AI to understand your workforce, prevent attrition, and build a more engaged team.
                </p>
                <div className="mt-10">
                    <Button size="lg" asChild>
                        <Link href="/demo">Request a Demo</Link>
                    </Button>
                </div>
            </div>
        </section>
        
        <section className="py-20 md:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                             <div className="bg-primary/10 p-4 rounded-full">
                                <Bluetooth className="h-8 w-8 text-primary" />
                             </div>
                        </div>
                        <h3 className="text-2xl mb-2">Dynamic Presence</h3>
                        <p className="text-slate-gray">
                        Frictionless, beacon-based technology provides hyper-accurate presence data, eliminating manual check-ins.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                             <div className="bg-primary/10 p-4 rounded-full">
                                <BrainCircuit className="h-8 w-8 text-primary" />
                             </div>
                        </div>
                        <h3 className="text-2xl mb-2">Predictive Analytics</h3>
                        <p className="text-slate-gray">
                        Our AI analyzes behavioral patterns to calculate employee flight risk and team collaboration scores.
                        </p>
                    </div>
                     <div className="text-center">
                        <div className="flex justify-center mb-4">
                             <div className="bg-primary/10 p-4 rounded-full">
                                <MessageCircleCode className="h-8 w-8 text-primary" />
                             </div>
                        </div>
                        <h3 className="text-2xl mb-2">AI Strategic Assistant</h3>
                        <p className="text-slate-gray">
                        Empower your managers and HR teams with an AI partner that provides instant insights and actionable growth plans.
                        </p>
                    </div>
                </div>
            </div>
        </section>
      </main>

       <footer className="bg-off-white border-t">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-slate-gray text-sm">
          &copy; {new Date().getFullYear()} Synapse, Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
