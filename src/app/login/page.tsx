"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { BrainCircuit, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { authenticateUser } from "@/lib/auth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  role: z.enum(['employee', 'hr']),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: 'employee',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = authenticateUser(values.email, values.password);

    if (user) {
      toast({
        title: "Login Successful",
        description: `Welcome back! Redirecting you to your dashboard.`,
      });
      if (values.role === 'employee' && user.role === 'Employee') {
        router.push(`/employee`);
      } else if (values.role === 'hr' && user.role === 'HR') {
        router.push('/hr');
      } else {
         toast({
            variant: "destructive",
            title: "Role Mismatch",
            description: "Please select the correct role for your account.",
         });
         setIsLoading(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please check your credentials and try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-off-white">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'url(/abstract-nodes.svg)', backgroundSize: 'cover' }}></div>
        <Card className="w-full max-w-md z-10 shadow-lg bg-card border-border">
            <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <BrainCircuit className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Synapse</CardTitle>
            <CardDescription>Enter your credentials to sign in.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                            >
                            <FormItem>
                                <FormControl>
                                <RadioGroupItem value="employee" id="employee" className="sr-only" />
                                </FormControl>
                                <FormLabel
                                htmlFor="employee"
                                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${
                                    field.value === 'employee' ? 'border-primary' : ''
                                }`}
                                >
                                Employee
                                </FormLabel>
                            </FormItem>
                            <FormItem>
                                <FormControl>
                                <RadioGroupItem value="hr" id="hr" className="sr-only" />
                                </FormControl>
                                <FormLabel
                                htmlFor="hr"
                                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${
                                    field.value === 'hr' ? 'border-primary' : ''
                                }`}
                                >
                                HR / Admin
                                </FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., priya.sharma@synapse.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>Password</FormLabel>
                             <Link href="#" className="text-sm text-primary hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                        <FormControl>
                        <div className="relative">
                            <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Enter your secure password" 
                                {...field} 
                            />
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                            >
                            {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In Securely
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
    </div>
  );
}
