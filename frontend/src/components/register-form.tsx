'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const currentYear = new Date().getFullYear()
const graduationYears = Array.from({ length: 7 }, (_, i) => currentYear + i)

const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required')
    .refine((email) => email.endsWith('@uwaterloo.ca'), {
      message: 'Must be a uwaterloo.ca email address',
    }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  age: z.coerce
    .number()
    .int()
    .min(18, 'You must be at least 18 years old')
    .max(99, 'Invalid age'),
  gender: z.string().min(1, 'Gender is required'),
  bio: z.string().optional(),
  program: z.string().optional(),
  graduation_year: z.coerce.number().optional(),
  interests: z.string().optional(),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const { register: registerUser } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      age: undefined,
      gender: '',
      bio: '',
      program: '',
      graduation_year: undefined,
      interests: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      await registerUser(data)
      toast({
        title: 'Success',
        description: 'Your account has been created successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to create account',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-lg mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>Create an Account</CardTitle>
        <CardDescription>
          Join Waterloo Tinder and connect with other students
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='name@uwaterloo.ca'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' {...register('password')} />
              {errors.password && (
                <p className='text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input id='name' type='text' {...register('name')} />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='age'>Age</Label>
              <Input
                id='age'
                type='number'
                min={18}
                max={99}
                {...register('age')}
              />
              {errors.age && (
                <p className='text-sm text-red-500'>{errors.age.message}</p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='gender'>Gender</Label>
              <Select onValueChange={(value) => setValue('gender', value)}>
                <SelectTrigger id='gender'>
                  <SelectValue placeholder='Select your gender' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Male'>Male</SelectItem>
                  <SelectItem value='Female'>Female</SelectItem>
                  <SelectItem value='Non-binary'>Non-binary</SelectItem>
                  <SelectItem value='Other'>Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className='text-sm text-red-500'>{errors.gender.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='program'>Program (Optional)</Label>
              <Input
                id='program'
                type='text'
                placeholder='e.g. Computer Science'
                {...register('program')}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='graduation_year'>
                Graduation Year (Optional)
              </Label>
              <Select
                onValueChange={(value) =>
                  setValue('graduation_year', parseInt(value))
                }
              >
                <SelectTrigger id='graduation_year'>
                  <SelectValue placeholder='Select year' />
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
            <div className='space-y-2'>
              <Label htmlFor='interests'>Interests (Optional)</Label>
              <Input
                id='interests'
                type='text'
                placeholder='e.g. Hiking, Movies, Coding'
                {...register('interests')}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='bio'>Bio (Optional)</Label>
            <Textarea
              id='bio'
              placeholder='Tell us a bit about yourself'
              className='resize-none'
              {...register('bio')}
            />
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button
            type='button'
            variant='outline'
            onClick={() => (window.location.href = '/login')}
          >
            Already have an account
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
