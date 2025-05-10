// app/page.js
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '../../components/ui/toggle-group';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';

export default function Home() {
  const [eventType, setEventType] = useState('upcoming');
  
  // Sample event data matching your reference image
  const events = {
    upcoming: [
      {
        id: 1,
        title: '[CPEC] Tulay Midterms Tutorials (1st Semester)',
        date: 'Oct 14, 2023',
        day: 'Saturday',
        time: '1:00 PM',
        organizer: 'Zach Riane Machacon',
        location: 'University of San Carlos - Talamban Campus',
        attendees: 44,
        description: 'Midterm exam preparation session'
      }
    ],
    past: [
      {
        id: 2,
        title: 'Summer Networking Mixer',
        date: 'Jul 20, 2023',
        day: 'Thursday',
        time: '6:00 PM',
        organizer: 'Tech Community',
        location: 'Virtual Event',
        attendees: 32,
        description: 'Networking event for professionals'
      }
    ]
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="bg-transparent px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center max-w-7xl mx-auto">
          <Link href="/" className="text-xl font-bold text-white">Eventra</Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-gray-300 hover:text-white text-sm">What's New</Link>
            <Link href="#" className="text-gray-300 hover:text-white text-sm">Discover</Link>
            <Link href="#" className="text-gray-300 hover:text-white text-sm">Pricing</Link>
            <Link href="#" className="text-gray-300 hover:text-white text-sm">Help</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-300 hover:text-white text-sm">Log in</Link>
            <Link href="/signup" className="bg-white text-gray-900 px-4 py-2 rounded text-sm hover:bg-gray-100">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-6">Events</h1>
          
          {/* Custom Toggle Slider */}
          <div className="relative mb-8">
            <ToggleGroup 
              type="single" 
              value={eventType}
              onValueChange={(value) => value && setEventType(value)}
              className="bg-gray-800 p-1  w-64"
            >
              <ToggleGroupItem 
                value="upcoming" 
                className="data-[state=on]:bg-gray-700 data-[state=on]:text-white w-32 transition-all duration-300"
              >
                Upcoming
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="past" 
                className="data-[state=on]:bg-gray-700 data-[state=on]:text-white w-32 transition-all duration-300"
              >
                Past
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Events List with Transition */}
          <div className="relative">
            <div className={`transition-opacity duration-300 ${eventType === 'upcoming' ? 'opacity-100' : 'opacity-0 absolute'}`}>
              {events.upcoming.length > 0 ? (
                <div className="space-y-4">
                  {events.upcoming.map(event => (
                    <Card key={event.id} className="bg-gray-800 border-gray-700 transition-all duration-300">
                      <CardHeader>
                        <div className="text-gray-400 mb-1">
                          <span className="font-medium">{event.date}</span> · {event.day}
                        </div>
                        <div className="text-gray-400 text-sm mb-2">
                          {event.time}
                        </div>
                        <CardTitle className="text-white">{event.title}</CardTitle>
                        <CardDescription className="text-gray-400 mt-1">
                          By {event.organizer}<br />
                          {event.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-3">{event.description}</p>
                        <div className="flex items-center text-gray-400 text-sm">
                          <span className="font-medium text-white">Going</span>
                          <span className="ml-2">+{event.attendees}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-800 border-gray-700 text-center">
                  <CardContent className="py-8">
                    <div className="mx-auto w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="text-gray-500"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <CardTitle className="text-white mb-2">
                      No Upcoming Events
                    </CardTitle>
                    <p className="text-gray-400 mb-4">
                      You have no upcoming events. Why not host one?
                    </p>
                    <Link
                      href="/events/create"
                      className="inline-flex items-center px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-medium hover:bg-gray-100"
                    >
                      Create Event
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className={`transition-opacity duration-300 ${eventType === 'past' ? 'opacity-100' : 'opacity-0 absolute'}`}>
              {events.past.length > 0 ? (
                <div className="space-y-4">
                  {events.past.map(event => (
                    <Card key={event.id} className="bg-gray-800 border-gray-700 transition-all duration-300">
                      {/* Same card structure as upcoming events */}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-800 border-gray-700 text-center">
                  <CardContent className="py-8">
                    <div className="mx-auto w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      {/* Calendar icon SVG */}
                    </div>
                    <CardTitle className="text-white mb-2">
                      No Past Events
                    </CardTitle>
                    <p className="text-gray-400 mb-4">
                      No past events to display
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Eventra. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm">Terms</Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">Privacy</Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}