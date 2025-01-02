import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function HelpSupport() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4">Help & Support</h2>
      <div className="mb-4">
        <h3 className="text-xl font-medium mb-2">FAQs</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>How do I place an order?</li>
          <li>What payment methods do you accept?</li>
          <li>How can I track my order?</li>
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-medium mb-2">Contact Support</h3>
        <form className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Enter subject" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Enter your message" />
          </div>
          <Button type="submit">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
