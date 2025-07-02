"use client";
import { Button } from "@/components/ui/button";
import { TUserProfile } from "@/lib/validations";
import { useState } from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import Image from "next/image";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function UploadImageStep({
  formData,
  handleChange,
  prevStep,
  onFinalSubmit,
}: {
  formData: TUserProfile;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prevStep: () => void;
  onFinalSubmit: (images: string[]) => void;
}) {
  const [imageUuids, setImageUuids] = useState<string[]>([]);

  const handleSubmit = () => {
    onFinalSubmit(imageUuids);
  };

  return (
    <Card className="w-fit mx-auto my-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Step 5 of 5</CardTitle>
        <CardDescription className="text-gray-600">
          Upload your reference images (try 10-15 for best results)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div>
            <FileUploaderRegular
              sourceList="local, url, camera, dropbox, gdrive"
              classNameUploader="uc-light"
              pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || ""}
              onChange={(outputState) => {
                const uploadedFiles = outputState.successEntries;
                const uuids = uploadedFiles.map((file) => file.uuid);
                setImageUuids(uuids);
              }}
            />
          </div>

          {/* Displaying uploaded images */}
          {imageUuids.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-3">Uploaded Images:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {imageUuids.map((uuid, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-md h-64"
                  >
                    <Image
                      src={`https://ucarecdn.com/${uuid}/`}
                      alt={`Uploaded ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button type="button" onClick={prevStep}>
              Previous
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={imageUuids.length === 0}
              className="ml-6"
            >
              Submit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
