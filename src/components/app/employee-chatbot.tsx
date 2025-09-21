"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Bot, Sparkles, User, FileText, CalendarCheck, CircleHelp, Wallet } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { employeeChatbot } from '@/ai/flows/employee-chatbot';
import type { Employee } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ChatMessage {
    role: 'user' | 'bot';
    content: string;
}

interface EmployeeChatbotProps {
    employee: Employee;
}

const PREDEFINED_PROMPTS = [
    {
        icon: Wallet,
        text: "What is my current leave balance?"
    },
    {
        icon: CalendarCheck,
        text: "Is my recent request approved?"
    },
    {
        icon: FileText,
        text: "Draft a regularization request for yesterday."
    },
    {
        icon: CircleHelp,
        text: "Show me the company's Work-From-Home policy."
    }
]

export function EmployeeChatbot({ employee }: EmployeeChatbotProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        setMessages([
            { role: 'bot', content: `Hi ${employee.name.split(' ')[0]}, I'm your Synapse Assistant. How can I help you today?` }
        ]);
    }, [employee.name]);

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
            const botResponse = await employeeChatbot({ query, employee, history });
            const botMessage: ChatMessage = { role: 'bot', content: botResponse };
            setMessages(prev => [...prev, botMessage]);
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
        <Card className="w-full h-full flex flex-col border-0 shadow-none rounded-none bg-transparent">
            <CardHeader className='border-b'>
                <CardTitle className="flex items-center gap-2"><Bot /> Synapse Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-4">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="space-y-4 pr-4">
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                                {message.role === 'bot' && (
                                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                        <Bot className='m-1.5'/>
                                    </Avatar>
                                )}
                                <div className={cn("rounded-lg p-3 max-w-sm whitespace-pre-wrap", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    <p className="text-sm">{message.content}</p>
                                     {index === 0 && messages.length === 1 && (
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            {PREDEFINED_PROMPTS.map(prompt => (
                                                <Button key={prompt.text} variant="outline" size="sm" className="h-auto whitespace-normal justify-start text-left" onClick={() => callChatbot(prompt.text)}>
                                                    <prompt.icon className="h-4 w-4 mr-2 shrink-0"/> {prompt.text}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {message.role === 'user' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                    <Bot className='m-1.5'/>
                                </Avatar>
                                <div className="rounded-lg p-3 bg-muted flex items-center space-x-2">
                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                    <p className="text-sm">Thinking...</p>
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
                        placeholder="Type your message..."
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
    );
}
