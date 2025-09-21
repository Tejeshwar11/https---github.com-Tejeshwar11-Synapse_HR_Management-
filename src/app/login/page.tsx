import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, User, Building } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-charcoal">
       <Image 
        src="https://images.unsplash.com/photo-1554224154-260325c0593a?q=80&w=2940&auto=format&fit=crop"
        alt="Abstract background"
        fill
        className="object-cover"
        data-ai-hint="abstract office background"
       />
       <div className="absolute inset-0 bg-black/70"></div>
      <Card className="w-full max-w-md z-10 shadow-lg bg-card/80 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BrainCircuit className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Synapse</CardTitle>
          <CardDescription>Choose your role to sign in.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <Link href="/login/employee" passHref>
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 transition-transform hover:scale-105 hover:bg-accent bg-transparent">
                <User className="h-8 w-8 text-primary" />
                <span className="text-lg font-semibold">Employee Login</span>
            </Button>
          </Link>
          <Link href="/login/hr" passHref>
             <Button variant="outline" className="w-full h-24 flex flex-col gap-2 transition-transform hover:scale-105 hover:bg-accent bg-transparent">
                <Building className="h-8 w-8 text-primary" />
                <span className="text-lg font-semibold">HR Admin Login</span>
            </Button>
          </Link>
        </CardContent>
         <div className="mt-4 text-center text-sm pb-6">
            <Link href="/" className="underline">
              Back to main page
            </Link>
          </div>
      </Card>
    </div>
  );
}
