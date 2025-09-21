
"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWifi } from "@/lib/hooks/use-wifi";
import { User, Wifi, WifiOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmployeeLoginPage() {
    const router = useRouter();
    const { isConnected } = useWifi();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected) return;
        // In a real app, you would have authentication logic here
        router.push('/employee');
    }

    const wifiStatusKnown = isConnected !== null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <User className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Employee Login</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          {wifiStatusKnown && !isConnected && (
              <Alert variant="destructive" className="mb-4">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Wi-Fi Not Detected</AlertTitle>
                <AlertDescription>
                  You must be connected to the office Wi-Fi to log in.
                </AlertDescription>
              </Alert>
            )}
          {!wifiStatusKnown && (
              <div className="flex items-center justify-center p-4 mb-4 rounded-md bg-muted text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Wi-Fi connection...
              </div>
          )}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="employee@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={!isConnected}>
              { !wifiStatusKnown ? 'Checking Status...' : isConnected ? 'Login' : 'Login Disabled' }
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
            <Link href="/" className="underline">
              Back to main page
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
