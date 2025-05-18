// app/events/create/page.js
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ChevronDownIcon, MapPinIcon, CalendarIcon, ClockIcon, TicketIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function CreateEventPage() {
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('Sun, May 18');
  const [endDate, setEndDate] = useState('Sun, May 18');
  const [startTime, setStartTime] = useState('10:00 am');
  const [endTime, setEndTime] = useState('11:00 am');
  const [timezone, setTimezone] = useState('GMT+08:00 Manila');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [hasTickets, setHasTickets] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [hasCapacity, setHasCapacity] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [capacity, setCapacity] = useState('Unlimited');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      {/* Navigation */}
      <nav className="bg-transparent px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="text-xl font-bold text-white">Eventra</Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Cancel
            </Button>
            <Button 
              className="bg-white text-gray-900 hover:bg-gray-100"
              disabled={!eventName.trim()}
            >
              Create Event
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Create Event</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Event Name */}
            <div className="space-y-2">
              <h2 className="text-white text-xl font-medium">Event Name</h2>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter event name"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
            </div>

            {/* Date & Time */}
            <div className="space-y-2">
              <h2 className="text-white text-xl font-medium">Start</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-gray-400 text-sm">End</h3>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{endDate}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-gray-400 text-sm">End</h3>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{endDate}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-gray-400 text-sm">Start Time</h3>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <ClockIcon className="h-5 w-5" />
                    <span>{startTime}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-gray-400 text-sm">End Time</h3>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <ClockIcon className="h-5 w-5" />
                    <span>{endTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <span>{timezone}</span>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <h2 className="text-white text-xl font-medium">Add Event Location</h2>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPinIcon className="h-5 w-5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Offline location or virtual link"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-white text-xl font-medium">Add Description</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell attendees what your event is about"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
              />
            </div>

            <div className="border-t border-gray-700 my-4"></div>

            {/* Event Options */}
            <div className="space-y-4">
              <h2 className="text-white text-xl font-medium">Event Options</h2>
              
              {/* Tickets */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TicketIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">Tickets</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400">{isFree ? 'Free' : 'Paid'}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasTickets}
                      onChange={() => setHasTickets(!hasTickets)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              {/* Require Approval */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">Require Approval</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={requiresApproval}
                    onChange={() => setRequiresApproval(!requiresApproval)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Capacity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">Capacity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400">{capacity}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasCapacity}
                      onChange={() => setHasCapacity(!hasCapacity)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button 
              className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 text-base"
              disabled={!eventName.trim()}
            >
              Create Event
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}