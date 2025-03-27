import { Faculty, Program, User } from "@/types";

export const FACULTIES: Faculty[] = [
  "Arts",
  "Engineering",
  "Environment",
  "Health",
  "Mathematics",
  "Science"
];

export const PROGRAMS: Record<Faculty, Program[]> = {
  "Arts": [
    "Anthropology",
    "Economics",
    "English Language and Literature",
    "Fine Arts",
    "History",
    "Peace and Conflict Studies",
    "Political Science",
    "Psychology",
    "Sociology"
  ],
  "Engineering": [
    "Architectural Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Engineering",
    "Electrical Engineering",
    "Environmental Engineering",
    "Management Engineering",
    "Mechanical Engineering",
    "Mechatronics Engineering",
    "Nanotechnology Engineering",
    "Software Engineering",
    "Systems Design Engineering"
  ],
  "Environment": [
    "Environmental Science",
    "Geography and Environmental Management",
    "Geomatics",
    "International Development",
    "Knowledge Integration",
    "Planning",
    "School of Environment, Resources and Sustainability"
  ],
  "Health": [
    "Health Studies",
    "Kinesiology",
    "Public Health",
    "Recreation and Leisure Studies"
  ],
  "Mathematics": [
    "Applied Mathematics",
    "Business Administration (Laurier) and Computer Science (Waterloo) Double Degree",
    "Business Administration (Laurier) and Mathematics (Waterloo) Double Degree",
    "Combinatorics and Optimization",
    "Computational Mathematics",
    "Computer Science",
    "Data Science",
    "Mathematical Economics",
    "Mathematical Finance",
    "Mathematical Optimization",
    "Mathematical Physics",
    "Mathematics Business",
    "Mathematics/Teaching",
    "Pure Mathematics",
    "Statistics"
  ],
  "Science": [
    "Biochemistry",
    "Biology",
    "Biomedical Sciences",
    "Chemistry",
    "Earth Sciences",
    "Life Physics",
    "Materials and Nanosciences",
    "Mathematical Physics",
    "Medicinal Chemistry",
    "Physics",
    "Physics and Astronomy",
    "Science and Aviation",
    "Science and Business"
  ]
};

export const INTERESTS = [
  "Movies", "Reading", "Gaming", "Hiking", "Photography",
  "Cooking", "Baking", "Travel", "Fitness", "Music",
  "Sports", "Dance", "Art", "Fashion", "Board Games",
  "Hackathons", "Programming", "Design", "Startups", "Research",
  "Math Competitions", "Debate", "Theater", "Volunteering", "Environment",
  "Social Justice", "Politics", "Anime", "Coffee", "Film",
  "Writing", "Podcasts", "Cycling", "Running", "Swimming",
  "Tennis", "Basketball", "Hockey", "Soccer", "Volleyball"
];

// Sample user photos - using placeholder URLs
const PLACEHOLDER_PHOTOS = [
  "https://ext.same-assets.com/3381471116/441290527.woff2", // Replace with actual photo URLs
  "https://ext.same-assets.com/3381471116/1080275477.woff2",
  "https://ext.same-assets.com/3381471116/61865286.woff2",
  "https://ext.same-assets.com/3381471116/282325022.woff2",
];

// Generate a set of mock users
export const generateMockUsers = (count: number): User[] => {
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const faculty = FACULTIES[Math.floor(Math.random() * FACULTIES.length)];
    const program = PROGRAMS[faculty][Math.floor(Math.random() * PROGRAMS[faculty].length)];
    const gender = ["Male", "Female", "Non-binary", "Other"][Math.floor(Math.random() * 4)] as "Male" | "Female" | "Non-binary" | "Other";

    // Generate some random interests (3-7)
    const interestCount = Math.floor(Math.random() * 5) + 3;
    const userInterests: string[] = [];
    for (let j = 0; j < interestCount; j++) {
      const interest = INTERESTS[Math.floor(Math.random() * INTERESTS.length)];
      if (!userInterests.includes(interest)) {
        userInterests.push(interest);
      }
    }

    // Generate lookingFor preferences (1-4)
    const lookingForCount = Math.floor(Math.random() * 4) + 1;
    const genderOptions = ["Male", "Female", "Non-binary", "Other"] as const;
    const lookingFor: ("Male" | "Female" | "Non-binary" | "Other")[] = [];

    for (let j = 0; j < lookingForCount; j++) {
      const preference = genderOptions[Math.floor(Math.random() * genderOptions.length)];
      if (!lookingFor.includes(preference)) {
        lookingFor.push(preference);
      }
    }

    // Generate 1-3 photos
    const photoCount = Math.floor(Math.random() * 3) + 1;
    const photos: string[] = [];
    for (let j = 0; j < photoCount; j++) {
      photos.push(PLACEHOLDER_PHOTOS[j % PLACEHOLDER_PHOTOS.length]);
    }

    users.push({
      id: `user-${i}`,
      name: `User ${i}`,
      age: Math.floor(Math.random() * 7) + 18, // Ages 18-25
      gender,
      faculty,
      program,
      year: Math.floor(Math.random() * 4) + 1, // Years 1-5
      bio: `I'm studying ${program} in the Faculty of ${faculty}. Looking forward to connecting with fellow UW students!`,
      interests: userInterests,
      photos,
      lookingFor,
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
    });
  }

  return users;
};

// Generate initial set of users
export const MOCK_USERS = generateMockUsers(30);
