'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UpdateProfileData, updateProfile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Navigation } from '@/components/navigation';

const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 7 }, (_, i) => currentYear + i);

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.coerce.number().int().min(18, 'You must be at least 18 years old').max(99, 'Invalid age'),
  gender: z.string().min(1, 'Gender is required'),
  bio: z.string().optional(),
  program: z.string().optional(),
  graduation_year: z.coerce.number().optional(),
  interests: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    // Populate form with user data when available
    if (user && user.profile) {
      reset({
        name: user.profile.name,
        age: user.profile.age,
        gender: user.profile.gender,
        bio: user.profile.bio || '',
        program: user.profile.program || '',
        graduation_year: user.profile.graduation_year || undefined,
        interests: user.profile.interests || '',
        latitude: user.profile.latitude || undefined,
        longitude: user.profile.longitude || undefined,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    try {
      await updateProfile(data as UpdateProfileData);
      toast({
        title: 'Success',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentLocation = () => {
    setIsLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          setIsLocationLoading(false);
          toast({
            title: 'Location Updated',
            description: 'Your current location has been set.',
          });
        },
        (error) => {
          setIsLocationLoading(false);
          toast({
            title: 'Error',
            description: `Failed to get location: ${error.message}`,
            variant: 'destructive',
          });
        }
      );
    } else {
      setIsLocationLoading(false);
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by your browser',
        variant: 'destructive',
      });
    }
  };

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min={18}
                    max={99}
                    {...register('age')}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500">{errors.age.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    defaultValue={user.profile.gender}
                    onValueChange={(value) => setValue('gender', value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-binary">Non-binary</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-red-500">{errors.gender.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program">Program (Optional)</Label>
                  <Input
                    id="program"
                    type="text"
                    placeholder="e.g. Computer Science"
                    {...register('program')}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="graduation_year">Graduation Year (Optional)</Label>
                  <Select
                    defaultValue={user.profile.graduation_year?.toString()}
                    onValueChange={(value) => setValue('graduation_year', parseInt(value))}
                  >
                    <SelectTrigger id="graduation_year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {graduationYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interests">Interests (Optional)</Label>
                  <Input
                    id="interests"
                    type="text"
                    placeholder="e.g. Hiking, Movies, Coding"
                    {...register('interests')}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself"
                  className="resize-none"
                  {...register('bio')}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    {...register('latitude')}
                  />
                  <Input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    {...register('longitude')}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-2"
                  onClick={getCurrentLocation}
                  disabled={isLocationLoading}
                >
                  {isLocationLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    'Get Current Location'
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      <Navigation />
    </div>
  );
} 