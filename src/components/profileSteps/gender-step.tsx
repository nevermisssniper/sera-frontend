"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // if you have a custom label
import { TUserProfile } from "@/lib/validations";
import { RadioCardGroup } from "@/components/radio-card-group";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"; // or your own Card component

const genderOptions = [
  { value: "male", label: "Male", image: "/images/37.webp" },
  { value: "female", label: "Female", image: "/images/18.webp" },
];

const ageOptions = [
  { value: "20", label: "Younger than 25", image: "/images/17.webp" },
  { value: "35", label: "Between 25 and 50", image: "/images/25.webp" },
  { value: "50", label: "Older than 50", image: "/images/6.webp" },
];

export default function GenderStep({
  formData,
  handleChange,
  nextStep,
}: {
  formData: TUserProfile;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
}) {
  return (
    <Card className="w-fit mx-auto my-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Step 1 of 5</CardTitle>
        <CardDescription className="text-gray-600">
          Select your gender and age
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Gender */}
          <div>
            <Label htmlFor="gender" className="mb-2 block text-sm font-medium">
              Gender
            </Label>
            <RadioCardGroup
              name="gender"
              currentValue={formData.gender ? formData.gender : ""}
              options={genderOptions}
              onChange={handleChange}
            />
          </div>

          {/* Age */}
          <div>
            <Label htmlFor="age" className="mb-2 block text-sm font-medium">
              Age
            </Label>
            <RadioCardGroup
              name="age"
              currentValue={formData.age ? String(formData.age) : ""}
              options={ageOptions}
              onChange={handleChange}
            />
          </div>

          {/* Next button */}
          <div className="flex justify-end">
            <Button type="submit" onClick={nextStep}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
