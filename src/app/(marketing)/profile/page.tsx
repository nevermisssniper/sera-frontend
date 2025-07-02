"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import H1 from "@/components/h1";
import GenderStep from "@/components/profileSteps/gender-step";
import HairStep from "@/components/profileSteps/hair-step";
import EthnicityStep from "@/components/profileSteps/ethnicity-step";
import AttireStep from "@/components/profileSteps/attire-step";
import UploadImageStep from "@/components/profileSteps/upload-img-step";
import { z } from "zod";
import {
  userProfileSchema,
  TUserProfile,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from "@/lib/validations";
import { updateProfile } from "@/actions/actions";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);

  //lifted up controlled state for all form fields. By default set them all to empty strings
  //TODO: need to by default set them to current users values from DB (not necessary)
  const [formData, setFormData] = useState<TUserProfile>({
    gender: "",
    age: "",
    hairColor: "",
    hairLength: "",
    ethnicity: "",
    bodyType: "",
    attire: "",
    backgrounds: "",
    glasses: "false",
    instanceImages: [],
  });

  // For holding any validation errors at each step
  const [stepError, setStepError] = useState("");

  useEffect(() => {
    const stepParam = parseInt(searchParams.get("step") || "1", 10);
    setCurrentStep(stepParam);
  }, [searchParams]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You must be signed in to view this page.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Just store the string
    }));
  };

  // Step-wise validation using partial schemas
  async function validateAndNext(stepNumber: number) {
    setStepError("");

    let result: z.SafeParseReturnType<any, any>;
    switch (stepNumber) {
      case 1:
        result = step1Schema.safeParse({
          gender: formData.gender,
          age: formData.age,
        });
        break;
      case 2:
        result = step2Schema.safeParse({
          hairColor: formData.hairColor,
          hairLength: formData.hairLength,
        });
        break;
      case 3:
        result = step3Schema.safeParse({
          ethnicity: formData.ethnicity,
          bodyType: formData.bodyType,
        });
        break;
      case 4:
        result = step4Schema.safeParse({
          attire: formData.attire,
          backgrounds: formData.backgrounds,
          glasses: formData.glasses,
        });
        break;
      default:
        // if somehow stepNumber is out of range
        return;
    }

    if (!result.success) {
      // Show an error (just the first message for simplicity)
      const firstIssue = result.error.issues[0];
      setStepError(firstIssue?.message || "Invalid data.");
      return; // do NOT advance
    }
    // if success:
    goNext(stepNumber);
  }

  function goNext(stepNumber: number) {
    const next = stepNumber + 1;
    router.push(`/profile?step=${next}`);
  }

  function goPrev(stepNumber: number) {
    if (stepNumber <= 1) return;
    const prev = stepNumber - 1;
    router.push(`/profile?step=${prev}`);
  }

  async function handleFinalSubmit(images: string[]) {
    // images from the final step’s UploadImageStep component
    const newData = { ...formData, instanceImages: images };

    // Now run the FULL validation
    const finalResult = userProfileSchema.safeParse(newData);
    if (!finalResult.success) {
      // show an error in the final step, or handle gracefully
      const firstIssue = finalResult.error.issues[0];
      setStepError(firstIssue?.message || "Invalid data.");
      return;
    }

    // If everything is valid, call the server action once
    try {
      const res = await updateProfile(finalResult.data);
      console.log("Final updateProfile result:", res);
      // maybe redirect to success page or do something
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center space-y-8">
      {stepError && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-2">
          {stepError}
        </div>
      )}

      {/* Step Components */}
      {currentStep === 1 && (
        <GenderStep
          formData={formData}
          handleChange={handleChange}
          nextStep={() => validateAndNext(1)}
        />
      )}
      {currentStep === 2 && (
        <HairStep
          formData={formData}
          handleChange={handleChange}
          prevStep={() => goPrev(2)}
          nextStep={() => validateAndNext(2)}
        />
      )}
      {currentStep === 3 && (
        <EthnicityStep
          formData={formData}
          handleChange={handleChange}
          prevStep={() => goPrev(3)}
          nextStep={() => validateAndNext(3)}
        />
      )}
      {currentStep === 4 && (
        <AttireStep
          formData={formData}
          handleChange={handleChange}
          prevStep={() => goPrev(4)}
          nextStep={() => validateAndNext(4)}
        />
      )}
      {currentStep === 5 && (
        <UploadImageStep
          formData={formData}
          handleChange={handleChange}
          prevStep={() => goPrev(5)}
          // Instead of calling nextStep, we do final submission
          onFinalSubmit={handleFinalSubmit}
        />
      )}
    </main>
  );
}
