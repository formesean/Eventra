"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  TicketIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { DateTimePicker } from "../../components/ui/datetime-picker";

export default function CreateEventPage() {
  const { data: session } = useSession();
  const currentDate = new Date();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [userId, setUserId] = useState("");
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [startTime, setStartTime] = useState(
    currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
  const [endTime, setEndTime] = useState(
    new Date(currentDate.getTime() + 60 * 60 * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
  const [timezone, setTimezone] = useState("GMT+08:00 Manila");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [attendees, setAttendees] = useState(0);
  const [hasTickets, setHasTickets] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [hasCapacity, setHasCapacity] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [capacity, setCapacity] = useState("Unlimited");

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const email = session.user.email;
        const response = await fetch(`/api/user?email=${email}`);
        const data = await response.json();
        setUserId(data[0].id);
        setOrganizer(data[0].name);
      }
    }

    fetchUser();
  }, [session]);

  useEffect(() => {
    if (endDate <= startDate) {
      setEndDate(new Date(startDate.getTime() + 60 * 60 * 1000));
    }
  }, [startDate]);

  const handleStartDateTimeChange = (date) => {
    setStartDate(date);
    setStartTime(
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );

    console.log(startDate);
    console.log(startTime);
  };

  const handleEndDateTimeChange = (date) => {
    setEndDate(date);
    setEndTime(
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );

    console.log(endDate);
    console.log(endTime);
  };

  async function handleCreateEvent() {
    setLoading(true);
    setMessage(null);

    const payload = {
      userId,
      eventName,
      description,
      startDate,
      endDate,
      location,
      attendees,
      organizer,
      capacity,
      endTime,
      hasCapacity,
      hasTickets,
      isFree,
      requiresApproval,
      startTime,
      timezone,
    };

    try {
      console.log(payload);

      const res = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Event created successfully!");
      } else {
        setMessage(
          `Failed to create event: ${data.error || JSON.stringify(data)}`
        );
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      {/* Navigation */}
      <nav className="bg-transparent px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="text-xl font-bold text-white">
            Eventra
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/event_page"
              className="text-gray-300 hover:text-white text-sm font-medium flex items-center"
            >
              Cancel
            </Link>
            <Button
              className="bg-white text-gray-900 hover:bg-gray-100"
              disabled={!eventName.trim() || loading}
              onClick={handleCreateEvent}
            >
              {loading ? "Creating..." : "Create Event"}
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
              <h2 className="text-white text-xl font-medium">Date & Time</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-gray-400 text-sm">Start Date & Time</h3>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <DateTimePicker
                      value={startDate}
                      onChange={handleStartDateTimeChange}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-gray-400 text-sm">End Date & Time</h3>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <DateTimePicker
                      value={endDate}
                      onChange={handleEndDateTimeChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <span>{timezone}</span>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <h2 className="text-white text-xl font-medium">
                Add Event Location
              </h2>
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
              <h2 className="text-white text-xl font-medium">
                Add Description
              </h2>
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
                  <span className="text-gray-400">
                    {isFree ? "Free" : "Paid"}
                  </span>
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
                <div
                  className="flex items-center space-x-3
"
                >
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
              </div>{" "}
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

          <CardFooter>
            {message && (
              <p
                className={`${
                  message.startsWith("Event created")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
