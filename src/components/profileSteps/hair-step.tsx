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

const hairColorOptions = [
  { value: "blonde", label: "Blonde", image: "/images/27.webp" },
  { value: "brown", label: "Brown", image: "/images/8.webp" },
  { value: "black", label: "Black", image: "/images/20.webp" },
  // Add more as needed
];

const hairLengthOptions = [
  { value: "short", label: "Short", image: "/images/24.webp" },
  { value: "medium", label: "Medium", image: "/images/39.webp" },
  { value: "long", label: "Long", image: "/images/3.webp" },
  // Add more as needed
];

export default function HairStep({
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
        <CardTitle className="text-xl font-semibold">Step 2 of 5</CardTitle>
        <CardDescription className="text-gray-600">
          Select your hair color and length
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div>
            <Label
              className="mb-2 block text-sm font-medium"
              htmlFor="hairColor"
            >
              Hair Color
            </Label>
            <RadioCardGroup
              name="hairColor"
              currentValue={formData.hairColor ? formData.hairColor : ""}
              options={hairColorOptions}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label
              className="mb-2 block text-sm font-medium"
              htmlFor="hairLength"
            >
              Hair Length
            </Label>
            <RadioCardGroup
              name="hairLength"
              currentValue={formData.hairLength ? formData.hairLength : ""}
              options={hairLengthOptions}
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
