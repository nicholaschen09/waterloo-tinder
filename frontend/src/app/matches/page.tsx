"use client";

import { useState, useEffect } from "react";
import { MOCK_USERS } from "@/data/mockData";
import Header from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types";

// Randomly select some mock users as matches
const getRandomMatches = (users: User[], count: number) => {
  const shuffled = [...users].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<User[]>([]);

  useEffect(() => {
    // Simulate 5-10 matches from our mock users
    const matchCount = Math.floor(Math.random() * 6) + 5;
    setMatches(getRandomMatches(MOCK_USERS, matchCount));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container max-w-5xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Matches</h1>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((user) => (
              <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  {user.photos[0] && (
                    <div className="absolute inset-0">
                      <img
                        src={user.photos[0]}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="font-bold">{user.name}, {user.age}</h3>
                    <p className="text-sm text-white/80">{user.faculty} • {user.program}</p>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.interests.slice(0, 3).map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-xs rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                      {user.interests.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-xs rounded-full">
                          +{user.interests.length - 3} more
                        </span>
                      )}
                    </div>

                    <button className="px-4 py-2 text-sm rounded-full bg-primary text-primary-foreground">
                      Message
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-bold mb-2">No matches yet</h2>
            <p className="text-muted-foreground">
              Keep swiping to find your campus connection!
            </p>
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
