"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Match } from '@/types/api';
import { getPotentialMatches } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MessageCircle } from 'lucide-react';
import { Navigation } from '@/components/navigation';

export default function MatchesPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    // Fetch matches
    const fetchMatches = async () => {
      try {
        setIsLoadingMatches(true);
        const { matches } = await getPotentialMatches();
        // Filter only accepted matches
        const acceptedMatches = matches.filter(match => match.match_status === 'accepted');
        setMatches(acceptedMatches);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load matches',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingMatches(false);
      }
    };

    if (isAuthenticated) {
      fetchMatches();
    }
  }, [isAuthenticated, toast]);

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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
        
        {isLoadingMatches ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">No Matches Yet</h2>
              <p className="text-muted-foreground">
                You haven't matched with anyone yet. Keep swiping to find your perfect match!
              </p>
              <Button 
                className="mt-4"
                onClick={() => router.push('/dashboard')}
              >
                Find Matches
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map(match => (
              <Card key={match.user_id} className="overflow-hidden">
                <div className="aspect-square bg-slate-200 relative">
                  {match.photos && match.photos.length > 0 ? (
                    <img
                      src={match.photos[0]}
                      alt={match.name}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-slate-200">
                      <span className="text-slate-400">No photo available</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-xl font-bold">{match.name}, {match.age}</h2>
                      {match.program && (
                        <p className="text-sm text-slate-500">{match.program}</p>
                      )}
                    </div>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {match.distance} km away
                    </span>
                  </div>
                  
                  <p className="text-sm line-clamp-2 mb-3">{match.bio}</p>
                  
                  <Button className="w-full" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Navigation />
    </div>
  );
}
