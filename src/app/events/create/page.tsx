"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CreateTicketTypeDTO, CreateEventDTO } from "@/types/events";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createEvent, uploadEventImage } from "@/lib/events";
import { createClient } from "@supabase/supabase-js";
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const steps = [
  { id: "basics", name: "Basic Information" },
  { id: "media", name: "Images & Media" },
  { id: "tickets", name: "Tickets" },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

interface CreationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "processing" | "completed" | "error";
}

export default function CreateEventPage() {
  const { user, isLoading } = useSupabaseAuth();
  const router = useRouter();
  const [[currentStep, direction], setCurrentStep] = useState(["basics", 0]);
  const [eventData, setEventData] = useState<Partial<CreateEventDTO>>({
    title: "",
    description: "",
    start_date: "",
    location: "",
    is_published: true,
  });
  const [ticketTypes, setTicketTypes] = useState<
    Partial<CreateTicketTypeDTO>[]
  >([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [creationSteps, setCreationSteps] = useState<CreationStep[]>([
    {
      id: "event",
      title: "Creating Event",
      description: "Setting up your event details",
      status: "pending",
    },
    {
      id: "media",
      title: "Uploading Media",
      description: "Uploading your images and videos",
      status: "pending",
    },
    {
      id: "tickets",
      title: "Creating Tickets",
      description: "Setting up ticket types",
      status: "pending",
    },
  ]);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
    {}
  );
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in?redirect=/events/create");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect due to useEffect
  }

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, {}]);
  };

  const updateTicketType = (
    index: number,
    data: Partial<CreateTicketTypeDTO>
  ) => {
    const newTicketTypes = [...ticketTypes];
    newTicketTypes[index] = { ...newTicketTypes[index], ...data };
    setTicketTypes(newTicketTypes);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const paginate = (newDirection: number) => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const nextIndex = currentIndex + newDirection;

    if (nextIndex >= 0 && nextIndex < steps.length) {
      setCurrentStep([steps[nextIndex].id, newDirection]);
    }
  };

  const updateStepStatus = (stepId: string, status: CreationStep["status"]) => {
    setCreationSteps((steps) =>
      steps.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
  };

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setEventData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateTimeChange = (date: string, time: string) => {
    if (date && time) {
      const dateTime = new Date(`${date}T${time}`).toISOString();
      setEventData((prev) => ({ ...prev, start_date: dateTime }));
    }
  };

  const validateBasicInfo = () => {
    const errors: { [key: string]: string } = {};

    // Title validation
    if (!eventData.title) {
      errors.title = "Event name is required";
    } else if (eventData.title.trim().length < 3) {
      errors.title = "Event name must be at least 3 characters";
    }

    // Date and time validation
    if (!eventData.start_date) {
      errors.date = "Event date and time are required";
    } else {
      const eventDate = new Date(eventData.start_date);
      const now = new Date();
      if (eventDate < now) {
        errors.date = "Event date must be in the future";
      }
    }

    // Location validation (optional but if provided, must be valid)
    if (eventData.location && eventData.location.trim().length < 3) {
      errors.location = "Location must be at least 3 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateTicketTypes = () => {
    const errors: string[] = [];

    ticketTypes.forEach((ticket, index) => {
      if (!ticket.name) {
        errors.push(`Ticket type #${index + 1}: Name is required`);
      }
      if (!ticket.price && ticket.price !== 0) {
        errors.push(`Ticket type #${index + 1}: Price is required`);
      }
      if (ticket.price && ticket.price < 0) {
        errors.push(`Ticket type #${index + 1}: Price cannot be negative`);
      }
      if (ticket.quantity && ticket.quantity < 1) {
        errors.push(`Ticket type #${index + 1}: Quantity must be at least 1`);
      }
      if (ticket.end_sale_date && new Date(ticket.end_sale_date) < new Date()) {
        errors.push(
          `Ticket type #${index + 1}: Sales end date must be in the future`
        );
      }
    });

    return errors;
  };

  const handleCreateEvent = async () => {
    // Reset all errors
    setErrorMessages({});
    setFormErrors({});

    // Validate basic info
    if (!validateBasicInfo()) {
      return;
    }

    // Validate ticket types if any exist
    if (ticketTypes.length > 0) {
      const ticketErrors = validateTicketTypes();
      if (ticketErrors.length > 0) {
        setErrorMessages({
          tickets: ticketErrors.join("\n"),
        });
        return;
      }
    }

    setShowProgress(true);

    try {
      // Step 1: Create Event
      updateStepStatus("event", "processing");
      const event = await createEvent(eventData as CreateEventDTO);
      if (!event) {
        throw new Error("Failed to create event: No response from server");
      }
      updateStepStatus("event", "completed");

      // Step 2: Upload Media
      if (selectedFiles.length > 0) {
        updateStepStatus("media", "processing");
        try {
          const uploadPromises = selectedFiles.map(async (file) => {
            try {
              const url = await uploadEventImage(file);
              if (!url) {
                throw new Error(`Failed to upload ${file.name}`);
              }
              return url;
            } catch (uploadError) {
              const errorMessage =
                uploadError instanceof Error
                  ? uploadError.message
                  : `Failed to upload ${file.name}`;
              throw new Error(errorMessage);
            }
          });

          const mediaUrls = await Promise.all(uploadPromises);

          const { error: updateError } = await supabase
            .from("events")
            .update({
              media_urls: mediaUrls,
              cover_image_url: mediaUrls[0],
            })
            .eq("id", event.id);

          if (updateError) {
            throw new Error(
              `Failed to update event with media: ${updateError.message}`
            );
          }

          updateStepStatus("media", "completed");
        } catch (mediaError) {
          console.error("Media upload failed:", mediaError);
          const errorMessage =
            mediaError instanceof Error
              ? mediaError.message
              : "Failed to upload media files";
          setErrorMessages((prev) => ({
            ...prev,
            media: errorMessage,
          }));
          updateStepStatus("media", "error");
        }
      } else {
        updateStepStatus("media", "completed");
      }

      // Step 3: Create Tickets
      if (ticketTypes.length > 0) {
        updateStepStatus("tickets", "processing");
        try {
          const ticketPromises = ticketTypes.map(async (ticket, index) => {
            try {
              const { data, error: ticketError } = await supabase
                .from("ticket_types")
                .insert([{ ...ticket, event_id: event.id }])
                .select();

              if (ticketError) {
                throw new Error(
                  `Failed to create ticket type #${index + 1}: ${
                    ticketError.message
                  }`
                );
              }
              return data;
            } catch (ticketError) {
              const errorMessage =
                ticketError instanceof Error
                  ? ticketError.message
                  : `Failed to create ticket type #${index + 1}`;
              throw new Error(errorMessage);
            }
          });

          await Promise.all(ticketPromises);
          updateStepStatus("tickets", "completed");
        } catch (ticketError) {
          console.error("Ticket creation failed:", ticketError);
          const errorMessage =
            ticketError instanceof Error
              ? ticketError.message
              : "Failed to create ticket types";
          setErrorMessages((prev) => ({
            ...prev,
            tickets: errorMessage,
          }));
          updateStepStatus("tickets", "error");
        }
      } else {
        updateStepStatus("tickets", "completed");
      }

      // Wait a moment to show completion
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/events/${event.id}`);
    } catch (error) {
      console.error("Event creation failed:", error);
      let errorMessage = "Failed to create event: ";

      if (error instanceof Error) {
        if (error.message.includes("auth")) {
          errorMessage += "You must be signed in to create an event";
        } else if (error.message.includes("required")) {
          errorMessage += "Please fill in all required fields";
        } else if (error.message.includes("duplicate")) {
          errorMessage += "An event with this name already exists";
        } else if (error.message.includes("validation")) {
          errorMessage += "Please check your input values";
        } else {
          errorMessage += error.message;
        }
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage += error.message;
      } else {
        errorMessage += "An unexpected error occurred. Please try again.";
      }

      setErrorMessages((prev) => ({
        ...prev,
        event: errorMessage,
      }));
      updateStepStatus("event", "error");
    }
  };

  return (
    <>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Create New Event</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the details to create your event
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <ul className="steps steps-horizontal w-full">
              {steps.map((step, stepIdx) => (
                <li
                  key={step.id}
                  className={`step ${
                    stepIdx <= steps.findIndex((s) => s.id === currentStep)
                      ? "step-primary"
                      : ""
                  }`}
                  data-content={stepIdx + 1}
                >
                  {step.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Form Steps */}
          <div className="bg-card border rounded-lg">
            <div className="relative">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  className="w-full"
                >
                  {/* Your existing form content for each step */}
                  {currentStep === "basics" && (
                    <div className="p-6">
                      <div className="space-y-6">
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium mb-2"
                          >
                            Event Name*
                          </label>
                          <input
                            type="text"
                            id="title"
                            value={eventData.title}
                            onChange={handleBasicInfoChange}
                            className={cn(
                              "w-full rounded-md border bg-background px-3 py-2",
                              formErrors.title && "border-destructive"
                            )}
                            placeholder="Enter event name"
                          />
                          {formErrors.title && (
                            <p className="mt-1 text-sm text-destructive">
                              {formErrors.title}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium mb-2"
                          >
                            Description
                          </label>
                          <textarea
                            id="description"
                            value={eventData.description}
                            onChange={handleBasicInfoChange}
                            rows={4}
                            className="w-full rounded-md border bg-background px-3 py-2"
                            placeholder="Describe your event"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="date"
                              className="block text-sm font-medium mb-2"
                            >
                              Date*
                            </label>
                            <input
                              type="date"
                              id="date"
                              onChange={(e) => {
                                const timeInput = document.getElementById(
                                  "time"
                                ) as HTMLInputElement;
                                handleDateTimeChange(
                                  e.target.value,
                                  timeInput?.value || "00:00"
                                );
                              }}
                              className={cn(
                                "w-full rounded-md border bg-background px-3 py-2",
                                formErrors.date && "border-destructive"
                              )}
                              min={new Date().toISOString().split("T")[0]}
                            />
                            {formErrors.date && (
                              <p className="mt-1 text-sm text-destructive">
                                {formErrors.date}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="time"
                              className="block text-sm font-medium mb-2"
                            >
                              Time*
                            </label>
                            <input
                              type="time"
                              id="time"
                              onChange={(e) => {
                                const dateInput = document.getElementById(
                                  "date"
                                ) as HTMLInputElement;
                                handleDateTimeChange(
                                  dateInput?.value || "",
                                  e.target.value
                                );
                              }}
                              className="w-full rounded-md border bg-background px-3 py-2"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium mb-2"
                          >
                            Location
                          </label>
                          <input
                            type="text"
                            id="location"
                            value={eventData.location}
                            onChange={handleBasicInfoChange}
                            className="w-full rounded-md border bg-background px-3 py-2"
                            placeholder="Enter location or meeting link"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => paginate(1)}
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === "media" && (
                    <div className="p-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Event Images & Videos
                          </label>
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                          >
                            <div className="space-y-2">
                              <div className="flex justify-center">
                                <svg
                                  className="h-12 w-12 text-muted-foreground"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Drag and drop images here, or click to select
                                files
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Supported formats: JPG, PNG, GIF, MP4
                              </div>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              accept="image/*,video/*"
                              multiple
                              onChange={handleFileSelect}
                            />
                          </div>
                        </div>

                        {selectedFiles.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium">
                              Selected Files
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {selectedFiles.map((file, index) => (
                                <div key={index} className="relative group">
                                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                                    {file.type.startsWith("image/") ? (
                                      <Image
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <video
                                        src={URL.createObjectURL(file)}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 p-1 rounded-full bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
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
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <p className="text-xs text-white bg-background/80 px-2 py-1 rounded truncate">
                                      {file.name}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex justify-between">
                        <button
                          onClick={() => paginate(-1)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => paginate(1)}
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === "tickets" && (
                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Ticket Types</h3>
                          <button
                            type="button"
                            onClick={addTicketType}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          >
                            Add Ticket Type
                          </button>
                        </div>

                        {ticketTypes.length === 0 ? (
                          <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <svg
                              className="mx-auto h-12 w-12 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                              />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-muted-foreground">
                              No ticket types
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Get started by creating a new ticket type.
                            </p>
                            <div className="mt-6">
                              <button
                                type="button"
                                onClick={addTicketType}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                              >
                                Add Ticket Type
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {ticketTypes.map((ticket, index) => (
                              <div
                                key={index}
                                className="border rounded-lg p-4 space-y-4"
                              >
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium">
                                    Ticket Type #{index + 1}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => removeTicketType(index)}
                                    className="text-destructive hover:text-destructive/90"
                                  >
                                    Remove
                                  </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Name
                                    </label>
                                    <input
                                      type="text"
                                      value={ticket.name || ""}
                                      onChange={(e) =>
                                        updateTicketType(index, {
                                          name: e.target.value,
                                        })
                                      }
                                      className="w-full rounded-md border bg-background px-3 py-2"
                                      placeholder="e.g., Early Bird, VIP"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Price
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={ticket.price || ""}
                                      onChange={(e) =>
                                        updateTicketType(index, {
                                          price: parseFloat(e.target.value),
                                        })
                                      }
                                      className="w-full rounded-md border bg-background px-3 py-2"
                                      placeholder="0.00"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Description
                                  </label>
                                  <textarea
                                    value={ticket.description || ""}
                                    onChange={(e) =>
                                      updateTicketType(index, {
                                        description: e.target.value,
                                      })
                                    }
                                    rows={2}
                                    className="w-full rounded-md border bg-background px-3 py-2"
                                    placeholder="Describe what's included with this ticket"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Quantity Available
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={ticket.quantity || ""}
                                      onChange={(e) =>
                                        updateTicketType(index, {
                                          quantity: parseInt(e.target.value),
                                        })
                                      }
                                      className="w-full rounded-md border bg-background px-3 py-2"
                                      placeholder="Leave blank for unlimited"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Sales End Date
                                    </label>
                                    <input
                                      type="datetime-local"
                                      value={ticket.end_sale_date || ""}
                                      onChange={(e) =>
                                        updateTicketType(index, {
                                          end_sale_date: e.target.value,
                                        })
                                      }
                                      className="w-full rounded-md border bg-background px-3 py-2"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex justify-between">
                        <button
                          onClick={() => paginate(-1)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleCreateEvent}
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                        >
                          Create Event
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Progress Modal */}
      {showProgress && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
            <div className="flex flex-col space-y-1.5 text-center">
              <h2 className="text-lg font-semibold">Creating Your Event</h2>
              <p className="text-sm text-muted-foreground">
                Please wait while we set up your event
              </p>
            </div>
            <div className="space-y-4">
              {creationSteps.map((step) => (
                <div key={step.id} className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {step.status === "pending" && (
                        <div className="h-8 w-8 rounded-full border-2 border-muted" />
                      )}
                      {step.status === "processing" && (
                        <div className="h-8 w-8">
                          <svg
                            className="h-8 w-8 animate-spin text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        </div>
                      )}
                      {step.status === "completed" && (
                        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                          <svg
                            className="h-5 w-5"
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
                      )}
                      {step.status === "error" && (
                        <div className="h-8 w-8 rounded-full bg-destructive/20 text-destructive flex items-center justify-center">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {errorMessages[step.id] && (
                    <div className="ml-12 mt-2 p-3 rounded bg-destructive/10 border border-destructive/20">
                      <div className="flex items-start">
                        <svg
                          className="h-5 w-5 text-destructive flex-shrink-0 mr-2 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-destructive">
                            Error Details:
                          </p>
                          {errorMessages[step.id]
                            .split("\n")
                            .map((error, i) => (
                              <p
                                key={i}
                                className="text-sm text-destructive mt-1"
                              >
                                • {error}
                              </p>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {creationSteps.some((step) => step.status === "error") && (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowProgress(false)}
                  className="px-4 py-2 text-sm font-medium rounded-md border hover:bg-accent"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push("/events")}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Go to Events
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
