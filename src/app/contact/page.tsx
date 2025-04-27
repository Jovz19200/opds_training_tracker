"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Check } from "lucide-react"

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send the form data to your backend
    setIsSubmitted(true)
    // Reset form fields here if needed
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-50 dark:bg-gradient-to-b dark:from-black dark:to-zinc-900 py-12 md:py-16">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">Contact Us</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Have questions about OTMS or want to learn more about how we can help your organization?
                Reach out to our team today.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12 md:py-16">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  We'd love to hear from you. Fill out the form and our team will get back to you
                  as soon as possible.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mr-4 bg-primary/10 p-3 rounded-full">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">info@otms.rw</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 bg-primary/10 p-3 rounded-full">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-muted-foreground">+250 78 000 0000</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 bg-primary/10 p-3 rounded-full">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-muted-foreground">College of Science and Technology</p>
                      <p className="text-muted-foreground">School of ICT, Kigali, Rwanda</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-background rounded-lg border p-6 md:p-8">
                {isSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-6">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for contacting us. We'll get back to you shortly.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input 
                        id="name" 
                        placeholder="Enter your full name" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email address" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="organization" className="text-sm font-medium">
                        Organization
                      </label>
                      <Input 
                        id="organization" 
                        placeholder="Enter your organization name" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea 
                        id="message" 
                        placeholder="How can we help you?" 
                        rows={5}
                        required 
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-50 dark:bg-gradient-to-b dark:from-black dark:to-zinc-900 py-12 md:py-16">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background rounded-lg p-6 border dark:border-zinc-800 dark:shadow-md dark:shadow-black/30">
                <h3 className="text-xl font-bold mb-2">What is OTMS?</h3>
                <p className="text-muted-foreground">
                  OTMS (Organization Training Management System) is a comprehensive platform designed 
                  to help Organizations of People with Disabilities (OPDs) manage their training programs 
                  efficiently.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 border dark:border-zinc-800 dark:shadow-md dark:shadow-black/30">
                <h3 className="text-xl font-bold mb-2">Who can use OTMS?</h3>
                <p className="text-muted-foreground">
                  OTMS is designed specifically for Organizations of People with Disabilities (OPDs) 
                  in Rwanda, but can be adapted for any organization looking to improve their training 
                  management processes.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 border dark:border-zinc-800 dark:shadow-md dark:shadow-black/30">
                <h3 className="text-xl font-bold mb-2">How can I implement OTMS in my organization?</h3>
                <p className="text-muted-foreground">
                  Contact our team through this form, and we'll guide you through the implementation 
                  process, including setup, training, and ongoing support.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 border dark:border-zinc-800 dark:shadow-md dark:shadow-black/30">
                <h3 className="text-xl font-bold mb-2">Is OTMS accessible for users with disabilities?</h3>
                <p className="text-muted-foreground">
                  Yes, OTMS is designed with accessibility in mind. While the system itself may have 
                  some limitations, it can be used with external software like JAWS to ensure inclusivity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}