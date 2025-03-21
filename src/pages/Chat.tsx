
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Send, User, Phone, Video } from 'lucide-react';

// Dummy chat data - in a real app this would come from the database
const dummyChats = [
  {
    id: '1',
    name: 'John Smith',
    lastMessage: 'I\'ll place an order for tomorrow, thanks!',
    time: '10:23 AM',
    unread: 2,
    avatar: null,
  },
  {
    id: '2',
    name: 'Emily Johnson',
    lastMessage: 'Do you deliver to the downtown area?',
    time: 'Yesterday',
    unread: 0,
    avatar: null,
  },
  {
    id: '3',
    name: 'Michael Davis',
    lastMessage: 'The food was excellent, thank you!',
    time: 'Yesterday',
    unread: 0,
    avatar: null,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    lastMessage: 'Is the vegetarian menu available on Sundays?',
    time: '2 days ago',
    unread: 0,
    avatar: null,
  },
  {
    id: '5',
    name: 'David Thompson',
    lastMessage: 'Can I modify my recent order?',
    time: '2 days ago',
    unread: 0,
    avatar: null,
  },
];

// Dummy messages for a specific chat
const dummyMessages = [
  {
    id: '1',
    sender: 'customer',
    content: 'Hi there! I was wondering about your business hours this weekend.',
    timestamp: new Date(2023, 10, 15, 9, 32),
  },
  {
    id: '2',
    sender: 'admin',
    content: 'Hello! We\'re open from 11 AM to 10 PM on weekends. Is there anything specific you\'re looking for?',
    timestamp: new Date(2023, 10, 15, 9, 35),
  },
  {
    id: '3',
    sender: 'customer',
    content: 'Great! I\'m planning to bring a group of 8 people for dinner on Saturday. Do you recommend making a reservation?',
    timestamp: new Date(2023, 10, 15, 9, 40),
  },
  {
    id: '4',
    sender: 'admin',
    content: 'Yes, I would definitely recommend making a reservation for a group of that size, especially for weekend dinner. Would you like me to help you with that?',
    timestamp: new Date(2023, 10, 15, 9, 42),
  },
  {
    id: '5',
    sender: 'customer',
    content: 'That would be perfect! Can we reserve a table for 8 at 7 PM this Saturday?',
    timestamp: new Date(2023, 10, 15, 9, 45),
  },
  {
    id: '6',
    sender: 'admin',
    content: 'Let me check our availability... Yes, we have a table available at 7 PM for 8 people. Can I get your name and contact number to confirm the reservation?',
    timestamp: new Date(2023, 10, 15, 9, 48),
  },
  {
    id: '7',
    sender: 'customer',
    content: 'My name is John Smith and my number is 555-123-4567.',
    timestamp: new Date(2023, 10, 15, 9, 50),
  },
  {
    id: '8',
    sender: 'admin',
    content: 'Thank you, John! I\'ve confirmed your reservation for 8 people at 7 PM this Saturday. Is there anything else you\'d like to know or request for your dinner?',
    timestamp: new Date(2023, 10, 15, 9, 52),
  },
  {
    id: '9',
    sender: 'customer',
    content: 'Do you have any vegetarian options on the menu? Two people in our group are vegetarian.',
    timestamp: new Date(2023, 10, 15, 10, 0),
  },
  {
    id: '10',
    sender: 'admin',
    content: 'Absolutely! We have several vegetarian options including our popular vegetable pasta, mushroom risotto, and garden salads. We can also modify some other dishes to make them vegetarian-friendly.',
    timestamp: new Date(2023, 10, 15, 10, 5),
  },
  {
    id: '11',
    sender: 'customer',
    content: 'That sounds great! I\'ll place an order for tomorrow, thanks!',
    timestamp: new Date(2023, 10, 15, 10, 23),
  },
];

const Chat = () => {
  const [activeChat, setActiveChat] = useState(dummyChats[0]);
  const [messages, setMessages] = useState(dummyMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: (messages.length + 1).toString(),
      sender: 'admin',
      content: newMessage,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };
  
  const filteredChats = dummyChats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customer Chat</h1>
        <p className="text-gray-500">Communicate with your customers in real-time</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[75vh]">
        <Card className="md:col-span-1 flex flex-col h-full">
          <CardHeader className="pb-2">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            {filteredChats.length > 0 ? (
              <div className="space-y-2">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      activeChat.id === chat.id
                        ? 'bg-gray-100'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveChat(chat)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={chat.avatar || undefined} />
                        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{chat.name}</p>
                          <p className="text-xs text-gray-500">{chat.time}</p>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                          {chat.unread > 0 && (
                            <Badge className="ml-2 bg-blue-500 hover:bg-blue-600">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No conversations found</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3 flex flex-col h-full">
          {activeChat ? (
            <>
              <CardHeader className="pb-2 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={activeChat.avatar || undefined} />
                      <AvatarFallback>{activeChat.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{activeChat.name}</CardTitle>
                      <p className="text-sm text-gray-500">Last active: {activeChat.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone size={18} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video size={18} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <User size={18} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-6">
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    // Add date separator if it's a new day
                    const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                    
                    return (
                      <React.Fragment key={message.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${
                            message.sender === 'admin' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.sender === 'admin'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p
                              className={`text-xs mt-1 text-right ${
                                message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-10 flex-grow"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={newMessage.trim() === ''}
                    className="self-end"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;
