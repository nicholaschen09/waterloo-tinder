"use client";

import { useState, useEffect } from "react";
import { MOCK_USERS } from "@/data/mockData";
import ProfileCard from "@/components/profile-card";
import Header from "@/components/header";
import { User } from "@/types";
import { toast } from "sonner";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setUsers(MOCK_USERS);
  }, []);

  const currentUser = users[currentIndex];

  const handleSwipeLeft = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
      toast("Passed", {
        description: `You've passed on ${currentUser.name}`,
      });
    } else {
      toast("No more profiles", {
        description: "You've viewed all available profiles in your area.",
      });
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex < users.length - 1) {
      const isMatch = Math.random() < 0.3;

      if (isMatch) {
        toast.success("New Match!", {
          description: `You matched with ${currentUser.name}!`,
        });
      } else {
        toast("Liked", {
          description: `You liked ${currentUser.name}`,
        });
      }

      setCurrentIndex(currentIndex + 1);
    } else {
      toast("No more profiles", {
        description: "You've viewed all available profiles in your area.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-5xl py-8 px-4">
        {users.length > 0 && currentIndex < users.length ? (
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8 text-center">Find Your Campus Connection</h1>
            <ProfileCard
              user={currentUser}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
            {/* Adjust the buttons container to have more margin-top */}
            <div className="mt-12 flex justify-center gap-4"> {/* Adjust margin here */}
              <button
                onClick={handleSwipeLeft}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Pass
              </button>
              <button
                onClick={handleSwipeRight}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Like
              </button>
            </div>
            <div className="mt-12 text-center text-muted-foreground text-sm"> {/* Adjust margin here */}
              <p>Swipe left to pass or right to like</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[600px]">
            <h2 className="text-2xl font-bold mb-2">No more profiles</h2>
            <p className="text-muted-foreground mb-4">Check back later for new matches</p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Start Over
            </button>
          </div>
        )}
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>WaterlooMatch - Exclusively for University of Waterloo students</p>
        </div>
      </footer>
    </div>
  );
}
