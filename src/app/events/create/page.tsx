"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

export default function CreateEventPage() {
  const [[currentStep, direction], setCurrentStep] = useState(["basics", 0]);

  const paginate = (newDirection: number) => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const nextIndex = currentIndex + newDirection;

    if (nextIndex >= 0 && nextIndex < steps.length) {
      setCurrentStep([steps[nextIndex].id, newDirection]);
    }
  };

  const currentIndex = steps.findIndex((step) => step.id === currentStep);

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
          <nav aria-label="Progress" className="mb-8">
            <ol role="list" className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li
                  key={step.id}
                  className={cn(
                    stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
                    "relative"
                  )}
                >
                  {stepIdx !== steps.length - 1 && (
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor:
                          stepIdx < steps.findIndex((s) => s.id === currentStep)
                            ? "hsl(var(--primary))"
                            : "hsl(var(--border))",
                      }}
                      className="absolute top-4 left-0 -right-8 sm:-right-20 h-[2px]"
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <div className="relative flex items-center z-10 bg-background">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: currentStep === step.id ? 1.2 : 1,
                        borderColor:
                          currentStep === step.id
                            ? "hsl(var(--primary))"
                            : "hsl(var(--border))",
                      }}
                      className={cn(
                        "h-8 w-8 flex items-center justify-center rounded-full border-2",
                        currentStep === step.id
                          ? "border-primary bg-primary/10"
                          : "border-border",
                        stepIdx < steps.findIndex((s) => s.id === currentStep)
                          ? "bg-primary border-primary"
                          : "bg-background"
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-medium",
                          currentStep === step.id
                            ? "text-primary"
                            : stepIdx <
                              steps.findIndex((s) => s.id === currentStep)
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {stepIdx + 1}
                      </span>
                    </motion.div>
                    <div className="ml-4 min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          currentStep === step.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.name}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          {/* Form Steps */}
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="relative" style={{ minHeight: "600px" }}>
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
                  className="absolute inset-0 h-auto"
                >
                  {/* Your existing form content for each step */}
                  {currentStep === "basics" && (
                    <div className="p-6">
                      <div className="space-y-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium mb-2"
                          >
                            Event Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="w-full rounded-md border bg-background px-3 py-2"
                            placeholder="Enter event name"
                          />
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
                              Date
                            </label>
                            <input
                              type="date"
                              id="date"
                              className="w-full rounded-md border bg-background px-3 py-2"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="time"
                              className="block text-sm font-medium mb-2"
                            >
                              Time
                            </label>
                            <input
                              type="time"
                              id="time"
                              className="w-full rounded-md border bg-background px-3 py-2"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Location Type
                          </label>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="locationType"
                                value="physical"
                                className="mr-2"
                              />
                              Physical Location
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="locationType"
                                value="virtual"
                                className="mr-2"
                              />
                              Virtual Event
                            </label>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium mb-2"
                          >
                            Location Details
                          </label>
                          <input
                            type="text"
                            id="location"
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
                            Event Images
                          </label>
                          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
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
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              multiple
                            />
                          </div>
                        </div>
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
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium">
                              Ticket Types
                            </label>
                            <button className="text-sm text-primary hover:text-primary/90">
                              + Add Ticket Type
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Ticket Name
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full rounded-md border bg-background px-3 py-2"
                                    placeholder="e.g., General Admission"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Price
                                  </label>
                                  <input
                                    type="number"
                                    className="w-full rounded-md border bg-background px-3 py-2"
                                    placeholder="0.00"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Quantity Available
                                  </label>
                                  <input
                                    type="number"
                                    className="w-full rounded-md border bg-background px-3 py-2"
                                    placeholder="100"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Sale End Date
                                  </label>
                                  <input
                                    type="date"
                                    className="w-full rounded-md border bg-background px-3 py-2"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-between">
                        <button
                          onClick={() => paginate(-1)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => console.log("Create event")}
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
    </>
  );
}
