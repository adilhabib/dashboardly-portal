
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, Plus, Clock, CalendarIcon } from 'lucide-react';

// Dummy events data - in a real app this would come from the database
const dummyEvents = [
  {
    id: '1',
    title: 'Staff Meeting',
    date: new Date(2023, 10, 15, 10, 0),
    endTime: new Date(2023, 10, 15, 11, 30),
    type: 'meeting',
    description: 'Monthly staff meeting to discuss operations and upcoming events.',
    location: 'Conference Room A',
  },
  {
    id: '2',
    title: 'Inventory Restock',
    date: new Date(2023, 10, 16, 9, 0),
    endTime: new Date(2023, 10, 16, 11, 0),
    type: 'task',
    description: 'Restock inventory for the weekend rush.',
    assignedTo: 'John Doe',
  },
  {
    id: '3',
    title: 'Special Promotion Planning',
    date: new Date(2023, 10, 18, 14, 0),
    endTime: new Date(2023, 10, 18, 16, 0),
    type: 'meeting',
    description: 'Plan for the upcoming holiday promotions.',
    location: 'Meeting Room B',
  },
  {
    id: '4',
    title: 'Deep Kitchen Cleaning',
    date: new Date(2023, 10, 20, 22, 0),
    endTime: new Date(2023, 10, 21, 1, 0),
    type: 'task',
    description: 'Scheduled deep cleaning of the kitchen after closing.',
    assignedTo: 'Cleaning Staff',
  },
  {
    id: '5',
    title: 'Chef\'s Tasting Menu',
    date: new Date(2023, 10, 22, 18, 0),
    endTime: new Date(2023, 10, 22, 21, 0),
    type: 'event',
    description: 'Special chef\'s tasting menu event for VIP customers.',
    location: 'Main Dining Area',
  },
];

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getEventsForSelectedDay = () => {
    if (!date) return [];
    
    return dummyEvents.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };
  
  const handleAddNewEvent = () => {
    setSelectedEvent(null);
    setIsEventDialogOpen(true);
  };
  
  const selectedDayEvents = getEventsForSelectedDay();
  const hasEvents = selectedDayEvents.length > 0;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-gray-500">Manage your restaurant's schedule and events</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Restaurant Calendar</CardTitle>
              <Tabs value={view} onValueChange={(value) => setView(value as 'month' | 'week' | 'day')}>
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="day">Day</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date'}</CardTitle>
              <Button size="sm" onClick={handleAddNewEvent} className="flex items-center gap-1">
                <Plus size={16} />
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {hasEvents ? (
              <div className="space-y-4">
                {selectedDayEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'task' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                      <Clock size={14} className="mr-1" />
                      {formatTime(event.date)} - {formatTime(event.endTime)}
                    </div>
                    {event.location && (
                      <div className="text-sm text-gray-500">
                        📍 {event.location}
                      </div>
                    )}
                    {event.assignedTo && (
                      <div className="text-sm text-gray-500">
                        👤 {event.assignedTo}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 mb-2">No events scheduled for this day</p>
                <Button variant="outline" onClick={handleAddNewEvent} className="mt-2">
                  Add New Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Event Details' : 'Add New Event'}</DialogTitle>
            {!selectedEvent && (
              <DialogDescription>
                Create a new event for {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </DialogDescription>
            )}
          </DialogHeader>
          
          {selectedEvent ? (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="text-lg font-medium">{selectedEvent.title}</h3>
                <div className="flex items-center text-gray-500 mt-1">
                  <CalendarIcon size={16} className="mr-2" />
                  {selectedEvent.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center text-gray-500 mt-1">
                  <Clock size={16} className="mr-2" />
                  {formatTime(selectedEvent.date)} - {formatTime(selectedEvent.endTime)}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Type</p>
                <div className={`inline-block text-sm px-2 py-0.5 rounded-full ${
                  selectedEvent.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                  selectedEvent.type === 'task' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </div>
              </div>
              
              {selectedEvent.location && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                  <p>{selectedEvent.location}</p>
                </div>
              )}
              
              {selectedEvent.assignedTo && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Assigned To</p>
                  <p>{selectedEvent.assignedTo}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700">{selectedEvent.description}</p>
              </div>
              
              <DialogFooter className="flex gap-2 mt-4">
                <Button variant="outline">Edit</Button>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </div>
          ) : (
            <form className="space-y-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <label className="text-sm font-medium">Event Title</label>
                  <Input placeholder="Enter event title" className="mt-1" />
                </div>
                
                <div className="col-span-4">
                  <label className="text-sm font-medium">Event Type</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <label className="text-sm font-medium">Start Time</label>
                  <Input type="time" className="mt-1" />
                </div>
                
                <div className="col-span-2">
                  <label className="text-sm font-medium">End Time</label>
                  <Input type="time" className="mt-1" />
                </div>
                
                <div className="col-span-4">
                  <label className="text-sm font-medium">Location (optional)</label>
                  <Input placeholder="Enter location" className="mt-1" />
                </div>
                
                <div className="col-span-4">
                  <label className="text-sm font-medium">Assigned To (optional)</label>
                  <Input placeholder="Enter person or team" className="mt-1" />
                </div>
                
                <div className="col-span-4">
                  <label className="text-sm font-medium">Description (optional)</label>
                  <Textarea placeholder="Enter event description" className="mt-1" />
                </div>
              </div>
              
              <DialogFooter className="flex gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Event</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
