"use client";

import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import AuthStatus from "./_components/login";

export default function Home() {
  const { events, loading, error } = useEvents();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    userId: 1, // Default user ID, adjust as needed
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to create event");
      // Optionally, refresh events or clear form
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  if (loading) return <p>Loading events…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4">
      <AuthStatus />
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="block mb-2 p-2 border"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="block mb-2 p-2 border"
        />
        <input
          type="datetime-local"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="block mb-2 p-2 border"
        />
        <input
          type="datetime-local"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="block mb-2 p-2 border"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="block mb-2 p-2 border"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white">
          Create Event
        </button>
      </form>
      <ul className="space-y-3">
        {events.map((e) => (
          <li key={e.event_id} className="p-4 border rounded">
            <h2 className="text-xl">{e.name}</h2>
            <p className="text-sm text-gray-600">
              {new Date(e.start_date).toLocaleString()}
            </p>
            <p>{e.description}</p>
            <p className="italic">{e.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
