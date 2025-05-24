"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import Login from "../_components/login";

export default function EventPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("upcoming");
  const notificationsRef = useRef(null);
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
          const now = new Date();
          const upcoming = [];
          const past = [];

          data.forEach((event) => {
            const startDate = new Date(event.startDate);
            const endDate = event.endDate ? new Date(event.endDate) : null;
            const isUpcoming = endDate ? endDate >= now : startDate >= now;
            const mapped = {
              id: event.id,
              title: event.name,
              date: startDate.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              day: startDate.toLocaleDateString(undefined, { weekday: "long" }),
              time: event.startTime || "",
              organizer: event.organizer || "",
              location: event.location || "",
              attendees: event.attendees || 0,
              description: event.description || "",
            };
            isUpcoming ? upcoming.push(mapped) : past.push(mapped);
          });

          setEvents({ upcoming, past });
        }
      } catch {
        setEvents({ upcoming: [], past: [] });
      } finally {
        setLoading(false);
      }
    }

    if (session) fetchEvents();
  }, [session]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target) &&
        !e.target.closest(".bell-icon")
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) return null;

  const EventCard = ({ event }) => (
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300">
      <CardHeader>
        <div className="text-gray-400 mb-1">
          <span className="font-medium">{event.date}</span> · {event.day}
        </div>
        <div className="text-gray-400 text-sm mb-2">{event.time}</div>
        <CardTitle className="text-white">{event.title}</CardTitle>
        <CardDescription className="text-gray-400 mt-1">
          By {event.organizer} <br /> {event.location}
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

  const EmptyState = ({ type }) => (
    <Card className="bg-gray-800 border-gray-700 text-center">
      <CardContent className="py-8">
        <div className="mx-auto w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg
            className="text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
      {/* Navigation */}
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

            <Login />
          </div>
        </div>
      </nav>

      {/* Main Content */}
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
                  hover:text-white transition-colors duration-200 hover:cursor-pointer
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
                  hover:text-white transition-colors duration-200 hover:cursor-pointer
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
