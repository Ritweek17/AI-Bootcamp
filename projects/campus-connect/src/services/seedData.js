// Seed data for CampusConnect MVP
// Dates are calculated relative to the current date so upcoming and past views remain active

const getRelativeDate = (daysOffset, hours = 10, minutes = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  d.setHours(hours, minutes, 0, 0)
  return d.toISOString()
}

export const INITIAL_EVENTS = [
  {
    id: 'evt-001',
    title: 'HackCampus 2026: 36-Hour Student Hackathon',
    category: 'Hackathon',
    organizer: 'Campus Tech Club & Developer Student Society',
    organizerContact: 'hackcampus@campusconnect.demo',
    description:
      'Join fellow builders, designers, and innovators for our annual 36-hour campus hackathon. Form teams of up to four to build web, mobile, AI, or hardware prototypes. Mentors will host office hours throughout the weekend, with meals, collaborative workspaces, and project showcase awards included.',
    shortDescription:
      '36-hour flagship student hackathon with mentor office hours, meals, and project showcase awards.',
    startDate: getRelativeDate(3, 9, 0),
    endDate: getRelativeDate(4, 21, 0),
    registrationDeadline: getRelativeDate(2, 23, 59),
    venue: 'Student Innovation Complex — Main Atrium',
    isOnline: false,
    capacity: 250,
    registeredCount: 218,
    bannerUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Coding', 'AI', 'Prototyping', 'Hackathon'],
    fee: 'Free',
    featured: true,
    attendees: [
      {
        id: 'att-1',
        name: 'David Chen',
        email: 'david.c@campus.edu',
        studentId: 'STU-2023-1102',
        registeredAt: getRelativeDate(-5, 10, 0)
      },
      {
        id: 'att-2',
        name: 'Sarah Miller',
        email: 'sarah.m@campus.edu',
        studentId: 'STU-2024-4491',
        registeredAt: getRelativeDate(-4, 14, 30)
      },
      {
        id: 'att-3',
        name: 'Aarav Patel',
        email: 'aarav.p@campus.edu',
        studentId: 'STU-2022-7821',
        registeredAt: getRelativeDate(-3, 9, 15)
      }
    ]
  },
  {
    id: 'evt-002',
    title: 'Generative AI & Agentic Systems Workshop',
    category: 'Technology',
    organizer: 'AI & Robotics Society',
    organizerContact: 'ai.society@campusconnect.demo',
    description:
      'Hands-on technical session exploring modern LLM workflows, tool use, and structured evaluation. Bring your laptop—all starter notebooks and prompt templates are provided. Open to beginners and experienced developers alike.',
    shortDescription:
      'Hands-on technical workshop exploring LLM tool calling, workflows, and practical evaluation.',
    startDate: getRelativeDate(5, 14, 0),
    endDate: getRelativeDate(5, 17, 30),
    registrationDeadline: getRelativeDate(4, 23, 59),
    venue: 'Science Hall — Room 304',
    isOnline: false,
    capacity: 80,
    registeredCount: 74,
    bannerUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI', 'Python', 'Hands-on', 'Workshop'],
    fee: 'Free',
    featured: true,
    attendees: [
      {
        id: 'att-4',
        name: 'Elena Rostova',
        email: 'elena.r@campus.edu',
        studentId: 'STU-2023-9931',
        registeredAt: getRelativeDate(-2, 11, 0)
      }
    ]
  },
  {
    id: 'evt-003',
    title: 'Annual Campus Beats: Battle of the Bands',
    category: 'Cultural',
    organizer: 'Student Arts & Cultural Council',
    organizerContact: 'cultural.council@campusconnect.demo',
    description:
      'Eight student rock, indie, and jazz ensembles perform live on the central quad, followed by a sunset DJ set and local food trucks. Student ID entry includes open lawn seating and acoustic lounge access.',
    shortDescription:
      'Eight live student bands performing on the quad, followed by an evening DJ set and food trucks.',
    startDate: getRelativeDate(7, 17, 0),
    endDate: getRelativeDate(7, 23, 0),
    registrationDeadline: getRelativeDate(6, 18, 0),
    venue: 'Central Quad & Amphitheater',
    isOnline: false,
    capacity: 600,
    registeredCount: 412,
    bannerUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    tags: ['Music', 'Live Band', 'Arts', 'Festival'],
    fee: 'Free',
    featured: true,
    attendees: [
      {
        id: 'att-5',
        name: 'Marcus Brody',
        email: 'marcus.b@campus.edu',
        studentId: 'STU-2024-3321',
        registeredAt: getRelativeDate(-1, 16, 20)
      }
    ]
  },
  {
    id: 'evt-004',
    title: 'Inter-Departmental 3v3 Basketball Tournament',
    category: 'Sports',
    organizer: 'Campus Athletics & Recreation',
    organizerContact: 'athletics@campusconnect.demo',
    description:
      'Thirty-two student teams compete in a fast-paced double-elimination 3-on-3 basketball tournament. Spectators welcome on courtside bleachers. Water stations and tournament brackets managed on-site.',
    shortDescription:
      'Double-elimination 3v3 student basketball tournament with open spectator seating.',
    startDate: getRelativeDate(10, 10, 0),
    endDate: getRelativeDate(10, 18, 0),
    registrationDeadline: getRelativeDate(8, 20, 0),
    venue: 'Sports Pavilion — Courts 1 & 2',
    isOnline: false,
    capacity: 120,
    registeredCount: 88,
    bannerUrl:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    tags: ['Basketball', 'Tournament', 'Athletics'],
    fee: 'Free',
    featured: false,
    attendees: []
  },
  {
    id: 'evt-005',
    title: 'Tech & Engineering Career Fair 2026',
    category: 'Career',
    organizer: 'Campus Career Network',
    organizerContact: 'careers@campusconnect.demo',
    description:
      'Meet hiring teams across software engineering, data analytics, clean energy, and product design. Bring printed copies of your resume for on-the-spot portfolio reviews and internship conversations.',
    shortDescription:
      'Connect with engineering and product teams for internships, resume reviews, and graduate roles.',
    startDate: getRelativeDate(12, 11, 0),
    endDate: getRelativeDate(12, 16, 0),
    registrationDeadline: getRelativeDate(11, 12, 0),
    venue: 'Student Union — Grand Ballroom',
    isOnline: false,
    capacity: 500,
    registeredCount: 380,
    bannerUrl:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    tags: ['Careers', 'Internships', 'Networking'],
    fee: 'Free',
    featured: true,
    attendees: []
  },
  {
    id: 'evt-006',
    title: 'Design Systems & Figma Architecture Workshop',
    category: 'Workshop',
    organizer: 'Student Designers Guild',
    organizerContact: 'designguild@campusconnect.demo',
    description:
      'Learn how product teams organize design tokens, responsive auto-layout components, and accessible color contrast systems in Figma. Starter templates included for all registered attendees.',
    shortDescription:
      'Practical Figma session covering design tokens, component libraries, and accessibility.',
    startDate: getRelativeDate(14, 15, 0),
    endDate: getRelativeDate(14, 17, 30),
    registrationDeadline: getRelativeDate(13, 23, 59),
    venue: 'Design & Media Building — Studio 12',
    isOnline: false,
    capacity: 50,
    registeredCount: 50,
    bannerUrl:
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Figma', 'UI/UX', 'Design Systems'],
    fee: 'Free',
    featured: false,
    attendees: []
  },
  {
    id: 'evt-007',
    title: 'Robotics Combat & Autonomous Drone Showcase',
    category: 'Technology',
    organizer: 'Engineering Robotics Collective',
    organizerContact: 'robotics@campusconnect.demo',
    description:
      'Watch student-built combat bots compete inside the polycarbonate arena, followed by autonomous indoor drone obstacle flights and open hardware lab demonstrations.',
    shortDescription:
      'Student combat robotics tournament and autonomous indoor drone navigation showcase.',
    startDate: getRelativeDate(18, 13, 0),
    endDate: getRelativeDate(18, 18, 0),
    registrationDeadline: getRelativeDate(17, 18, 0),
    venue: 'Engineering Quad — Maker Arena',
    isOnline: false,
    capacity: 200,
    registeredCount: 142,
    bannerUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Robotics', 'Drones', 'Hardware'],
    fee: 'Free',
    featured: false,
    attendees: []
  },
  {
    id: 'evt-008',
    title: 'Campus Sustainability Ideathon & Summit',
    category: 'Workshop',
    organizer: 'Environmental Action Coalition',
    organizerContact: 'sustainability@campusconnect.demo',
    description:
      'A full-day collaborative summit focused on campus clean energy, zero-waste dining initiatives, and bike-share infrastructure. Student project teams will pitch proposals to the campus sustainability board.',
    shortDescription:
      'Collaborative summit pitching actionable campus sustainability and clean-energy initiatives.',
    startDate: getRelativeDate(21, 10, 0),
    endDate: getRelativeDate(21, 16, 0),
    registrationDeadline: getRelativeDate(20, 12, 0),
    venue: 'Natural Sciences — Auditorium 1',
    isOnline: false,
    capacity: 100,
    registeredCount: 45,
    bannerUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    tags: ['Sustainability', 'Climate', 'Ideation'],
    fee: 'Free',
    featured: false,
    attendees: []
  },
  {
    id: 'evt-009',
    title: 'Autumn Student Clubs & Societies Expo',
    category: 'Cultural',
    organizer: 'Student Activities Board',
    organizerContact: 'activities@campusconnect.demo',
    description:
      'Meet representatives from over 60 student clubs, intramural teams, and academic societies. Concluded earlier this term with live student demonstrations across the main lawn.',
    shortDescription:
      'Semester kickoff showcase featuring over 60 student clubs, societies, and intramural groups.',
    startDate: getRelativeDate(-4, 11, 0),
    endDate: getRelativeDate(-4, 15, 30),
    registrationDeadline: getRelativeDate(-5, 23, 59),
    venue: 'University Commons — North Plaza',
    isOnline: false,
    capacity: 400,
    registeredCount: 342,
    bannerUrl:
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    tags: ['Clubs', 'Orientation', 'Community'],
    fee: 'Free',
    featured: false,
    attendees: []
  }
]

export const CATEGORIES = [
  'All',
  'Technology',
  'Hackathon',
  'Cultural',
  'Sports',
  'Workshop',
  'Career'
]

export const DEFAULT_USER = {
  id: 'usr-demo-01',
  name: 'Alex Johnson',
  email: 'alex.j@campus.edu',
  studentId: 'STU-2024-8891',
  major: 'Computer Science & Engineering',
  year: 'Junior (3rd Year)',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
}
