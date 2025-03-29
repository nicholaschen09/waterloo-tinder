export type Faculty =
  | 'Arts'
  | 'Engineering'
  | 'Environment'
  | 'Health'
  | 'Mathematics'
  | 'Science'

export type Program = string

export type User = {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Non-binary' | 'Other'
  faculty: Faculty
  program: Program
  year: number
  bio?: string
  interests: string[]
  photos: string[]
  lookingFor: ('Male' | 'Female' | 'Non-binary' | 'Other')[]
  lastActive?: Date
}

export type Match = {
  id: string
  userId: string
  matchedUserId: string
  timestamp: Date
  isRead: boolean
}

export type Message = {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  isRead: boolean
}

export type Swipe = {
  id: string
  swiperId: string
  swipedId: string
  direction: 'left' | 'right'
  timestamp: Date
}

export interface ChatPreview {
  user: User
  lastMessage: string
  timestamp: Date
  unread: boolean
}
