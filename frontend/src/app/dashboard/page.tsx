'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Match } from '@/types/api'
import { getPotentialMatches, createMatch } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Heart, X } from 'lucide-react'
import { Navigation } from '@/components/navigation'

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [matches, setMatches] = useState<Match[]>([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [isLoadingMatches, setIsLoadingMatches] = useState(true)
  const [isProcessingMatch, setIsProcessingMatch] = useState(false)

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    // Fetch potential matches
    const fetchMatches = async () => {
      try {
        setIsLoadingMatches(true)
        const { matches } = await getPotentialMatches()
        setMatches(matches)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load potential matches',
          variant: 'destructive',
        })
      } finally {
        setIsLoadingMatches(false)
      }
    }

    if (isAuthenticated) {
      fetchMatches()
    }
  }, [isAuthenticated, toast])

  const handleLike = async () => {
    if (currentMatchIndex >= matches.length) return

    const targetUser = matches[currentMatchIndex]
    setIsProcessingMatch(true)

    try {
      await createMatch(targetUser.user_id)
      toast({
        title: 'Match Request Sent',
        description: `You liked ${targetUser.name}!`,
      })
      setCurrentMatchIndex((prev) => prev + 1)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process your match request',
        variant: 'destructive',
      })
    } finally {
      setIsProcessingMatch(false)
    }
  }

  const handleDislike = () => {
    if (currentMatchIndex >= matches.length) return
    setCurrentMatchIndex((prev) => prev + 1)
  }

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  return (
    <div className='min-h-screen py-8 px-4 pb-20'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>
          Welcome, {user.profile.name}!
        </h1>

        {isLoadingMatches ? (
          <div className='flex justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : matches.length === 0 ? (
          <Card className='text-center py-12'>
            <CardContent>
              <h2 className='text-xl font-semibold mb-2'>
                No Matches Available
              </h2>
              <p className='text-muted-foreground'>
                There are no potential matches available at this time. Check
                back later!
              </p>
            </CardContent>
          </Card>
        ) : currentMatchIndex >= matches.length ? (
          <Card className='text-center py-12'>
            <CardContent>
              <h2 className='text-xl font-semibold mb-2'>No More Profiles</h2>
              <p className='text-muted-foreground'>
                You've gone through all potential matches. Check back later for
                more!
              </p>
              <Button className='mt-4' onClick={() => setCurrentMatchIndex(0)}>
                Start Over
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-6'>
            <div className='relative max-w-md mx-auto'>
              <Card className='overflow-hidden'>
                <div className='aspect-[3/4] bg-slate-200 relative'>
                  {matches[currentMatchIndex].photos &&
                  matches[currentMatchIndex].photos.length > 0 ? (
                    <img
                      src={matches[currentMatchIndex].photos[0]}
                      alt={matches[currentMatchIndex].name}
                      className='object-cover h-full w-full'
                    />
                  ) : (
                    <div className='flex items-center justify-center h-full bg-slate-200'>
                      <span className='text-slate-400'>No photo available</span>
                    </div>
                  )}
                </div>
                <CardContent className='p-4'>
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <h2 className='text-2xl font-bold'>
                        {matches[currentMatchIndex].name},{' '}
                        {matches[currentMatchIndex].age}
                      </h2>
                      {matches[currentMatchIndex].program && (
                        <p className='text-sm text-slate-500'>
                          {matches[currentMatchIndex].program}
                        </p>
                      )}
                    </div>
                    <span className='text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                      {matches[currentMatchIndex].distance} km away
                    </span>
                  </div>

                  <p className='mt-2'>{matches[currentMatchIndex].bio}</p>
                </CardContent>
              </Card>

              <div className='flex justify-center gap-4 mt-4'>
                <Button
                  size='lg'
                  variant='outline'
                  className='rounded-full p-3 h-14 w-14'
                  onClick={handleDislike}
                  disabled={isProcessingMatch}
                >
                  <X className='h-8 w-8 text-red-500' />
                </Button>
                <Button
                  size='lg'
                  className='rounded-full p-3 h-14 w-14 bg-gradient-to-r from-pink-500 to-rose-500'
                  onClick={handleLike}
                  disabled={isProcessingMatch}
                >
                  {isProcessingMatch ? (
                    <Loader2 className='h-8 w-8 animate-spin' />
                  ) : (
                    <Heart className='h-8 w-8' />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  )
}
