"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Heart, Info, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/types";

// Faculty color map for the UI
const FACULTY_COLORS = {
  "Arts": "bg-arts",
  "Engineering": "bg-engineering",
  "Environment": "bg-environment",
  "Health": "bg-health",
  "Mathematics": "bg-math",
  "Science": "bg-science"
};

// Text color map for the UI
const FACULTY_TEXT_COLORS = {
  "Arts": "text-arts",
  "Engineering": "text-engineering",
  "Environment": "text-environment",
  "Health": "text-health",
  "Mathematics": "text-math",
  "Science": "text-science"
};

interface ProfileCardProps {
  user: User;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function ProfileCard({ user, onSwipeLeft, onSwipeRight }: ProfileCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const facultyColor = FACULTY_COLORS[user.faculty] || "bg-primary";
  const facultyTextColor = FACULTY_TEXT_COLORS[user.faculty] || "text-primary";

  // Get the current photo or placeholder
  const currentPhoto = user.photos[currentPhotoIndex] || "https://ext.same-assets.com/3381471116/3994213222.jpeg";

  const nextPhoto = () => {
    if (currentPhotoIndex < user.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto overflow-hidden relative h-[500px] md:h-[600px] border-2">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10 pointer-events-none" />

        {/* Main photo */}
        <div className="w-full h-full relative">
          <Image
            src={currentPhoto}
            alt={`Photo of ${user.name}`}
            fill
            style={{ objectFit: "cover" }}
            priority
          />

          {/* Photo navigation */}
          {user.photos.length > 1 && (
            <div className="absolute top-0 w-full h-12 flex z-20">
              {user.photos.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-1 my-3 mx-1 rounded-full ${
                    index === currentPhotoIndex ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Left/right photo navigation buttons */}
          {user.photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                disabled={currentPhotoIndex === 0}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full disabled:opacity-0 z-20"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={nextPhoto}
                disabled={currentPhotoIndex === user.photos.length - 1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full disabled:opacity-0 z-20"
              >
                <ArrowRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* User info overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold flex items-center">
                {user.name}, {user.age}
                <span className={`ml-2 inline-block w-3 h-3 rounded-full ${facultyColor}`}></span>
              </h3>
              <p className="text-white/90">
                {user.program}, Year {user.year}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDetails(true)}
              className="text-white hover:bg-black/30"
            >
              <Info size={24} />
            </Button>
          </div>
        </div>

    
      </Card>

      {/* Details dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{user.name}, {user.age}</span>
              <span className={`inline-block w-3 h-3 rounded-full ${facultyColor}`}></span>
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2 mt-1">
                <span className={`font-medium ${facultyTextColor}`}>{user.faculty}</span>
                <span>•</span>
                <span>{user.program}, Year {user.year}</span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <h4 className="font-medium text-sm mb-1">About</h4>
            <p className="text-sm text-muted-foreground">{user.bio}</p>

            <h4 className="font-medium text-sm mt-4 mb-1">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-muted text-xs rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>

            <h4 className="font-medium text-sm mt-4 mb-1">Looking for</h4>
            <div className="flex gap-2">
              {user.lookingFor.map((gender, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs border rounded"
                >
                  {gender}
                </span>
              ))}
            </div>

            <h4 className="font-medium text-sm mt-4 mb-1">Photos</h4>
            <div className="grid grid-cols-3 gap-2">
              {user.photos.map((photo, index) => (
                <Avatar key={index} className="w-full h-20 rounded-md">
                  <AvatarImage src={photo} className="object-cover" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
