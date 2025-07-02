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

const ethnicityOptions = [
  { value: "asian", label: "Asian", image: "/images/13.webp" },
  { value: "white", label: "White", image: "/images/10.webp" },
  { value: "black", label: "Black", image: "/images/16.webp" },
  { value: "hispanic", label: "Hispanic", image: "/images/15.webp" },
  { value: "arab", label: "Arab", image: "/images/22.webp" },
  // Add more as needed
];

const bodyTypeOptions = [
  { value: "slim", label: "Slim", image: "/images/9.webp" },
  { value: "average", label: "Average", image: "/images/7.webp" },
  { value: "heavier", label: "Heavier", image: "/images/29.webp" },
  { value: "muscular", label: "Muscular", image: "/images/34.webp" },
  // Add more as needed
];

export default function EthnicityStep({
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
        <CardTitle className="text-xl font-semibold">Step 3 of 5</CardTitle>
        <CardDescription className="text-gray-600">
          Select your ethnicity and body type
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div>
            <Label
              className="mb-2 block text-sm font-medium"
              htmlFor="ethnicity"
            >
              Ethnicity
            </Label>
            <RadioCardGroup
              name="ethnicity"
              currentValue={formData.ethnicity ? formData.ethnicity : ""}
              options={ethnicityOptions}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label
              className="mb-2 block text-sm font-medium"
              htmlFor="bodyType"
            >
              Body Type
            </Label>
            <RadioCardGroup
              name="bodyType"
              currentValue={formData.bodyType ? formData.bodyType : ""}
              options={bodyTypeOptions}
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
