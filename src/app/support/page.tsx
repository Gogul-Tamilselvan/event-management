import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Button } from "@/components/ui/button"
  
  const faqItems = [
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking the 'Sign Up' button in the top right corner of the page. You will be asked to select a role (Attendee, Organizer, or Admin) and provide your details."
    },
    {
      question: "How do I create an event as an organizer?",
      answer: "Once you are logged in as an Organizer, navigate to your dashboard. You will find a 'Create New Event' form. Fill in the required details and submit it for approval."
    },
    {
      question: "How do I add an event to my calendar?",
      answer: "On the event details page or in your attendee dashboard, there is an 'Add to Calendar' button. Click it to get options for Google Calendar, Outlook, and iCal."
    },
    {
      question: "What is the event approval process?",
      answer: "All new events are reviewed to ensure they meet our community standards. Our system uses an AI to perform an initial check, followed by a potential manual review by our admin team. You will be notified of the status."
    },
    {
      question: "How can I get a reminder for an event?",
      answer: "On the event details page, you can click the 'Email Me a Reminder' button. We will send you an email notification 24 hours before the event starts."
    }
  ]
  
  export default function SupportPage() {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Support Center</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            How can we help you today?
          </p>
        </div>
  
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search for Help</CardTitle>
              <CardDescription>
                Have a question? Search our knowledge base.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex w-full items-center space-x-2">
                    <Input type="text" placeholder="e.g., How to create an event" />
                    <Button type="submit">Search</Button>
                </div>
            </CardContent>
          </Card>
  
          <h2 className="font-headline text-3xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-semibold">{item.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    )
  }
  