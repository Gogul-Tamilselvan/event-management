import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CreateEventForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>
          Fill out the details below to create your next event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              type="text"
              className="w-full"
              placeholder="e.g. Annual Tech Summit"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide a compelling description of your event."
              className="min-h-32"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
             <div className="grid gap-3">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" />
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              className="w-full"
              placeholder="e.g. Silicon Valley Convention Center"
            />
          </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-3">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category" aria-label="Select category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                     <SelectItem value="community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" placeholder="2000" />
              </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="picture">Event Image</Label>
            <Input id="picture" type="file" />
          </div>
          <Button type="submit" className="w-full">Create Event</Button>
        </form>
      </CardContent>
    </Card>
  );
}
