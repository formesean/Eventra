"use client";

import {
  PencilIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Button } from "~/components/ui/button";
import EventBanner from "~/app/_components/event-banner";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState, use } from "react";
import ShareEvent from "~/app/_components/share-event";
import RegistrationModal from "~/app/_components/registration-modal";
import { useRouter } from "next/navigation";
import { StatusSelect } from "~/app/_components/status-select";

interface Event {
  id: string;
  name: string;
  description: string;
  organizer: string;
  startDate: string;
  startTime: string;
  timezone: string;
  location: string;
  bannerUrl?: string;
  userId: number;
  goingCount: number;
  attendees: number;
}

export default function ViewEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistrationChecked, setIsRegistrationChecked] = useState(false);
  const [userStatus, setUserStatus] = useState<"going" | "maybe" | "not-going">(
    "going"
  );
  const { data: session } = useSession();
  const resolvedParams = use(params);
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/event?id=${resolvedParams.id}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch event data");
        }
        const events = await res.json();
        const eventData = Array.isArray(events) ? events[0] : events;
        if (!eventData) {
          throw new Error("Event not found");
        }
        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchEvent();
  }, [resolvedParams.id]);

  useEffect(() => {
    const checkHostStatus = async () => {
      if (session && event) {
        try {
          const response = await fetch(`/api/user?id=${event.userId}`);
          const data = await response.json();
          const organizerEmail = data[0].email;
          const sessionEmail = session.user?.email;
          setIsHost(sessionEmail === organizerEmail);
        } catch (err) {
          console.error("Error checking host status:", err);
        }
      }
    };

    checkHostStatus();
  }, [session, event]);

  useEffect(() => {
    const fetchUserId = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/user?email=${session.user.email}`);
          const data = await response.json();
          if (data && data[0]) {
            setUserId(data[0].id);
            // Check if user is registered for this event
            const registrationResponse = await fetch(
              `/api/register?userId=${data[0].id}&eventId=${resolvedParams.id}`
            );
            const registrationData = await registrationResponse.json();
            setIsRegistered(registrationData.isRegistered);
            if (registrationData.registration) {
              setUserStatus(registrationData.registration.status || "going");
            }
          }
        } catch (err) {
          console.error("Error fetching user ID:", err);
        } finally {
          setIsRegistrationChecked(true);
        }
      } else {
        setIsRegistrationChecked(true);
      }
    };

    fetchUserId();
  }, [session, resolvedParams.id]);

  const handleStatusChange = async (
    newStatus: "going" | "maybe" | "not-going"
  ) => {
    if (!userId || !session) return;

    try {
      const response = await fetch("/api/register/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          eventId: resolvedParams.id,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setUserStatus(newStatus);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!event || !isRegistrationChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Banner Skeleton */}
          <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl bg-gray-800/50 h-64 animate-pulse" />

          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Title Skeleton */}
              <div className="space-y-3">
                <div className="h-10 bg-gray-800/50 rounded-lg w-3/4 animate-pulse" />
                <div className="h-6 bg-gray-800/50 rounded-lg w-1/2 animate-pulse" />
              </div>

              {/* Info Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-700/50 rounded-lg w-10 h-10 animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-700/50 rounded w-1/4 animate-pulse" />
                        <div className="h-5 bg-gray-700/50 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-gray-700/50 rounded w-1/2 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description Skeleton */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="h-6 bg-gray-700/50 rounded w-1/4 mb-4 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700/50 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-700/50 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-700/50 rounded w-4/6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl px-6 py-9 border border-gray-700">
                <div className="text-center mb-6">
                  <div className="h-8 bg-gray-700/50 rounded w-1/3 mx-auto mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-700/50 rounded w-2/3 mx-auto animate-pulse" />
                </div>
                <div className="h-12 bg-gray-700/50 rounded-xl w-full animate-pulse" />
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="h-4 bg-gray-700/50 rounded w-1/4 ml-auto animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
      {!event ? (
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Banner Skeleton */}
          <div className="relative h-40 mb-8 rounded-2xl overflow-hidden shadow-2xl bg-gray-800/50 animate-pulse" />

          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Title Skeleton */}
              <div className="space-y-3">
                <div className="h-10 bg-gray-800/50 rounded-lg w-3/4 animate-pulse" />
                <div className="h-6 bg-gray-800/50 rounded-lg w-1/2 animate-pulse" />
              </div>

              {/* Info Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-700/50 rounded-lg w-10 h-10 animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-700/50 rounded w-1/4 animate-pulse" />
                        <div className="h-5 bg-gray-700/50 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-gray-700/50 rounded w-1/2 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description Skeleton */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="h-6 bg-gray-700/50 rounded w-1/4 mb-4 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700/50 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-700/50 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-700/50 rounded w-4/6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl px-6 py-9 border border-gray-700">
                <div className="text-center mb-6">
                  <div className="h-8 bg-gray-700/50 rounded w-1/3 mx-auto mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-700/50 rounded w-2/3 mx-auto animate-pulse" />
                </div>
                <div className="h-12 bg-gray-700/50 rounded-xl w-full animate-pulse" />
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="h-4 bg-gray-700/50 rounded w-1/4 ml-auto animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-4 py-7">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/event")}
                className="hover:cursor-pointer text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Events
              </Button>
            </div>

            <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
              <EventBanner
                initialBanner={event.bannerUrl || "/stock-banner-1.jpg"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Event Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-3">
                    {event.name}
                  </h1>
                  <p className="text-lg text-gray-300">
                    Hosted by{" "}
                    <span className="text-indigo-400 font-medium">
                      {event.organizer}
                    </span>
                  </p>
                </div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <CalendarIcon className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Date & Time</p>
                        <p className="text-white font-medium">
                          {new Date(event.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-300">
                          {event.startTime} {event.timezone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <MapPinIcon className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-white font-medium">
                          {event.location}
                        </p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            event.location
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer underline"
                        >
                          View on map
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    About
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Host Actions */}
                {isHost && (
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Manage
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white hover:cursor-pointer justify-start"
                        onClick={() => {
                          router.push(
                            `/event/${
                              event.id
                            }/manage?eventData=${encodeURIComponent(
                              JSON.stringify(event)
                            )}`
                          );
                        }}
                      >
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        Check In Guests
                      </Button>
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white hover:cursor-pointer justify-start"
                        onClick={() => {
                          router.push(`/create?edit=${event.id}`);
                        }}
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit Event Details
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Registration Card */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 sticky top-8">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-white mb-1">
                      Free
                    </div>
                    <p className="text-gray-400 text-sm">
                      Registration required
                    </p>
                  </div>

                  {isRegistered && (
                    <div className="mb-4 flex justify-center">
                      <StatusSelect
                        currentStatus={userStatus}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                  )}

                  <Button
                    onClick={() =>
                      session
                        ? setIsRegistrationOpen(true)
                        : signIn("google", {
                            callbackUrl: `/event/${resolvedParams.id}`,
                          })
                    }
                    disabled={isRegistered}
                    className={`w-full text-lg py-3 rounded-xl font-semibold ${
                      isRegistered
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed opacity-50"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white hover:cursor-pointer"
                    }`}
                  >
                    {session
                      ? isRegistered
                        ? "Already Registered"
                        : "Register"
                      : "Sign In"}
                  </Button>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {event.goingCount} going
                      </span>
                      <span className="text-gray-400">
                        {event.attendees} interested
                      </span>
                    </div>
                  </div>
                </div>

                {/* Share */}
                <ShareEvent
                  eventId={event.id}
                  eventName={event.name}
                  eventDescription={event.description}
                  organizer={event.organizer}
                />
              </div>
            </div>
          </div>

          {/* Registration Modal */}
          <RegistrationModal
            isOpen={isRegistrationOpen}
            onClose={() => setIsRegistrationOpen(false)}
            eventName={event.name}
            eventId={event.id}
            userId={userId ?? 0}
          />
        </>
      )}
    </div>
  );
}
