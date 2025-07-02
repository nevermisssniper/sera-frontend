"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type MyImagesResponse = {
  generatedImages: string[];
};

export default function GalleryPage() {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/my-images");
        if (!res.ok) {
          throw new Error("Failed to get images");
        }
        const data: MyImagesResponse = await res.json();
        setGeneratedImages(data.generatedImages || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Convert a UUID to a full image URL
  function getImageUrl(uuid: string): string {
    return `https://ucarecdn.com/${uuid}/`;
  }
  // Handle opening the modal in full resolution
  function handleOpenModal(uuid: string) {
    setSelectedUuid(uuid);
    setShowModal(true);
  }
  function handleCloseModal() {
    setShowModal(false);
    setSelectedUuid(null);
  }
  // Delete image
  async function handleDelete(uuid: string) {
    try {
      console.log(`Deleting ${uuid}...`);
      // Call your protected route
      const res = await fetch(`/api/my-images?uuid=${uuid}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      // Remove from local state
      setGeneratedImages((prev) => prev.filter((id) => id !== uuid));
    } catch (err) {
      console.error(err);
    }
  }
  // Download image
  function handleDownload(uuid: string) {
    const url = getImageUrl(uuid);
    // Option 1: just open in a new tab
    window.open(url, "_blank");
    // Or Option 2: create a hidden <a> with download attribute
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = `my-image-${uuid}.jpg`; // or .png
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  }
  // Favorite image (placeholder)
  function handleFavorite(uuid: string) {
    console.log(`Favoriting ${uuid}...`);
    // You could do a POST / PATCH to an endpoint, e.g. /api/my-images/favorite
  }

  if (loading) return <p>Loading images...</p>;

  if (generatedImages.length === 0) {
    return (
      <p>
        No generated images yet. Check back soon! Please note that image
        generation may take up to 2 hours to complete.
      </p>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {generatedImages.map((uuid) => (
          <div
            key={uuid}
            style={{
              border: "1px solid #ccc",
              padding: "0.5rem",
            }}
          >
            {/* Thumbnail */}
            <Image
              src={getImageUrl(uuid)}
              alt="Generated"
              width={200}
              height={200}
              style={{ objectFit: "cover", cursor: "pointer" }}
              onClick={() => handleOpenModal(uuid)}
            />
            {/* Action Buttons */}
            <div
              style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}
            >
              <button onClick={() => handleFavorite(uuid)}>Favorite</button>
              <button onClick={() => handleDownload(uuid)}>Download</button>
              <button onClick={() => handleDelete(uuid)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal (conditional) */}
      {showModal && selectedUuid && (
        <FullResModal
          uuid={selectedUuid}
          onClose={handleCloseModal}
          onFavorite={handleFavorite}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}

// A separate component for the full-resolution modal
function FullResModal({
  uuid,
  onClose,
  onFavorite,
  onDelete,
  onDownload,
}: {
  uuid: string;
  onClose: () => void;
  onFavorite: (uuid: string) => void;
  onDelete: (uuid: string) => void;
  onDownload: (uuid: string) => void;
}) {
  const url = `https://ucarecdn.com/${uuid}/`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: "1rem",
          maxWidth: "90vw",
          maxHeight: "90vh",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()} // don't close if clicking inside
      >
        <h2>Full Resolution</h2>
        <div style={{ margin: "1rem 0", textAlign: "center" }}>
          <Image
            src={url}
            alt="Full-Res Image"
            width={800}
            height={600}
            style={{ height: "auto", maxWidth: "100%" }}
          />
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => onFavorite(uuid)}>Favorite</button>
          <button onClick={() => onDownload(uuid)}>Download</button>
          <button onClick={() => onDelete(uuid)}>Delete</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
