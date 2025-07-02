"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Changed to match GenderStep
import { TUserProfile } from "@/lib/validations";
import { RadioCardGroup } from "@/components/radio-card-group";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"; // Added Card components

const attireOptions = [
  { value: "casual", label: "Casual", image: "/images/36.webp" },
  { value: "semiformal", label: "Business Casual", image: "/images/40.webp" },
  { value: "formal", label: "Formal", image: "/images/31.webp" },
  // Add more as needed
];

const backgroundOptions = [
  { value: "studio", label: "Studio", image: "/images/28.webp" },
  { value: "outdoor", label: "Outdoor", image: "/images/11.webp" },
  { value: "city", label: "City", image: "/images/2.webp" },
  { value: "office", label: "Office", image: "/images/7.webp" },
  // Add more as needed
];

const glassesOptions = [
  { value: "true", label: "With Glasses", image: "/images/39.webp" },
  { value: "false", label: "Without Glasses", image: "/images/33.webp" },
];

export default function AttireStep({
  formData,
  handleChange,
  prevStep,
  nextStep,
}: {
  formData: TUserProfile;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prevStep: () => void;
  nextStep: () => void;
}) {
  return (
    <Card className="w-fit mx-auto my-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Step 4 of 5</CardTitle>
        <CardDescription className="text-gray-600">
          Select your attire, background, and glasses preference
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="mb-2 block text-sm font-medium" htmlFor="attire">
              Attire
            </Label>
            <RadioCardGroup
              name="attire"
              currentValue={formData.attire}
              options={attireOptions}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label
              className="mb-2 block text-sm font-medium"
              htmlFor="backgrounds"
            >
              Backgrounds
            </Label>
            <RadioCardGroup
              name="backgrounds"
              currentValue={formData.backgrounds}
              options={backgroundOptions}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium" htmlFor="glasses">
              Glasses
            </Label>
            <RadioCardGroup
              name="glasses"
              currentValue={String(formData.glasses)}
              options={glassesOptions}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-between">
            <Button type="button" onClick={prevStep}>
              Previous
            </Button>
            <Button type="submit" onClick={nextStep}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
