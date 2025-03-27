"use client";

import { useState } from "react";
import Header from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const [name, setName] = useState("John Doe");
  const [age, setAge] = useState(21);
  const [faculty, setFaculty] = useState("Engineering");
  const [program, setProgram] = useState("Software Engineering");
  const [year, setYear] = useState(3);
  const [photo, setPhoto] = useState("/default-avatar.png");

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container max-w-3xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="flex flex-col items-center space-y-6">
          {/* Profile Avatar */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>

          {/* Editable Profile Fields */}
          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Faculty</label>
              <Input
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Program</label>
              <Input
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="mt-4">
            Save Changes
          </Button>
        </div>
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>WaterlooMatch - Exclusively for University of Waterloo students</p>
        </div>
      </footer>
    </div>
  );
}