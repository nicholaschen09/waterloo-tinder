// User and Auth Types
export interface Profile {
  name: string
  age: number
  gender: string
  bio?: string
  program?: string
  graduation_year?: number
  interests?: string
  photos?: string[]
  latitude?: number
  longitude?: number
}

export interface User {
  _id: string
  email: string
  profile: Profile
}

export interface LoginResponse {
  access_token: string
  user_id: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData extends LoginData {
  name: string
  age: number
  gender: string
  bio?: string
  program?: string
  graduation_year?: number
  interests?: string
}

export interface UpdateProfileData {
  name: string
  age: number
  gender: string
  bio?: string
  program?: string
  graduation_year?: number
  interests?: string
  latitude?: number
  longitude?: number
}

// Match Types
export interface Match {
  user_id: string
  name: string
  age: number
  gender: string
  bio?: string
  program?: string
  graduation_year?: number
  interests?: string
  photos?: string[]
  match_status?: 'pending' | 'accepted' | 'rejected'
  distance: number // in kilometers
}

export interface MatchResponse {
  matches: Match[]
}

// Message Types
export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
}
