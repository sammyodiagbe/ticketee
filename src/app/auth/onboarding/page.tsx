"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@supabase/ssr";
import AddressAutocomplete from "@/components/address-autocomplete";

const steps = [
  { id: "personal", name: "Personal Info" },
  { id: "business", name: "Business Details" },
  { id: "payment", name: "Payment Setup" },
];

const businessTypes = [
  "Martial Arts School",
  "Fitness Studio",
  "Dance Studio",
  "Yoga Studio",
  "Personal Training",
  "Sports Academy",
  "Wellness Center",
  "Music School",
  "Art Studio",
  "Educational Center",
  "Other",
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

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [[currentStep, direction], setCurrentStep] = useState(["personal", 0]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    businessName: "",
    businessType: "",
    customBusinessType: "",
    businessAddress: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const paginate = (newDirection: number) => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const nextIndex = currentIndex + newDirection;

    if (nextIndex >= 0 && nextIndex < steps.length) {
      setCurrentStep([steps[nextIndex].id, newDirection]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user found");
      }

      // Determine the final business type
      const finalBusinessType =
        formData.businessType === "Other"
          ? formData.customBusinessType
          : formData.businessType;

      // Update the user's profile in your database
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        business_name: formData.businessName,
        business_type: finalBusinessType,
        business_address: formData.businessAddress,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Redirect to dashboard
      router.push("/events");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Complete Your Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Help us personalize your experience
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
                  <div
                    className={cn(
                      "absolute top-4 left-0 -right-8 sm:-right-20 h-[2px]",
                      stepIdx < currentIndex ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
                <div className="relative flex items-center">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : stepIdx < currentIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {stepIdx + 1}
                  </div>
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
        <div className="bg-card border rounded-lg">
          <div className="relative min-h-[500px]">
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
                className="absolute inset-0 flex flex-col"
              >
                {currentStep === "personal" && (
                  <div className="h-full p-6 flex flex-col">
                    <div className="flex-1 space-y-6">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium mb-2"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full rounded-md border bg-background px-3 py-2"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium mb-2"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full rounded-md border bg-background px-3 py-2"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium mb-2"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full rounded-md border bg-background px-3 py-2"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <div className="flex justify-end">
                        <button
                          onClick={() => paginate(1)}
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === "business" && (
                  <div className="h-full p-6 flex flex-col">
                    <div className="flex-1 space-y-6">
                      <div>
                        <label
                          htmlFor="businessName"
                          className="block text-sm font-medium mb-2"
                        >
                          Business Name
                        </label>
                        <input
                          type="text"
                          id="businessName"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="w-full rounded-md border bg-background px-3 py-2"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="businessType"
                          className="block text-sm font-medium mb-2"
                        >
                          Business Type
                        </label>
                        <select
                          id="businessType"
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleInputChange}
                          className="w-full rounded-md border bg-background px-3 py-2"
                          required
                        >
                          <option value="">Select a business type</option>
                          {businessTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {formData.businessType === "Other" && (
                        <div>
                          <label
                            htmlFor="customBusinessType"
                            className="block text-sm font-medium mb-2"
                          >
                            Specify Business Type
                          </label>
                          <input
                            type="text"
                            id="customBusinessType"
                            name="customBusinessType"
                            value={formData.customBusinessType}
                            onChange={handleInputChange}
                            className="w-full rounded-md border bg-background px-3 py-2"
                            placeholder="Enter your business type"
                            required
                          />
                        </div>
                      )}

                      <div>
                        <label
                          htmlFor="businessAddress"
                          className="block text-sm font-medium mb-2"
                        >
                          Business Address
                        </label>
                        <AddressAutocomplete
                          value={formData.businessAddress}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              businessAddress: value,
                            }))
                          }
                          className="w-full rounded-md border bg-background px-3 py-2"
                          placeholder="Enter your business address"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <div className="flex justify-between">
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
                  </div>
                )}

                {currentStep === "payment" && (
                  <div className="h-full p-6 flex flex-col">
                    <div className="flex-1 space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-medium">Payment Setup</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          You can set up your payment details now or skip this
                          step and do it later.
                        </p>
                      </div>

                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleSubmit()}
                          className="bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-muted/90"
                          disabled={loading}
                        >
                          {loading ? "Setting up..." : "Skip for now"}
                        </button>
                        <button
                          onClick={() => {
                            // TODO: Implement payment setup
                            handleSubmit();
                          }}
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                          disabled={loading}
                        >
                          {loading ? "Setting up..." : "Set up payment"}
                        </button>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <div className="flex justify-start">
                        <button
                          onClick={() => paginate(-1)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
