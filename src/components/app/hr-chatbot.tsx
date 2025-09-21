"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Bot, Sparkles, User, FileWarning, CalendarSearch, FileUp, ListTodo } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { hrChatbot, HrChatbotOutput } from '@/ai/flows/employee-chatbot';
import type { HrAdmin, Employee } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface ChatMessage {
    role: 'user' | 'bot';
    content: string;
    data?: HrChatbotOutput['data'];
}

interface HrChatbotProps {
    hrUser: HrAdmin;
}

const PREDEFINED_PROMPTS = [
    {
        icon: FileWarning,
        text: "Who are the top 5 employees with high flight risk?"
    },
    {
        icon: CalendarSearch,
        text: "Show me the attendance summary for the Sales department this month."
    },
    {
        icon: FileUp,
        text: "Generate a Growth Plan for employee #102."
    },
    {
        icon: ListTodo,
        text: "List all pending approval requests."
    }
]

const GrowthPlanDialog = ({ employee, open, onOpenChange }: { employee: Employee, open: boolean, onOpenChange: (open: boolean) => void }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>AI-Generated Growth Plan for {employee.name}</DialogTitle>
                    <DialogDescription>
                        A tailored plan to support {employee.name.split(' ')[0]}'s growth and address flight risk factors.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-charcoal">1. Address Key Concerns</h4>
                        <ul className="list-disc pl-5 text-sm text-slate-gray space-y-1">
                           {employee.flightRisk?.contributingFactors.map((factor, i) => (
                                <li key={i}>
                                    <strong>{factor.startsWith('↓') ? 'Mitigate Decreased Engagement:' : 'Address Increased Strain:'}</strong>
                                    {factor.includes('collaboration') && " Schedule a skip-level meeting to discuss their current projects and team dynamics. Pair them with a junior engineer for a mentorship opportunity to foster engagement."}
                                    {factor.includes('leave') && " Review recent leave patterns. Open a supportive conversation about workload and well-being. Ensure they are aware of company mental health resources."}
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-semibold text-charcoal">2. Strategic Skill Development</h4>
                         <p className="text-sm text-slate-gray">Enroll {employee.name.split(' ')[0]} in the upcoming **Advanced Project Management** internal workshop to build leadership skills. Assign a stretch project that aligns with their stated interest in `System Architecture`.</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-charcoal">3. Recognition & Impact</h4>
                        <p className="text-sm text-slate-gray">Publicly recognize their recent contributions in the next team meeting. Create a clear line of sight between their work and its impact on company-wide goals to increase their sense of value.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function HrChatbot({ hrUser }: HrChatbotProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [growthPlanEmployee, setGrowthPlanEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        setMessages([
            { role: 'bot', content: `Welcome, ${hrUser.name.split(' ')[0]}. I'm your Synapse Co-Pilot. What insights can I get for you?` }
        ]);
    }, [hrUser.name]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const callChatbot = async (query: string) => {
        const userMessage: ChatMessage = { role: 'user', content: query };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const history = [...messages, userMessage];
            const botResponse = await hrChatbot({ query, history });
            const botMessage: ChatMessage = { role: 'bot', content: botResponse.response, data: botResponse.data };
            setMessages(prev => [...prev, botMessage]);

            // Handle specific data-driven actions
            if (botResponse.data?.type === 'growth-plan') {
                setGrowthPlanEmployee(botResponse.data.employee);
            }

        } catch (error) {
            const errorMessage: ChatMessage = { role: 'bot', content: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        callChatbot(input);
    };

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    return (
        <>
            <Card className="w-full h-full flex flex-col rounded-xl shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary" /> Synapse Co-Pilot</CardTitle>
                    <CardDescription>Your strategic AI partner for HR insights.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-4">
                    <ScrollArea className="h-full" ref={scrollAreaRef}>
                        <div className="space-y-4 pr-4">
                            {messages.map((message, index) => (
                                <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                                    {message.role === 'bot' && (
                                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                            <Sparkles className='m-1.5' />
                                        </Avatar>
                                    )}
                                    <div className={cn(
                                        "rounded-lg p-3 max-w-full whitespace-pre-wrap", 
                                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                    )}>
                                        <p className="text-sm">{message.content}</p>
                                        {index === 0 && messages.length === 1 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                                                {PREDEFINED_PROMPTS.map(prompt => (
                                                    <Button key={prompt.text} variant="outline" size="sm" className="h-auto whitespace-normal justify-start text-left" onClick={() => callChatbot(prompt.text)}>
                                                        <prompt.icon className="h-4 w-4 mr-2 shrink-0" /> {prompt.text}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                        {message.data?.type === 'flight-risk-list' && (
                                            <div className='space-y-3 mt-3'>
                                                {message.data.employees.map((emp: any) => (
                                                    <Card key={emp.id} className='p-3'>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-sm text-charcoal">{emp.name}</p>
                                                                <p className="text-xs text-slate-gray">{emp.role}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Progress value={emp.flightRisk!.score} className="h-2 bg-orange-100 [&>div]:bg-orange-500" />
                                                                    <span className="text-xs font-bold text-orange-500">{emp.flightRisk!.score}%</span>
                                                                </div>
                                                            </div>
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Button asChild variant="secondary" size="sm">
                                                                    <Link href={`/employee/${emp.id}`}>View Profile</Link>
                                                                </Button>
                                                                <Button variant="outline" size="sm" onClick={() => setGrowthPlanEmployee(emp)}>Growth Plan</Button>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {message.role === 'user' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={hrUser.avatarUrl} alt={hrUser.name} />
                                            <AvatarFallback>{hrUser.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                     <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                        <Sparkles className='m-1.5' />
                                    </Avatar>
                                    <div className="rounded-lg p-3 bg-muted flex items-center space-x-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <p className="text-sm">Generating response...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className='border-t pt-4 bg-background'>
                    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                        <Input
                            id="message"
                            placeholder="Ask Synapse Co-Pilot..."
                            className="flex-1"
                            autoComplete="off"
                            value={input}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>

            {growthPlanEmployee && (
                <GrowthPlanDialog 
                    employee={growthPlanEmployee}
                    open={!!growthPlanEmployee}
                    onOpenChange={(open) => !open && setGrowthPlanEmployee(null)}
                />
            )}
        </>
    );
}
