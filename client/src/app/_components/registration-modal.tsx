"use client";

import type React from "react";

import { useState } from "react";
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Button } from "~/components/ui/button";
import { sendEmail } from "~/lib/sendEmail";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  eventId: string;
  userId: number;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  eventName,
  eventId,
  userId,
}: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          eventId,
          fullName: formData.fullName,
          email: formData.email,
          ...(formData.contactNumber && {
            contactNumber: formData.contactNumber,
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Fetch event details to get organizer's email
      const eventResponse = await fetch(`/api/event?id=${eventId}`);
      const eventData = await eventResponse.json();
      const event = Array.isArray(eventData) ? eventData[0] : eventData;

      // Fetch organizer's email
      const organizerResponse = await fetch(`/api/user?id=${event.userId}`);
      const organizerData = await organizerResponse.json();
      const organizerEmail = organizerData[0].email;

      // Send email to organizer
      try {
        await sendEmail(
          `New Registration for ${eventName}`,
          event.organizer,
          `
            A new registration has been received for your event!

            Registrant Details:
            Name: ${formData.fullName}
            Email: ${formData.email}
            ${
              formData.contactNumber
                ? `Contact Number: ${formData.contactNumber}`
                : ""
            }

            Event Details:
            Name: ${eventName}
            Date: ${new Date(event.startDate).toLocaleDateString()}
            Time: ${event.startTime}
            Location: ${event.location}

            You can manage registrations at: http://localhost:3000/event/${eventId}/manage
          `,
          organizerEmail
        );
      } catch (emailError) {
        console.error("Error sending email to organizer:", emailError);
      }

      // Send confirmation email to registrant
      try {
        await sendEmail(
          `Registration Confirmation for ${eventName}`,
          formData.fullName,
          `
            Thank you for registering for ${eventName}!

            Your Registration Details:
            Name: ${formData.fullName}
            Email: ${formData.email}
            ${
              formData.contactNumber
                ? `Contact Number: ${formData.contactNumber}`
                : ""
            }

            Event Details:
            Name: ${eventName}
            Date: ${new Date(event.startDate).toLocaleDateString()}
            Time: ${event.startTime}
            Location: ${event.location}
            Organizer: ${event.organizer}

            You can view the event at: http://localhost:3000/event/${eventId}
          `,
          formData.email
        );
      } catch (emailError) {
        console.error(
          "Error sending confirmation email to registrant:",
          emailError
        );
      }

      setIsSuccess(true);

      setTimeout(() => {
        setFormData({ fullName: "", email: "", contactNumber: "" });
        setIsSuccess(false);
        onClose();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            Register for Event
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors hover:cursor-pointer"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Event Info */}
        <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
          <h4 className="font-medium text-white mb-1">{eventName}</h4>
          <p className="text-sm text-gray-400">
            You're registering for this event
          </p>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Registration Successful!
            </h4>
            <p className="text-gray-400 text-sm">
              You'll receive a confirmation email shortly.
            </p>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className={`w-full pl-10 pr-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.fullName ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Contact Number <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    handleInputChange("contactNumber", e.target.value)
                  }
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your contact number"
                />
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-400">{errors.submit}</p>
              </div>
            )}

            {/* Privacy Notice */}
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-xs text-gray-400">
                By registering, you agree to receive event updates and
                communications. Your information will be kept secure and not
                shared with third parties.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Confirming...</span>
                  </div>
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
