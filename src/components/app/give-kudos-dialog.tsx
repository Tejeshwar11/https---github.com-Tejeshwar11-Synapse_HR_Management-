"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Award, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { mockEmployees } from "@/lib/data"
import { Combobox } from "../ui/combobox"

const formSchema = z.object({
  recipient: z.string({ required_error: "Please select an employee." }),
  message: z.string().min(10, "Message must be at least 10 characters long.").max(280),
})

export function GiveKudosDialog() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const employeeOptions = mockEmployees.map(e => ({ value: e.id, label: e.name }));

  function onSubmit(values: z.infer<typeof formSchema>) {
    const recipientName = employeeOptions.find(e => e.value === values.recipient)?.label || 'a colleague';
    toast({
      title: "Kudos Sent!",
      description: `You've sent recognition to ${recipientName}.`,
    })
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="transition-transform hover:scale-105">
          <Award className="mr-2 h-4 w-4" /> Give Kudos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Give Kudos</DialogTitle>
          <DialogDescription>
            Recognize a colleague for their outstanding work and contribution.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Recipient</FormLabel>
                  <Combobox
                    options={employeeOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select an employee..."
                    searchPlaceholder="Search employee..."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share why you're giving them kudos..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" /> Send Kudos
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
