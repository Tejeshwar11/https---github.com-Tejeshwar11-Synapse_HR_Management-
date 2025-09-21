
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  fullName: z.string().min(1, "Full Name is required."),
  phone: z.string().min(1, "Phone Number is required."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().min(1, "Company Name is required."),
  country: z.string().min(1, "Country is required."),
  employees: z.string().min(1, "Number of employees is required."),
  robot: z.boolean().refine(val => val === true, "Please confirm you are not a robot."),
});

export default function DemoPage() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            email: "",
            company: "",
            robot: false,
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
        toast({
            title: "Demo Request Submitted!",
            description: "Thank you! Our team will get in touch with you shortly.",
        });
        router.push('/');
    };

  return (
    <div className="min-h-screen bg-gray-50">
       <header className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-charcoal">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    Synapse
                </Link>
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline">
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="#">Contact Sales</Link>
                    </Button>
                </div>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-orange-500 text-white p-10 rounded-lg">
                <h1 className="text-4xl font-bold mb-4">Manage Your People and Operations in One Place</h1>
                <p className="mb-6 opacity-90">Discover the power and versatility of Synapse with a free demo.</p>
                <ul className="space-y-4 list-disc list-inside">
                    <li>Evaluate Synapse without any financial commitment. Assess whether the platform aligns with your organization's needs and meets your expectations before making a purchasing decision.</li>
                    <li>Experience Synapse's transformative HR features during the free demo, covering employee data management, performance evaluation, and more.</li>
                    <li>Our expert team will closely collaborate with you during the demo to tailor Synapse according to your unique organizational needs.</li>
                    <li>Witness the firsthand benefits of Synapse's platform, such as time saved on HR tasks, increased HR team efficiency, and improved employee experience</li>
                </ul>
            </div>
            <div className="bg-white p-10 rounded-lg shadow-md border">
                <h2 className="text-3xl font-bold text-charcoal mb-4">We Just Need a Few Details.</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                <Input placeholder="Your Full Name*" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                <Input placeholder="Phone Number*" {...field} />
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
                                <FormLabel>Business Email</FormLabel>
                                <FormControl>
                                <Input placeholder="Business Email*" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                <Input placeholder="Company Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="grid sm:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Country" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="us">United States</SelectItem>
                                    <SelectItem value="in">India</SelectItem>
                                    <SelectItem value="ca">Canada</SelectItem>
                                    <SelectItem value="gb">United Kingdom</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                             <FormField
                            control={form.control}
                            name="employees"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>No of Employees</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Number of Employees" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="1-50">1-50</SelectItem>
                                    <SelectItem value="51-100">51-100</SelectItem>
                                    <SelectItem value="101-500">101-500</SelectItem>
                                    <SelectItem value="500+">500+</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="robot"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                    I'm not a robot
                                    </FormLabel>
                                </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">Get a Free Demo</Button>
                    </form>
                </Form>
                 <p className="text-xs text-slate-gray mt-4 text-center">We respect your privacy. By submitting, you agree to your information being processed according to our privacy policy.</p>
            </div>
        </div>
      </main>
    </div>
  );
}
