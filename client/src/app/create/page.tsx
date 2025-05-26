"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  MapPinIcon,
  TicketIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "../../components/ui/datetime-picker";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";
import EventBanner from "../_components/event-banner";
import { sendEmail } from "../../lib/sendEmail";

export default function CreateEventPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const currentDate = new Date();
  const searchParams = new URLSearchParams(window.location.search);
  const editEventId = searchParams.get("edit");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
  const [selectedBanner, setSelectedBanner] = useState("/stock-banner-1.jpg");

  useEffect(() => {
    if (editEventId) {
      setIsEditing(true);
      fetchEventData(editEventId);
    }
  }, [editEventId]);

  const fetchEventData = async (eventId: string) => {
    try {
      const res = await fetch(`/api/event?id=${eventId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch event data");
      }
      const eventData = await res.json();
      const event = Array.isArray(eventData) ? eventData[0] : eventData;

      if (event) {
        setEventName(event.name);
        setDescription(event.description || "");
        setStartDate(new Date(event.startDate));
        setEndDate(new Date(event.endDate));
        setStartTime(event.startTime);
        setEndTime(event.endTime);
        setTimezone(event.timezone || "GMT+08:00 Manila");
        setLocation(event.location || "");
        setOrganizer(event.organizer);
        setAttendees(event.attendees);
        setHasTickets(event.hasTickets || false);
        setRequiresApproval(event.requiresApproval || false);
        setHasCapacity(event.hasCapacity || false);
        setIsFree(event.isFree ?? true);
        setCapacity(event.capacity || "Unlimited");
        setSelectedBanner(event.bannerUrl || "/stock-banner-1.jpg");
      }
    } catch (err) {
      console.error("Error fetching event data:", err);
      toast.error("Failed to load event data");
    }
  };

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const email = session.user?.email;
        const response = await fetch(`/api/user?email=${email}`);
        const data = await response.json();
        if (data && data[0]) {
          setUserId(data[0].id);
          setOrganizer(data[0].name);
        } else {
          console.error("No user data found for email:", email);
        }
      }
    }

    fetchUser();
  }, [session]);

  useEffect(() => {
    if (endDate <= startDate) {
      setEndDate(new Date(startDate.getTime() + 60 * 60 * 1000));
    }
  }, [startDate]);

  const handleStartDateTimeChange = (date: Date) => {
    setStartDate(date);
    setStartTime(
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const handleEndDateTimeChange = (date: Date) => {
    setEndDate(date);
    setEndTime(
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
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
      selectedBanner,
    };

    try {
      const url = isEditing ? `/api/event?id=${editEventId}` : "/api/event";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      if (res.ok) {
        const successMessage = isEditing
          ? "Event updated successfully!"
          : "Event created successfully!";
        setMessage(successMessage as any);
        toast.success(successMessage);

        const eventId = data.event_id || editEventId;
        if (!eventId) {
          console.error("No event ID received from server");
          toast.error("Failed to get event ID");
          return;
        }

        // Send confirmation email to organizer
        try {
          await sendEmail(
            `${eventName} ${isEditing ? "Updated" : "Created"}`,
            organizer,
            `
              Your event has been ${
                isEditing ? "updated" : "created"
              } successfully!

              Event Details:
              Name: ${eventName}
              Description: ${description}
              Start Date: ${startDate.toLocaleDateString()}
              Start Time: ${startTime}
              End Date: ${endDate.toLocaleDateString()}
              End Time: ${endTime}
              Location: ${location}
              Timezone: ${timezone}
              Capacity: ${capacity}
              Requires Approval: ${requiresApproval ? "Yes" : "No"}
              Has Tickets: ${hasTickets ? "Yes" : "No"}
              Is Free: ${isFree ? "Yes" : "No"}

              You can view your event at: http://localhost:3000/event/${eventId}?id=${eventId}
            `,
            session?.user?.email || ""
          );
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
        }

        setTimeout(() => {
          router.push(
            isEditing ? `/event/${editEventId}` : `/event/${eventId}`
          );
        }, 2000);
      } else {
        const errorMessage = isEditing
          ? "Failed to update event"
          : "Failed to create event";
        const errorDetails = data.error || JSON.stringify(data);
        setMessage(`${errorMessage}: ${errorDetails}` as any);
        toast.error(`${errorMessage}: ${errorDetails}`);
        console.error("Error response:", data);
      }
    } catch (error: unknown) {
      console.error("Request error:", error);
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}` as any);
        toast.error(`Error: ${error.message}`);
      } else {
        setMessage("An unknown error occurred" as any);
        toast.error("An unknown error occurred");
      }
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
              href={isEditing ? `/event/${editEventId}` : "/event"}
              className="text-gray-300 hover:text-white text-sm font-medium flex items-center"
            >
              Cancel
            </Link>
            <Button
              className="bg-white text-gray-900 hover:bg-gray-300 hover:cursor-pointer"
              disabled={!eventName.trim() || loading}
              onClick={handleCreateEvent}
            >
              {loading
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                ? "Save Event"
                : "Create Event"}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center gap-20">
        <Card className="bg-gray-800 border-gray-700 w-full">
          <CardContent>
            <EventBanner
              initialBanner={selectedBanner}
              onBannerChange={setSelectedBanner}
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 w-full">
          <CardContent className="space-y-2">
            <div className="space-y-2">
              {/* Event Name */}
              <div className="space-y-2">
                <h2 className="text-white text-lg font-medium">Name</h2>
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
                <h2 className="text-white text-lg font-medium">Date & Time</h2>
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
                <h2 className="text-white text-lg font-medium">Location</h2>
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
                <h2 className="text-white text-lg font-medium">Description</h2>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell attendees what your event is about"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              {/* Event Options */}
              <div className="space-y-4">
                <h2 className="text-white text-lg font-medium">Options</h2>
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
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
