// app/events/[id]/page.js
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import {
  ShareIcon,
  PencilIcon,
  PhotoIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function ViewEventPage() {
  const event = {
    id: 'z4fkvqrs',
    title: 'Test Event',
    host: 'Brodie',
    date: 'Wednesday, May 31',
    time: '7:00 PM - 9:00 PM',
    timezone: 'CDT',
    location: 'Talamban, Cebu City, Philippines',
    description: 'Hello! To join the event, please register below.',
    isHost: true
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      <div className="max-w-5xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel: Event Card */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src="/event-banner.jpg"
              alt="Event banner with balloons"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <p className="text-xs text-gray-400">Eventra/{event.id}</p>
            <h2 className="text-3xl font-bold mt-2 text-white">{event.title}</h2>
            <p className="text-sm text-gray-300 mt-1">Hosted by {event.host}</p>

            <div className="mt-4 space-y-1 text-sm text-gray-300">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-indigo-400 mr-2" />
                {event.date}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-indigo-400 mr-2" />
                {event.time} {event.timezone}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 text-indigo-400 mr-2" />
                {event.location}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-white">Registration</h3>
              <p className="text-sm text-gray-400 mb-4">{event.description}</p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Register
              </Button>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between text-sm bg-gray-900">
            <span className="text-gray-400">Share Event</span>
            <button><ShareIcon className="h-5 w-5 text-gray-400" /></button>
          </div>
        </div>

        {/* Right Panel: When & Where */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6 text-white">When & Where</h3>

          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 text-indigo-400 mr-3 mt-1" />
              <div>
                <p className="text-white font-medium">{event.date}</p>
                <p>{event.time} {event.timezone}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 text-indigo-400 mr-3 mt-1" />
              <div>
                <p className="text-white font-medium">{event.location}</p>
                <p>The address is shown publicly on the event page.</p>
              </div>
            </div>
          </div>

          {event.isHost && (
            <Button className="w-full mt-6 bg-gray-700 text-white-100 hover:bg-gray-600">
              Check In Guests
            </Button>
          )}
        </div>
      </div>

      {/* Management Buttons */}
      {event.isHost && (
        <div className="max-w-5xl mx-auto mt-8 px-4 grid grid-cols-2 gap-4">
          <Button className="bg-gray-800 text-white-100 hover:bg-gray-700">
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit Event
          </Button>
          <Button className="bg-gray-800 text-white-100 hover:bg-gray-700">
            <PhotoIcon className="h-5 w-5 mr-2" />
            Change Photo
          </Button>
        </div>
      )}
    </div>
  );
}
