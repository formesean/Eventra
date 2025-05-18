"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import {
  BellIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Login from "../_components/login";

export default function EventPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // State for active tab selection
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  // New state for events and loading
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session === null) {
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch("/api/event");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Split events into upcoming and past
          const now = new Date();
          const upcoming = [];
          const past = [];
          data.forEach((event) => {
            // Use endDate if available, otherwise startDate
            const eventDate = new Date(event.endDate || event.startDate);
            const startDate = new Date(event.startDate);
            const endDate = event.endDate ? new Date(event.endDate) : null;
            // Map API fields to EventCard fields
            const mapped = {
              id: event.id,
              title: event.name,
              date: event.startDate
                ? new Date(event.startDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "",
              day: event.startDate
                ? new Date(event.startDate).toLocaleDateString(undefined, {
                    weekday: "long",
                  })
                : "",
              time: event.startTime || "",
              organizer: event.organizer || "",
              location: event.location || "",
              attendees: event.attendees || 0,
              description: event.description || "",
            };
            // If event is in the future or today, it's upcoming
            if (endDate ? endDate >= now : startDate >= now) {
              upcoming.push(mapped);
            } else {
              past.push(mapped);
            }
          });
          setEvents({ upcoming, past });
        }
      } catch (e) {
        setEvents({ upcoming: [], past: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [session]);

  if (session === null) return null;

  // Sample notification data
  const notifications = [
    {
      id: 1,
      title: "New event invitation",
      message: 'You have been invited to "Tech Conference 2023"',
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Event reminder",
      message: 'Your event "Team Meeting" starts in 30 minutes',
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      title: "New message",
      message: "You have 3 new messages in the event chat",
      time: "3 days ago",
      read: true,
    },
  ];

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        // Check if the click was not on the bell icon
        if (!event.target.closest(".bell-icon")) {
          setShowNotifications(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reusable Event Card Component
  const EventCard = ({ event }) => (
    <Card className="bg-gray-800 border-gray-700 transition-all duration-300 hover:border-gray-600">
      <CardHeader>
        <div className="text-gray-400 mb-1">
          <span className="font-medium">{event.date}</span> · {event.day}
        </div>
        <div className="text-gray-400 text-sm mb-2">{event.time}</div>
        <CardTitle className="text-white">{event.title}</CardTitle>
        <CardDescription className="text-gray-400 mt-1">
          By {event.organizer}
          <br />
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
  );

  // Empty State Component
  const EmptyState = ({ type }) => (
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
          No {type === "upcoming" ? "Upcoming" : "Past"} Events
        </CardTitle>
        <p className="text-gray-400 mb-4">
          {type === "upcoming"
            ? "You have no upcoming events. Why not host one?"
            : "No past events to display"}
        </p>
        {type === "upcoming" && (
          <Link
            href="/create_page"
            className="inline-flex items-center px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-medium hover:bg-gray-100"
          >
            Create Event
          </Link>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="bg-transparent px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center max-w-7xl mx-auto">
          <Link href="/" className="text-xl font-bold text-white">
            Eventra
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center space-x-6">
            <Link
              href="/create_page"
              className="text-gray-300 hover:text-white text-sm font-medium flex items-center"
            >
              Create New
            </Link>

            {/* Notification Button and Popup */}
            <div className="relative" ref={notificationsRef}>
              <button
                className="text-gray-300 hover:text-white bell-icon"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <BellIcon className="h-5 w-5" />
                {/* Notification badge */}
                {notifications.some((n) => !n.read) && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>

              {/* Notification Popup */}
              {showNotifications && (
                <>
                  {/* Blur backdrop */}
                  <div className="fixed inset-0 bg-transparent bg-opacity-30  z-40"></div>

                  {/* Popup content */}
                  <div className="fixed right-4 sm:right-8 top-20 z-50 w-80 bg-gray-800 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="font-medium text-white">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors ${
                              !notification.read ? "bg-gray-700/30" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-white">
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-400">
                                {notification.time}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300 mt-1">
                              {notification.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-400">
                          No new notifications
                        </div>
                      )}
                    </div>

                    <div className="p-3 border-t border-gray-700 text-center">
                      <button className="text-sm text-blue-400 hover:text-blue-300">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Login />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-6">Events</h1>

          {/* Enhanced Toggle Slider */}
          <div className="relative mb-8">
            <ToggleGroup
              type="single"
              value={activeTab}
              onValueChange={(value) => value && setActiveTab(value)}
              className="relative bg-gray-800/50 p-1 text-white rounded-lg w-67 h-10 border border-gray-700"
            >
              {/* Transparent Gray Slider */}
              <div
                className={`
                absolute top-1 left-1 h-8 bg-gray-700/30 rounded-md
                transition-all duration-300 ease-out
                ${
                  activeTab === "upcoming"
                    ? "translate-x-0 w-32"
                    : "translate-x-[8rem] w-32"
                }
              `}
              />

              <ToggleGroupItem
                value="upcoming"
                className={`
                  relative z-10 w-32 h-8 rounded-md
                  ${activeTab === "upcoming" ? "text-white" : "text-gray-400"}
                  bg-transparent border-0 hover:bg-transparent
                  data-[state=on]:bg-transparent
                  data-[state=on]:text-white
                  data-[state=off]:bg-transparent
                  hover:text-white transition-colors duration-200
                `}
              >
                Upcoming
              </ToggleGroupItem>

              <ToggleGroupItem
                value="past"
                className={`
                  relative z-10 w-32 h-8 rounded-md
                  ${activeTab === "past" ? "text-white" : "text-gray-400"}
                  bg-transparent border-0 hover:bg-transparent
                  data-[state=on]:bg-transparent
                  data-[state=on]:text-white
                  data-[state=off]:bg-transparent
                  hover:text-white transition-colors duration-200
                `}
              >
                Past
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Events List with Smooth Transitions */}
          <div className="relative min-h-[400px]">
            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="text-gray-400">Loading events...</span>
              </div>
            ) : (
              <>
                {/* Upcoming Events */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    activeTab === "upcoming"
                      ? "opacity-100"
                      : "opacity-0 absolute"
                  }`}
                >
                  {events.upcoming.length > 0 ? (
                    <div className="space-y-4">
                      {events.upcoming.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState type="upcoming" />
                  )}
                </div>

                {/* Past Events */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    activeTab === "past" ? "opacity-100" : "opacity-0 absolute"
                  }`}
                >
                  {events.past.length > 0 ? (
                    <div className="space-y-4">
                      {events.past.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState type="past" />
                  )}
                </div>
              </>
            )}
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
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
