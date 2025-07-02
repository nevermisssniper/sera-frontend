"use client";
import Image from "next/image";
import React from "react";

interface Option {
  value: string;
  label: string;
  image: string;
}

interface RadioCardGroupProps {
  name: string;
  currentValue: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RadioCardGroup({
  name,
  currentValue,
  options,
  onChange,
}: RadioCardGroupProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((option) => {
        const isChecked = currentValue === option.value;
        return (
          <label
            key={option.value}
            className={`cursor-pointer border p-4 rounded-md ${
              isChecked ? "border-violet-500" : "border-gray-300"
            }`}
          >
            {/* Hidden radio input */}
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={onChange}
              className="sr-only "
            />

            {/* Visible card content */}
            <Image
              src={option.image}
              alt={option.label}
              width={200}
              height={200}
              className="w-40 h-40 object-cover"
            />
            <p className="text-center mt-2 font-medium">{option.label}</p>
          </label>
        );
      })}
    </div>
  );
}
