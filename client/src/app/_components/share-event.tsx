"use client";

import { useState } from "react";
import {
  ShareIcon,
  XMarkIcon,
  ClipboardIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Button } from "~/components/ui/button";

interface ShareEventProps {
  eventId: string;
  eventName: string;
  eventDescription: string;
  organizer: string;
}

export default function ShareEvent({
  eventId,
  eventName,
  eventDescription,
  organizer,
}: ShareEventProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const eventUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/event/${eventId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      color: "bg-blue-600 hover:bg-blue-700",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Check out this event: ${eventName}`
      )}&url=${encodeURIComponent(eventUrl)}`,
    },
    {
      name: "Facebook",
      color: "bg-blue-800 hover:bg-blue-900",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        eventUrl
      )}`,
    },
    {
      name: "LinkedIn",
      color: "bg-blue-700 hover:bg-blue-800",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        eventUrl
      )}`,
    },
    {
      name: "WhatsApp",
      color: "bg-green-600 hover:bg-green-700",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(
        `Check out this event: ${eventName} ${eventUrl}`
      )}`,
    },
    {
      name: "Email",
      color: "bg-gray-600 hover:bg-gray-700",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      url: `mailto:?subject=${encodeURIComponent(
        `Event: ${eventName}`
      )}&body=${encodeURIComponent(
        `I thought you might be interested in this event:\n\n${eventName}\nHosted by ${organizer}\n\n${eventDescription}\n\nView event: ${eventUrl}`
      )}`,
    },
  ];

  return (
    <>
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Share Event</h3>

        {/* Copy Link */}
        <div className="mb-4 w-full">
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={eventUrl}
              readOnly
              className="w-full flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 truncate"
            />
            <Button
              size="sm"
              onClick={handleCopyLink}
              className={`h-9 w-9 p-0 transition-colors flex-shrink-0 hover:cursor-pointer ${
                copySuccess
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white`}
            >
              {copySuccess ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <ClipboardIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Share Button */}
        <Button
          onClick={() => setIsPopupOpen(true)}
          className="hover:cursor-pointer w-full h-9 bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center gap-2"
        >
          <ShareIcon className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>

      {/* Share Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Share Event</h3>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors hover:cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Event Info */}
            <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
              <h4 className="font-medium text-white mb-1">{eventName}</h4>
              <p className="text-sm text-gray-400">Hosted by {organizer}</p>
            </div>

            {/* Social Media Options */}
            <div className="space-y-3">
              <p className="text-sm text-gray-400 mb-3">Choose a platform</p>
              <div className="grid grid-cols-1 gap-2">
                {shareLinks.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsPopupOpen(false)}
                    className={`flex items-center space-x-3 ${platform.color} text-white rounded-lg py-3 px-4 transition-colors`}
                  >
                    {platform.icon}
                    <span>Share on {platform.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-3">QR Code</p>
                <div className="bg-white p-3 rounded-lg inline-block">
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                    <svg
                      className="h-12 w-12 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Scan to view event</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
