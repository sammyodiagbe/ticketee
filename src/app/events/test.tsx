"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  createEvent,
  uploadEventImage,
  getEvents,
  updateEvent,
  deleteEvent,
} from "@/lib/events";
import { Event } from "@/types/events";
import { useRouter } from "next/navigation";

export default function EventTest() {
  const [result, setResult] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/sign-in?redirect=/events/test");
      }
      setIsLoading(false);
    };

    checkSession();
  }, [supabase, router]);

  const handleCreateEvent = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setResult("Error: You must be logged in to create events");
        router.push("/auth/sign-in?redirect=/events/test");
        return;
      }

      const newEvent = await createEvent({
        title: "Test Event " + new Date().toISOString(),
        description: "This is a test event",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
        location: "Test Location",
        is_published: true,
      });
      setResult(
        `Event created successfully: ${JSON.stringify(newEvent, null, 2)}`
      );
    } catch (error: any) {
      setResult(
        `Error creating event: ${error?.message || "Unknown error occurred"}`
      );
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setResult("Error: You must be logged in to upload files");
          router.push("/auth/sign-in?redirect=/events/test");
          return;
        }

        const url = await uploadEventImage(file);
        setResult(`File uploaded successfully. URL: ${url}`);
      } catch (error: any) {
        setResult(
          `Error uploading file: ${error?.message || "Unknown error occurred"}`
        );
      }
    }
  };

  const handleListEvents = async () => {
    try {
      const eventsList = await getEvents(false); // false to get all events, including unpublished
      setEvents(eventsList);
      setResult(`Found ${eventsList.length} events`);
    } catch (error: any) {
      setResult(
        `Error listing events: ${error?.message || "Unknown error occurred"}`
      );
    }
  };

  const handleUpdateLastEvent = async () => {
    if (events.length === 0) {
      setResult("No events to update. Please list events first.");
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setResult("Error: You must be logged in to update events");
        router.push("/auth/sign-in?redirect=/events/test");
        return;
      }

      const lastEvent = events[0];
      const updatedEvent = await updateEvent(lastEvent.id, {
        title: `Updated: ${lastEvent.title}`,
        description: "This event was updated through the test interface",
      });
      setResult(
        `Event updated successfully: ${JSON.stringify(updatedEvent, null, 2)}`
      );
    } catch (error: any) {
      setResult(
        `Error updating event: ${error?.message || "Unknown error occurred"}`
      );
    }
  };

  const handleDeleteLastEvent = async () => {
    if (events.length === 0) {
      setResult("No events to delete. Please list events first.");
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setResult("Error: You must be logged in to delete events");
        router.push("/auth/sign-in?redirect=/events/test");
        return;
      }

      const lastEvent = events[0];
      await deleteEvent(lastEvent.id);
      setResult(`Event deleted successfully: ${lastEvent.id}`);
      // Refresh the events list
      handleListEvents();
    } catch (error: any) {
      setResult(
        `Error deleting event: ${error?.message || "Unknown error occurred"}`
      );
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Event Functionality Test</h1>

      <div className="space-y-4">
        <div className="space-x-2">
          <button
            onClick={handleCreateEvent}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create Test Event
          </button>

          <button
            onClick={handleListEvents}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            List Events
          </button>

          <button
            onClick={handleUpdateLastEvent}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Update Last Event
          </button>

          <button
            onClick={handleDeleteLastEvent}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Last Event
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
            {result}
          </pre>
        </div>

        {events.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Events List:</h2>
            <div className="space-y-2">
              {events.map((event) => (
                <div key={event.id} className="bg-gray-100 p-4 rounded">
                  <h3 className="font-bold">{event.title}</h3>
                  <p>{event.description}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(event.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
