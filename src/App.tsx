import { useState, useEffect, useRef } from "react"
import AdminDashboard, { DiocesanSeal } from "./AdminDashboard"

// ===================== TYPES =====================
type AccountType = "parishioner" | "staff" | "admin"
type AppScreen = "select" | "login" | "signup" | "parishioner" | "staff" | "admin"
type ParishionerTab = "home" | "profile" | "records" | "services" | "requests" | "tracking" | "notifications" | "history" | "settings"
type StaffTab = "home" | "parishioners" | "schedule" | "requests" | "records" | "donations" | "notifications" | "reports" | "settings"
type RequestStatus = "pending" | "for-review" | "approved" | "completed" | "returned"
type ServiceType = "baptism" | "matrimony" | "confirmation" | "burial"

interface ServiceRequest {
  id: string
  type: ServiceType
  label: string
  submittedDate: string
  status: RequestStatus
  subjectName: string
  parish: string
  scheduleDate: string | null
  scheduleTime: string | null
  officiantName: string | null
  notes: string | null
  requirements: string[]
  trackingHistory: { date: string; status: string; note: string }[]
}

// ===================== MOCK DATA =====================
const DEMO_ACCOUNTS: Record<AccountType, {
  username: string
  password: string
}> = {
  parishioner: { username: "parishioner", password: "demo123" },
  staff: { username: "matersalutis", password: "demo123" },
  admin: { username: "admin.caceres", password: "demo123" },
}

const parishionerProfile = {
  name: "Joshua Pascual",
  dob: "March 14, 1992",
  gender: "Female",
  civilStatus: "Married",
  email: "mariareyes@email.com",
  phone: "+63 912 345 6789",
  address: "Blk 4, Lot 12, Peñafrancia Ave., Barrio Obrero, Naga City",
  barangay: "Barrio Obrero",
  parish: "Mater Salutis Parish",
  parishCode: "MSP-NGC-001",
  registeredSince: "January 2010",
  baptismalName: "Maria Esperanza",
  sponsor1: "Carmen Villanueva",
  sponsor2: "Roberto Reyes",
}

const parishionerProfilePhoto =
  "https://images.unsplash.com/photo-1543132220-3ec99c6094dc?auto=format&fit=crop&w=400&h=400&q=85"

const sacramentalRecords = [
  {
    type: "Baptism",
    date: "April 3, 1992",
    parish: "Mater Salutis Parish",
    officiant: "Rev. Fr. José Bernal",
    bookNo: "B-1992-014",
    pageNo: "47",
    entryNo: "12",
  },
  {
    type: "First Communion",
    date: "June 7, 2000",
    parish: "Mater Salutis Parish",
    officiant: "Rev. Fr. Carlos Mendoza",
    bookNo: "FC-2000-003",
    pageNo: "21",
    entryNo: "8",
  },
  {
    type: "Confirmation",
    date: "March 15, 2007",
    parish: "Cathedral Parish",
    officiant: "Most Rev. Leonardo Legaspi, OP",
    bookNo: "CNF-2007-011",
    pageNo: "63",
    entryNo: "31",
  },
  {
    type: "Matrimony",
    date: "February 14, 2015",
    parish: "Mater Salutis Parish",
    officiant: "Rev. Fr. Eduardo Santos",
    bookNo: "M-2015-002",
    pageNo: "09",
    entryNo: "5",
  },
]

const initialRequests: ServiceRequest[] = [
  {
    id: "ACROSS-2026-00141",
    type: "baptism",
    label: "Baptism – Infant",
    submittedDate: "Nov 12, 2026",
    status: "approved",
    subjectName: "Joshua Pascual",
    parish: "Mater Salutis Parish",
    scheduleDate: "December 7, 2026",
    scheduleTime: "10:00 AM",
    officiantName: "Rev. Fr. Eduardo Santos",
    notes:
      "Please arrive 30 minutes before the scheduled time. Bring original NSO Birth Certificate, 2 godparents with valid IDs.",
    requirements: [
      "Birth Certificate (NSO/PSA)",
      "Parents' Marriage Certificate",
      "Baptismal Sponsors List",
    ],
    trackingHistory: [
      {
        date: "Nov 12, 2026 – 09:14 AM",
        status: "Submitted",
        note: "Request submitted and received by the parish.",
      },
      {
        date: "Nov 13, 2026 – 02:30 PM",
        status: "For Review",
        note: "Requirements are being reviewed by parish staff.",
      },
      {
        date: "Nov 15, 2026 – 10:00 AM",
        status: "Approved",
        note: "Request approved. Schedule assigned: Dec 7, 2026 at 10:00 AM.",
      },
    ],
  },
  {
    id: "ACROSS-2026-00142",
    type: "confirmation",
    label: "Confirmation Record Request",
    submittedDate: "Nov 18, 2026",
    status: "for-review",
    subjectName: "Joshua Pascual",
    parish: "Mater Salutis Parish",
    scheduleDate: null,
    scheduleTime: null,
    officiantName: null,
    notes: null,
    requirements: ["Baptismal Certificate", "First Communion Certificate"],
    trackingHistory: [
      {
        date: "Nov 18, 2026 – 11:20 AM",
        status: "Submitted",
        note: "Request submitted and received by the parish.",
      },
      {
        date: "Nov 19, 2026 – 09:00 AM",
        status: "For Review",
        note: "Staff is reviewing attached requirements.",
      },
    ],
  },
  {
    id: "ACROSS-2026-00143",
    type: "matrimony",
    label: "Marriage – Canonical Investigation",
    submittedDate: "Oct 30, 2026",
    status: "completed",
    subjectName: "Joshua Pascual",
    parish: "Mater Salutis Parish",
    scheduleDate: "November 15, 2026",
    scheduleTime: "9:00 AM",
    officiantName: "Rev. Fr. Eduardo Santos",
    notes:
      "Canonical investigation completed. Pre-Cana seminar certificates submitted.",
    requirements: [
      "Baptismal Certificate",
      "Confirmation Certificate",
      "Pre-Cana Seminar Certificate",
      "CENOMAR",
    ],
    trackingHistory: [
      {
        date: "Oct 30, 2026 – 08:00 AM",
        status: "Submitted",
        note: "Request submitted.",
      },
      {
        date: "Oct 31, 2026 – 01:00 PM",
        status: "For Review",
        note: "Documents under review.",
      },
      {
        date: "Nov 2, 2026 – 10:30 AM",
        status: "Approved",
        note: "Canonical investigation schedule confirmed.",
      },
      {
        date: "Nov 15, 2026 – 11:00 AM",
        status: "Completed",
        note: "Canonical investigation completed successfully.",
      },
    ],
  },
]

const staffRequests: ServiceRequest & {
  parishionerEmail?: string
  contactNo?: string
  reviewer?: string
}[] = [
  {
    id: "ACROSS-2026-00521",
    type: "baptism",
    label: "Baptism – Infant",
    submittedDate: "Nov 22, 2026",
    status: "pending",
    subjectName: "Sofia Marie Gonzales",
    parish: "Mater Salutis Parish",
    scheduleDate: null,
    scheduleTime: null,
    officiantName: null,
    notes: null,
    requirements: [
      "Birth Certificate",
      "Parents' Marriage Certificate",
      "Godparents' List",
    ],
    trackingHistory: [
      {
        date: "Nov 22, 2026 – 10:05 AM",
        status: "Submitted",
        note: "Awaiting staff review.",
      },
    ],
    parishionerEmail: "ana.gonzales@email.com",
    contactNo: "+63 917 823 4561",
  },
  {
    id: "ACROSS-2026-00522",
    type: "burial",
    label: "Burial Mass",
    submittedDate: "Nov 22, 2026",
    status: "pending",
    subjectName: "Rodrigo Santos Mendoza",
    parish: "Mater Salutis Parish",
    scheduleDate: null,
    scheduleTime: null,
    officiantName: null,
    notes: null,
    requirements: [
      "Death Certificate",
      "Baptismal Certificate of Deceased",
      "Letter of Request",
    ],
    trackingHistory: [
      {
        date: "Nov 22, 2026 – 11:30 AM",
        status: "Submitted",
        note: "Urgent – immediate response needed.",
      },
    ],
    parishionerEmail: "carlos.mendoza@email.com",
    contactNo: "+63 920 134 5678",
  },
  {
    id: "ACROSS-2026-00498",
    type: "matrimony",
    label: "Marriage – Pre-Cana & Banns",
    submittedDate: "Nov 18, 2026",
    status: "for-review",
    subjectName: "Roberto Villanueva & Carmen Dela Cruz",
    parish: "Mater Salutis Parish",
    scheduleDate: null,
    scheduleTime: null,
    officiantName: null,
    notes: null,
    requirements: [
      "Baptismal Certificates (Both)",
      "CENOMAR (Both)",
      "Pre-Cana Certificate",
      "Confirmation Certificates",
    ],
    trackingHistory: [
      {
        date: "Nov 18, 2026 – 09:00 AM",
        status: "Submitted",
        note: "Request received.",
      },
      {
        date: "Nov 19, 2026 – 10:00 AM",
        status: "For Review",
        note: "Documents under review.",
      },
    ],
    parishionerEmail: "roberto.v@email.com",
    contactNo: "+63 918 765 4321",
    reviewer: "Sec. Lourdes Casas",
  },
  {
    id: "ACROSS-2026-00341",
    type: "baptism",
    label: "Baptism – Infant",
    submittedDate: "Nov 12, 2026",
    status: "approved",
    subjectName: "Lucas Miguel Reyes",
    parish: "Mater Salutis Parish",
    scheduleDate: "December 7, 2026",
    scheduleTime: "10:00 AM",
    officiantName: "Rev. Fr. Eduardo Santos",
    notes: "Approved. Schedule confirmed.",
    requirements: [
      "Birth Certificate",
      "Marriage Certificate",
      "Godparents' List",
    ],
    trackingHistory: [
      {
        date: "Nov 12, 2026 – 09:14 AM",
        status: "Submitted",
        note: "Request submitted.",
      },
      {
        date: "Nov 15, 2026 – 10:00 AM",
        status: "Approved",
        note: "Approved. Schedule assigned.",
      },
    ],
    parishionerEmail: "mariareyes@email.com",
    contactNo: "+63 912 345 6789",
    reviewer: "Sec. Lourdes Casas",
  },
  {
    id: "ACROSS-2026-00412",
    type: "confirmation",
    label: "Confirmation Record Request",
    submittedDate: "Nov 18, 2026",
    status: "for-review",
    subjectName: "Maria Clara Reyes",
    parish: "Mater Salutis Parish",
    scheduleDate: null,
    scheduleTime: null,
    officiantName: null,
    notes: null,
    requirements: ["Baptismal Certificate", "First Communion Certificate"],
    trackingHistory: [
      {
        date: "Nov 18, 2026 – 11:20 AM",
        status: "Submitted",
        note: "Request submitted.",
      },
      {
        date: "Nov 19, 2026 – 09:00 AM",
        status: "For Review",
        note: "Under review.",
      },
    ],
    parishionerEmail: "mariareyes@email.com",
    contactNo: "+63 912 345 6789",
  },
]

const parishionerDirectory = [
  {
    id: "P-001",
    name: "Maria Esperanza Reyes",
    barangay: "Barrio Obrero",
    registered: "Jan 2010",
    status: "Active",
    records: 4,
  },
  {
    id: "P-002",
    name: "Roberto Dela Cruz",
    barangay: "Abella",
    registered: "Mar 2015",
    status: "Active",
    records: 3,
  },
  {
    id: "P-003",
    name: "Ana Lorena Santos",
    barangay: "Triangulo",
    registered: "Aug 2012",
    status: "Active",
    records: 5,
  },
  {
    id: "P-004",
    name: "Carlos Miguel Villanueva",
    barangay: "Concepcion Pequeña",
    registered: "Jun 2018",
    status: "Active",
    records: 2,
  },
  {
    id: "P-005",
    name: "Luisa Fernanda Gonzales",
    barangay: "Barrio Obrero",
    registered: "Feb 2009",
    status: "Active",
    records: 6,
  },
  {
    id: "P-006",
    name: "Jose Antonio Perez",
    barangay: "Dinaga",
    registered: "Nov 2020",
    status: "Active",
    records: 1,
  },
  {
    id: "P-007",
    name: "Carmen Alicia Buela",
    barangay: "Igualdad",
    registered: "Apr 2016",
    status: "Inactive",
    records: 3,
  },
  {
    id: "P-008",
    name: "Manuel Jesus Dacera",
    barangay: "Lerma",
    registered: "Jan 2011",
    status: "Active",
    records: 4,
  },
]

const notifications = [
  {
    id: 1,
    unread: true,
    type: "approved",
    title: "Request Approved",
    message:
      "Your Baptism request for Lucas Miguel Reyes has been approved. Schedule: Dec 7, 2026 at 10:00 AM.",
    time: "2 hours ago",
    icon: "✓",
  },
  {
    id: 2,
    unread: true,
    type: "info",
    title: "Reminder: Requirements Needed",
    message:
      "Please upload your Confirmation Certificate for request ACROSS-2026-00412.",
    time: "1 day ago",
    icon: "📎",
  },
  {
    id: 3,
    unread: false,
    type: "completed",
    title: "Transaction Completed",
    message:
      "Your Marriage Canonical Investigation (ACROSS-2026-00298) has been completed.",
    time: "1 week ago",
    icon: "✅",
  },
  {
    id: 4,
    unread: false,
    type: "announcement",
    title: "Parish Announcement",
    message:
      "The parish will celebrate its Fiesta on December 8, 2026 (Feast of the Immaculate Conception).",
    time: "2 weeks ago",
    icon: "📢",
  },
]

const staffNotifications = [
  {
    id: 1,
    unread: true,
    type: "new",
    title: "New Service Request",
    message:
      "A new Burial Mass request has been submitted by Carlos Mendoza (ACROSS-2026-00522). Marked urgent.",
    time: "30 min ago",
    icon: "🆕",
  },
  {
    id: 2,
    unread: true,
    type: "new",
    title: "New Service Request",
    message:
      "Baptism request submitted for Sofia Marie Gonzales (ACROSS-2026-00521).",
    time: "2 hours ago",
    icon: "🆕",
  },
  {
    id: 3,
    unread: false,
    type: "report",
    title: "Report Due",
    message:
      "November Monthly Report is due in 3 days. Please submit on time to avoid a Late status.",
    time: "1 day ago",
    icon: "📊",
  },
  {
    id: 4,
    unread: false,
    type: "system",
    title: "System Update",
    message:
      "ACROSS system will undergo maintenance on November 25, 2026, 11 PM – 2 AM.",
    time: "2 days ago",
    icon: "⚙️",
  },
]

const parishEvents = [
  {
    day: 1,
    date: "Sep 1, 2026",
    time: "6:30 PM",
    title: "Parish Pastoral Council Meeting",
    location: "Parish Conference Hall",
    type: "Meeting",
    icon: "users",
  },
  {
    day: 5,
    date: "Sep 5, 2026",
    time: "9:00 AM",
    title: "Baptism Orientation",
    location: "Formation Room",
    type: "Formation",
    icon: "droplet",
  },
  {
    day: 8,
    date: "Sep 8, 2026",
    time: "6:00 PM",
    title: "Nativity of the Blessed Virgin Mary Mass",
    location: "Main Church",
    type: "Liturgy",
    icon: "church",
  },
  {
    day: 12,
    date: "Sep 12, 2026",
    time: "7:00 AM",
    title: "Our Lady of Salvation Parish Fiesta",
    location: "Mater Salutis Parish Grounds",
    type: "Parish Feast",
    icon: "church",
  },
  {
    day: 13,
    date: "Sep 13, 2026",
    time: "1:30 PM",
    title: "Confirmation Catechism",
    location: "Catechetical Center",
    type: "Formation",
    icon: "book",
  },
  {
    day: 19,
    date: "Sep 19, 2026",
    time: "4:00 PM",
    title: "Our Lady of Peñafrancia Celebration",
    location: "Main Church & Procession Route",
    type: "Archdiocesan",
    icon: "landmark",
  },
  {
    day: 26,
    date: "Sep 26, 2026",
    time: "8:00 AM",
    title: "Pre-Cana Seminar",
    location: "Parish Function Hall",
    type: "Formation",
    icon: "heart",
  },
]

const scheduledParishServices = [
  {
    day: 6,
    date: "Sep 6, 2026",
    time: "10:00 AM",
    title: "Baptism · Sofia Marie Gonzales",
    location: "Baptistry · Fr. Eduardo Santos",
    type: "Scheduled Service",
    icon: "droplet",
  },
  {
    day: 14,
    date: "Sep 14, 2026",
    time: "2:00 PM",
    title: "Communion · Youth Catechism Group",
    location: "Main Church · Fr. Eduardo Santos",
    type: "Scheduled Service",
    icon: "cup",
  },
  {
    day: 20,
    date: "Sep 20, 2026",
    time: "9:00 AM",
    title: "Matrimony · Roberto V. & Carmen D.",
    location: "Main Church · Fr. Eduardo Santos",
    type: "Scheduled Service",
    icon: "heart",
  },
  {
    day: 27,
    date: "Sep 27, 2026",
    time: "3:00 PM",
    title: "Memorial Liturgy · Mendoza Family",
    location: "Main Church · Fr. Eduardo Santos",
    type: "Scheduled Service",
    icon: "church",
  },
]

const parishCalendarItems = [...parishEvents, ...scheduledParishServices].sort(
  (a, b) => a.day - b.day,
)

type StaffReportCategory = "Census" | "Sacramental Records" | "Offertory & Collections" | "Parish Records" | "Ministries" | "Assets & Maintenance"
type DonationCategory = "Cash" | "Food" | "Other"

interface DonationRecord {
  id: string
  dateKey: string
  dateLabel: string
  timeLabel: string
  donorName: string
  isAnonymous: boolean
  contactInfo: string
  category: DonationCategory
  description: string
  subDetail: string
  quantityOrAmount: string
  cashAmount?: number
  goodsCount?: number
  paymentMethod?: string
  foodType?: string
  condition?: string
  notes?: string
  staffHandler: string
}

const initialDonations: DonationRecord[] = [
  // October 26, 2026
  {
    id: "DON-2026-1026-01",
    dateKey: "2026-10-26",
    dateLabel: "October 26, 2026",
    timeLabel: "10:15 AM",
    donorName: "Sunday Parish Assembly",
    isAnonymous: false,
    contactInfo: "matersalutis@caceres.ph",
    category: "Cash",
    description: "Sunday Morning Cash Collection",
    subDetail: "Payment Method: Cash Offertory Basket",
    quantityOrAmount: "₱1,250.00",
    cashAmount: 1250,
    paymentMethod: "Cash",
    notes:
      "Counted and verified by parish finance committee after the 9:30 AM Solemn Mass.",
    staffHandler: "Sec. Lourdes Casas",
  },
  {
    id: "DON-2026-1026-02",
    dateKey: "2026-10-26",
    dateLabel: "October 26, 2026",
    timeLabel: "01:40 PM",
    donorName: "Elena & Marco Bautista",
    isAnonymous: false,
    contactInfo: "+63 917 440 8921",
    category: "Food",
    description: "45 cans of soup",
    subDetail: "Non-Perishable Canned Goods · Outreach Pantry Drive",
    quantityOrAmount: "45 cans",
    goodsCount: 45,
    foodType: "Canned Goods",
    notes:
      "Assorted vegetable and chicken noodle soup cans for the St. Martin de Porres Soup Kitchen.",
    staffHandler: "Sec. Lourdes Casas",
  },
  // October 25, 2026
  {
    id: "DON-2026-1025-01",
    dateKey: "2026-10-25",
    dateLabel: "October 25, 2026",
    timeLabel: "09:30 AM",
    donorName: "Dr. Antonio & Dra. Teresita Salazar",
    isAnonymous: false,
    contactInfo: "antonio.salazar@email.com",
    category: "Cash",
    description: "Cash check tithe (#4082)",
    subDetail: "Payment Method: Check · Monthly Parish Tithe",
    quantityOrAmount: "₱500.00",
    cashAmount: 500,
    paymentMethod: "Check",
    notes:
      "Designated for general parish operations and Archdiocesan seminary support.",
    staffHandler: "Sec. Lourdes Casas",
  },
  {
    id: "DON-2026-1025-02",
    dateKey: "2026-10-25",
    dateLabel: "October 25, 2026",
    timeLabel: "11:45 AM",
    donorName: "San Isidro Labrador Farmers Guild",
    isAnonymous: false,
    contactInfo: "+63 918 602 3319",
    category: "Food",
    description: "3 crates of fresh produce",
    subDetail: "Fresh Harvest Produce · Community Feeding Program",
    quantityOrAmount: "3 crates",
    goodsCount: 3,
    foodType: "Fresh Produce",
    notes:
      "Fresh squash, tomatoes, and leafy greens harvested for the weekend barangay feeding ministry.",
    staffHandler: "Bro. Tomas Imperial",
  },
  {
    id: "DON-2026-1025-03",
    dateKey: "2026-10-25",
    dateLabel: "October 25, 2026",
    timeLabel: "03:10 PM",
    donorName: "Sta. Martha Parish Kitchen Guild",
    isAnonymous: false,
    contactInfo: "+63 919 845 1102",
    category: "Food",
    description: "12 bottles of cooking oil",
    subDetail: "Pantry Staples & Cooking Oil · Parish Relief Drive",
    quantityOrAmount: "12 bottles",
    goodsCount: 12,
    foodType: "Canned Goods",
    notes:
      "1-liter sealed vegetable cooking oil bottles for community family food packs.",
    staffHandler: "Sec. Lourdes Casas",
  },
  // October 24, 2026
  {
    id: "DON-2026-1024-01",
    dateKey: "2026-10-24",
    dateLabel: "October 24, 2026",
    timeLabel: "08:50 AM",
    donorName: "Familia Villanueva-Reyes",
    isAnonymous: false,
    contactInfo: "+63 912 345 6789",
    category: "Other",
    description: "1 box of altar linens and candles",
    subDetail:
      "Liturgical & Sanctuary Goods · Embroidered Purificators & Beeswax Candles",
    quantityOrAmount: "1 box",
    goodsCount: 1,
    notes:
      "Hand-sewn linen corporals, purificators, and 12 liturgical beeswax altar candles for November feasts.",
    staffHandler: "Sec. Lourdes Casas",
  },
  {
    id: "DON-2026-1024-02",
    dateKey: "2026-10-24",
    dateLabel: "October 24, 2026",
    timeLabel: "02:15 PM",
    donorName: "Anonymous",
    isAnonymous: true,
    contactInfo: "Anonymous Parishioner",
    category: "Cash",
    description: "Cash mass intention offering",
    subDetail: "Payment Method: Cash · All Souls Novena Intentions",
    quantityOrAmount: "₱150.00",
    cashAmount: 150,
    paymentMethod: "Cash",
    notes: "Thanksgiving and eternal repose mass intentions for November.",
    staffHandler: "Sec. Lourdes Casas",
  },
  // Earlier October 2026 entries
  {
    id: "DON-2026-1018-01",
    dateKey: "2026-10-18",
    dateLabel: "October 18, 2026",
    timeLabel: "10:30 AM",
    donorName: "Mission Sunday Parish Collection",
    isAnonymous: false,
    contactInfo: "matersalutis@caceres.ph",
    category: "Cash",
    description: "World Mission Sunday Offertory & Second Collection",
    subDetail: "Payment Method: Cash & Envelopes",
    quantityOrAmount: "₱1,300.00",
    cashAmount: 1300,
    paymentMethod: "Cash",
    notes:
      "Includes Sunday mass collections and missionary propagation envelopes.",
    staffHandler: "Sec. Lourdes Casas",
  },
  {
    id: "DON-2026-1012-01",
    dateKey: "2026-10-12",
    dateLabel: "October 12, 2026",
    timeLabel: "02:00 PM",
    donorName: "Knights of Columbus Council #4190",
    isAnonymous: false,
    contactInfo: "kofc.naga@caceres.ph",
    category: "Food",
    description: "35 packs of fortified rice & noodles",
    subDetail: "Dry Grains & Rice · Barangay Nutrition Drive",
    quantityOrAmount: "35 packs",
    goodsCount: 35,
    foodType: "Dry Grains & Rice",
    notes: "Prepared for 35 indigent families in Barrio Obrero.",
    staffHandler: "Bro. Tomas Imperial",
  },
  {
    id: "DON-2026-1005-01",
    dateKey: "2026-10-05",
    dateLabel: "October 5, 2026",
    timeLabel: "04:15 PM",
    donorName: "Catholic Women's League – Mater Salutis",
    isAnonymous: false,
    contactInfo: "cwl.matersalutis@caceres.ph",
    category: "Other",
    description: "7 Choir Hymnals & Lectionary Covers",
    subDetail: "Liturgical Books & Vestments",
    quantityOrAmount: "7 items",
    goodsCount: 7,
    notes: "For the parish liturgical music ministry and lectors guild.",
    staffHandler: "Sec. Lourdes Casas",
  },
  // September 2026 entries
  {
    id: "DON-2026-0920-01",
    dateKey: "2026-09-20",
    dateLabel: "September 20, 2026",
    timeLabel: "11:00 AM",
    donorName: "Peñafrancia Fiesta Pilgrims & Devotees",
    isAnonymous: false,
    contactInfo: "matersalutis@caceres.ph",
    category: "Cash",
    description: "Peñafrancia Octave Thanksgiving Offertory",
    subDetail: "Payment Method: Cash & Check Offerings",
    quantityOrAmount: "₱1,950.00",
    cashAmount: 1950,
    paymentMethod: "Cash",
    notes: "Special fiesta Sunday thanksgiving collections.",
    staffHandler: "Sec. Lourdes Casas",
  },
  {
    id: "DON-2026-0915-01",
    dateKey: "2026-09-15",
    dateLabel: "September 15, 2026",
    timeLabel: "09:20 AM",
    donorName: "Anonymous",
    isAnonymous: true,
    contactInfo: "Anonymous Parishioner",
    category: "Cash",
    description: "Our Lady of Salvation Fiesta Sponsorship",
    subDetail: "Payment Method: Bank Transfer",
    quantityOrAmount: "₱850.00",
    cashAmount: 850,
    paymentMethod: "Bank Transfer",
    notes:
      "For floral arrangements and liturgical music during the parish fiesta.",
    staffHandler: "Sec. Lourdes Casas",
  },
  {
    id: "DON-2026-0912-01",
    dateKey: "2026-09-12",
    dateLabel: "September 12, 2026",
    timeLabel: "01:15 PM",
    donorName: "Bicol Harvest Benefactors Association",
    isAnonymous: false,
    contactInfo: "+63 917 310 5542",
    category: "Food",
    description: "70 lbs of milled white rice & canned goods",
    subDetail: "Dry Grains & Rice · Fiesta Charity Agape",
    quantityOrAmount: "70 lbs",
    goodsCount: 70,
    foodType: "Dry Grains & Rice",
    notes:
      "Distributed during the Our Lady of Salvation Patronal Fiesta community meal.",
    staffHandler: "Bro. Tomas Imperial",
  },
  {
    id: "DON-2026-0908-01",
    dateKey: "2026-09-08",
    dateLabel: "September 8, 2026",
    timeLabel: "03:45 PM",
    donorName: "Marian Youth Ministry",
    isAnonymous: false,
    contactInfo: "youth.matersalutis@caceres.ph",
    category: "Food",
    description: "40 bottles of fruit juice & snacks",
    subDetail: "Beverages · Children's Catechetical Outreach",
    quantityOrAmount: "40 bottles",
    goodsCount: 40,
    foodType: "Beverages",
    notes: "For the Nativity of the Blessed Virgin Mary children's gathering.",
    staffHandler: "Sec. Lourdes Casas",
  },
  {
    id: "DON-2026-0905-01",
    dateKey: "2026-09-05",
    dateLabel: "September 5, 2026",
    timeLabel: "10:00 AM",
    donorName: "Apostolado ng Panalangin",
    isAnonymous: false,
    contactInfo: "+63 920 882 1940",
    category: "Other",
    description: "6 Processional Lanterns & Altar Cloths",
    subDetail: "Liturgical Procession Equipment",
    quantityOrAmount: "6 items",
    goodsCount: 6,
    notes: "Used for the dawn Marian rosary processions.",
    staffHandler: "Sec. Lourdes Casas",
  },
  // Earlier 2026 entries (Jan–Aug 2026)
  {
    id: "DON-2026-0815-01",
    dateKey: "2026-08-15",
    dateLabel: "August 15, 2026",
    timeLabel: "10:30 AM",
    donorName: "Assumption Feast Parish Offertory & Benefactors",
    isAnonymous: false,
    contactInfo: "matersalutis@caceres.ph",
    category: "Cash",
    description: "Q1–Q3 Cumulative Parish Tithes & Special Collections",
    subDetail: "Payment Method: Cash, Check & Online Giving",
    quantityOrAmount: "₱12,500.00",
    cashAmount: 12500,
    paymentMethod: "Cash",
    notes:
      "Consolidated parish collections, Lenten charity drive, and roof restoration pledges (Jan–Aug 2026).",
    staffHandler: "Sec. Lourdes Casas",
  },
  {
    id: "DON-2026-0510-01",
    dateKey: "2026-05-10",
    dateLabel: "May 10, 2026",
    timeLabel: "02:00 PM",
    donorName: "Caritas Caceres & Parish Food Bank Drives",
    isAnonymous: false,
    contactInfo: "caritas@caceres.ph",
    category: "Food",
    description: "245 lbs of assorted relief goods, rice & canned food",
    subDetail: "Seasonal Relief & Pantry Stockpiles (Jan–Aug 2026)",
    quantityOrAmount: "245 lbs",
    goodsCount: 245,
    foodType: "Dry Grains & Rice",
    notes: "Combined Lenten Alay Kapwa and Brigada Pantry food packs.",
    staffHandler: "Bro. Tomas Imperial",
  },
  {
    id: "DON-2026-0402-01",
    dateKey: "2026-04-02",
    dateLabel: "April 2, 2026",
    timeLabel: "09:15 AM",
    donorName: "Holy Week Liturgical Guild",
    isAnonymous: false,
    contactInfo: "+63 917 550 2310",
    category: "Other",
    description: "21 Sanctuary Vestments, Thuribles & Folding Chairs",
    subDetail: "Parish Sacristy & Hall Equipment (Jan–Aug 2026)",
    quantityOrAmount: "21 items",
    goodsCount: 21,
    notes: "Donated ahead of the Paschal Triduum liturgies.",
    staffHandler: "Sec. Lourdes Casas",
  },
  // 2025 Annual Archive entries
  {
    id: "DON-2025-1224-01",
    dateKey: "2025-12-24",
    dateLabel: "December 24, 2025",
    timeLabel: "09:00 PM",
    donorName: "Simbang Gabi & Christmas Eve Congregation",
    isAnonymous: false,
    contactInfo: "matersalutis@caceres.ph",
    category: "Cash",
    description: "2025 Annual Offertory, Aguinaldo Masses & Tithes",
    subDetail: "Payment Method: Cash & Check Collections",
    quantityOrAmount: "₱9,800.00",
    cashAmount: 9800,
    paymentMethod: "Cash",
    notes: "Christmas novena masses and annual parish stewardship collections.",
    staffHandler: "Sec. Lourdes Casas",
  },
  {
    id: "DON-2025-1019-01",
    dateKey: "2025-10-19",
    dateLabel: "October 19, 2025",
    timeLabel: "11:20 AM",
    donorName: "Anonymous",
    isAnonymous: true,
    contactInfo: "Anonymous Parishioner",
    category: "Cash",
    description: "2025 Belfry Sound System & Sanctuary Renovation Grant",
    subDetail: "Payment Method: Check",
    quantityOrAmount: "₱6,400.00",
    cashAmount: 6400,
    paymentMethod: "Check",
    notes:
      "Annual capital donation for church acoustics and sanctuary lighting.",
    staffHandler: "Sec. Lourdes Casas",
  },
  {
    id: "DON-2025-1130-01",
    dateKey: "2025-11-30",
    dateLabel: "November 30, 2025",
    timeLabel: "01:30 PM",
    donorName: "St. Vincent de Paul Parish Relief Drive",
    isAnonymous: false,
    contactInfo: "ssvp.matersalutis@caceres.ph",
    category: "Food",
    description: "380 lbs/items of rice, canned sardines, and bottled water",
    subDetail: "Annual Typhoon Relief & Advent Food Baskets (2025)",
    quantityOrAmount: "380 lbs/items",
    goodsCount: 380,
    foodType: "Canned Goods",
    notes: "Distributed to 190 households during the 2025 Advent outreach.",
    staffHandler: "Bro. Tomas Imperial",
  },
  {
    id: "DON-2025-0912-01",
    dateKey: "2025-09-12",
    dateLabel: "September 12, 2025",
    timeLabel: "03:00 PM",
    donorName: "Mater Salutis Parish Pastoral Council",
    isAnonymous: false,
    contactInfo: "ppc.matersalutis@caceres.ph",
    category: "Other",
    description: "28 Altar Linens, Brass Candlesticks & Catechetical Kits",
    subDetail: "2025 Sacristy & Catechetical Material Donations",
    quantityOrAmount: "28 other items",
    goodsCount: 28,
    notes: "Logged and inventoried in the 2025 parish property register.",
    staffHandler: "Sec. Lourdes Casas",
  },
]
interface StaffReport {
  id: string
  title: string
  category: StaffReportCategory
  period: string
  dueDate: string
  submittedDate: string | null
  status: "submitted" | "pending" | "late" | "returned"
  summary: string
  baptisms: number | null
  matrimony: number | null
  confirmations: number | null
  burials: number | null
  total: number | null
}

const archdioceseReports: StaffReport[] = [
  {
    id: "RPT-2026-Q3-CEN",
    title: "Quarterly Parish Census",
    category: "Census",
    period: "3rd Quarter 2026",
    dueDate: "Oct 10, 2026",
    submittedDate: "Oct 6, 2026",
    status: "submitted",
    summary: "4,820 parishioners · 1,204 households · 186 new registrations",
    baptisms: null,
    matrimony: null,
    confirmations: null,
    burials: null,
    total: null,
  },
  {
    id: "RPT-2026-Q3-SAC",
    title: "Quarterly Sacramental Records",
    category: "Sacramental Records",
    period: "3rd Quarter 2026",
    dueDate: "Oct 5, 2026",
    submittedDate: "Oct 3, 2026",
    status: "submitted",
    summary: "60 sacramental records entered and verified",
    baptisms: 9,
    matrimony: 2,
    confirmations: 45,
    burials: 4,
    total: 60,
  },
  {
    id: "RPT-2026-Q4-SAC",
    title: "November Sacramental Records",
    category: "Sacramental Records",
    period: "November 2026",
    dueDate: "Dec 5, 2026",
    submittedDate: null,
    status: "pending",
    summary: "Monthly registry totals awaiting submission",
    baptisms: null,
    matrimony: null,
    confirmations: null,
    burials: null,
    total: null,
  },
  {
    id: "RPT-2026-SEP-COL",
    title: "September Offertory & Collections",
    category: "Offertory & Collections",
    period: "September 2026",
    dueDate: "Oct 10, 2026",
    submittedDate: "Oct 8, 2026",
    status: "submitted",
    summary:
      "Sunday offertory, special collections, donations, and parish fund deposits",
    baptisms: null,
    matrimony: null,
    confirmations: null,
    burials: null,
    total: null,
  },
  {
    id: "RPT-2026-OCT-COL",
    title: "October Offertory & Collections",
    category: "Offertory & Collections",
    period: "October 2026",
    dueDate: "Nov 10, 2026",
    submittedDate: null,
    status: "pending",
    summary: "Weekly collections and deposit reconciliation in progress",
    baptisms: null,
    matrimony: null,
    confirmations: null,
    burials: null,
    total: null,
  },
  {
    id: "RPT-2026-Q3-REG",
    title: "Quarterly Parish Registry Audit",
    category: "Parish Records",
    period: "3rd Quarter 2026",
    dueDate: "Oct 15, 2026",
    submittedDate: "Oct 12, 2026",
    status: "submitted",
    summary:
      "Baptism, Communion, Confirmation, Matrimony, and Liturgy registry audit",
    baptisms: null,
    matrimony: null,
    confirmations: null,
    burials: null,
    total: null,
  },
  {
    id: "RPT-2026-Q3-MIN",
    title: "Ministries & Organizations Report",
    category: "Ministries",
    period: "3rd Quarter 2026",
    dueDate: "Oct 15, 2026",
    submittedDate: "Oct 14, 2026",
    status: "submitted",
    summary: "18 active ministries · 326 volunteers · 24 formation activities",
    baptisms: null,
    matrimony: null,
    confirmations: null,
    burials: null,
    total: null,
  },
  {
    id: "RPT-2026-Q2-AST",
    title: "Parish Assets & Maintenance",
    category: "Assets & Maintenance",
    period: "2nd Quarter 2026",
    dueDate: "Jul 15, 2026",
    submittedDate: null,
    status: "late",
    summary: "Inventory, repairs, maintenance expenses, and property updates",
    baptisms: null,
    matrimony: null,
    confirmations: null,
    burials: null,
    total: null,
  },
]

const SERVICES = [
  {
    type: "baptism" as ServiceType,
    label: "Baptism",
    icon: "💧",
    description:
      "Schedule infant or adult baptism. Submit requirements and select an available date.",
    requirements: [
      "PSA/NSO Birth Certificate",
      "Parents' PSA Marriage Certificate",
      "Godparents' List with IDs",
      "Baptismal Sponsors Form",
    ],
    color: "bg-blue-50 border-blue-200",
    accent: "#1D4ED8",
  },
  {
    type: "matrimony" as ServiceType,
    label: "Matrimony",
    icon: "💍",
    description:
      "Begin the canonical process for Church marriage including banns and Pre-Cana requirements.",
    requirements: [
      "PSA Birth Certificate (Both)",
      "PSA CENOMAR (Both)",
      "Baptismal Certificate (Both)",
      "Confirmation Certificate (Both)",
      "Pre-Cana Seminar Certificate",
    ],
    color: "bg-pink-50 border-pink-200",
    accent: "#BE185D",
  },
  {
    type: "confirmation" as ServiceType,
    label: "Confirmation",
    icon: "🕊️",
    description:
      "Register for the next confirmation class or request a confirmation certificate.",
    requirements: [
      "Baptismal Certificate",
      "First Communion Certificate",
      "Catechism Class Completion Form",
    ],
    color: "bg-purple-50 border-purple-200",
    accent: "#6D28D9",
  },
  {
    type: "burial" as ServiceType,
    label: "Burial Mass",
    icon: "⛪",
    description:
      "Arrange a burial mass for a deceased parishioner. Complete the required documentation.",
    requirements: [
      "PSA Death Certificate",
      "Baptismal Certificate of Deceased",
      "Letter of Request from Family",
    ],
    color: "bg-gray-50 border-gray-300",
    accent: "#374151",
  },
]

type ServiceCategory = "documents" | "sacraments"
const SERVICE_CATALOG = [
  {
    type: "baptism" as ServiceType,
    category: "documents" as ServiceCategory,
    label: "Baptismal Certificate",
    icon: "📄",
    iconName: "file",
    description:
      "Official certified copy of a Baptismal record from parish registers.",
    fee: "₱50.00",
    processing: "3–5 business days",
    requirements: [
      "Valid ID",
      "Proof of baptism (if available)",
      "Authorization Letter (if claimed by a representative)",
    ],
    color: "bg-blue-50 border-blue-200",
    accent: "#1D4ED8",
  },
  {
    type: "confirmation" as ServiceType,
    category: "documents" as ServiceCategory,
    label: "Communion Certificate",
    icon: "📄",
    iconName: "file",
    description: "Official certified copy of a Communion record.",
    fee: "₱50.00",
    processing: "3–5 business days",
    requirements: [
      "Valid ID",
      "Baptismal Certificate",
      "Authorization Letter (if claimed by a representative)",
    ],
    color: "bg-amber-50 border-amber-200",
    accent: "#A16207",
  },
  {
    type: "confirmation" as ServiceType,
    category: "documents" as ServiceCategory,
    label: "Confirmation Certificate",
    icon: "📄",
    iconName: "file",
    description: "Official certified copy of a Confirmation record.",
    fee: "₱50.00",
    processing: "3–5 business days",
    requirements: [
      "Valid ID",
      "Baptismal Certificate",
      "Sponsor (Godparent) requirements",
      "Confirmation Catechism & Confession",
    ],
    color: "bg-purple-50 border-purple-200",
    accent: "#6D28D9",
  },
  {
    type: "matrimony" as ServiceType,
    category: "documents" as ServiceCategory,
    label: "Matrimony Certificate",
    icon: "📄",
    iconName: "file",
    description: "Official certified copy of a Catholic marriage record.",
    fee: "₱100.00",
    processing: "3–5 business days",
    requirements: [
      "Valid ID of both parties",
      "Marriage License (copy)",
      "Authorization Letter (if claimed by a representative)",
    ],
    color: "bg-pink-50 border-pink-200",
    accent: "#BE185D",
  },
  {
    type: "baptism" as ServiceType,
    category: "sacraments" as ServiceCategory,
    label: "Baptism",
    icon: "💧",
    iconName: "droplet",
    description:
      "Washes away original sin and welcomes a person into the Church.",
    fee: "Free (Donation optional)",
    processing: "Scheduling required",
    requirements: [
      "PSA/NSO Birth Certificate",
      "Parents' Marriage Certificate",
      "Godparents' Confirmation Certificates",
    ],
    color: "bg-blue-50 border-blue-200",
    accent: "#1D4ED8",
  },
  {
    type: "confirmation" as ServiceType,
    category: "sacraments" as ServiceCategory,
    label: "Communion",
    icon: "✝",
    iconName: "cup",
    description: "Receiving the body and blood of Jesus Christ.",
    fee: "₱100.00",
    processing: "Scheduling required",
    requirements: [
      "Baptismal Certificate",
      "First Communion preparation record",
      "Catechism Completion Form",
    ],
    color: "bg-amber-50 border-amber-200",
    accent: "#A16207",
  },
  {
    type: "matrimony" as ServiceType,
    category: "sacraments" as ServiceCategory,
    label: "Matrimony",
    icon: "💍",
    iconName: "heart",
    description: "Permanently unites a man and a woman in marriage.",
    fee: "Donation-based",
    processing: "Scheduling required",
    requirements: [
      "Marriage License",
      "PSA Birth and Baptismal Certificates of both parties",
      "PSA CENOMAR of both parties",
      "Canonical Track (Church Requirements)",
    ],
    color: "bg-pink-50 border-pink-200",
    accent: "#BE185D",
  },
  {
    type: "burial" as ServiceType,
    category: "sacraments" as ServiceCategory,
    label: "Liturgy",
    icon: "⛪",
    iconName: "church",
    description:
      "Prayers for the soul of the deceased and commends them to God.",
    fee: "Donation-based",
    processing: "Scheduling required",
    requirements: [
      "Death Certificate",
      "Burial or Cremation Permit",
      "Parish Clearance / Permission (if claimed by a representative)",
    ],
    color: "bg-gray-50 border-gray-300",
    accent: "#374151",
  },
]

type ServiceOption = typeof SERVICES[number] & {
  category?: ServiceCategory
  fee?: string
  processing?: string
  iconName?: string
}

const AVAILABLE_SCHEDULES: Record<ServiceType, {
  date: string
  time: string
  slots: number
}[]> = {
  baptism: [
    { date: "December 7, 2026", time: "10:00 AM", slots: 3 },
    { date: "December 7, 2026", time: "2:00 PM", slots: 2 },
    { date: "December 14, 2026", time: "10:00 AM", slots: 5 },
    { date: "December 21, 2026", time: "10:00 AM", slots: 4 },
  ],
  matrimony: [
    { date: "January 18, 2025", time: "9:00 AM", slots: 1 },
    { date: "February 8, 2025", time: "9:00 AM", slots: 2 },
    { date: "February 15, 2025", time: "2:00 PM", slots: 1 },
  ],
  confirmation: [
    { date: "March 1, 2025", time: "9:00 AM", slots: 20 },
    { date: "March 8, 2025", time: "9:00 AM", slots: 15 },
  ],
  burial: [
    { date: "November 25, 2026", time: "9:00 AM", slots: 1 },
    { date: "November 26, 2026", time: "9:00 AM", slots: 1 },
    { date: "November 27, 2026", time: "9:00 AM", slots: 1 },
  ],
}

// ===================== HELPERS =====================
const statusLabel: Record<RequestStatus, string> = {
  pending: "Pending",
  "for-review": "For Review",
  approved: "Approved",
  completed: "Completed",
  returned: "Returned",
}

const StatusBadge = ({ status }: { status: RequestStatus }) => (
  <span
    className={`badge-${status} inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold`}
  >
    {status === "pending" && "⏳"}
    {status === "for-review" && "🔍"}
    {status === "approved" && "✓"}
    {status === "completed" && "✅"}
    {status === "returned" && "↩"}
    {statusLabel[status]}
  </span>
)

const Icon = ({
  name,
  size = 18,
  className = "",
}: {
  name: string
  size?: number
  className?: string
}) => {
  const icons: Record<string, string> = {
    home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z",
    calendar:
      "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
    settings:
      "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    clipboard:
      "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18 M6 6l12 12",
    search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
    filter: "M22 3H2l8 9.46V19l4 2v-8.54z",
    plus: "M12 5v14 M5 12h14",
    arrow: "M5 12h14 M12 5l7 7-7 7",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
    chart: "M18 20V10 M12 20V4 M6 20v-6",
    users:
      "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    phone:
      "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92z",
    mapPin:
      "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    globe:
      "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20",
    clock:
      "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2",
    history:
      "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5 M12 7v5l4 2",
    alert:
      "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
    landmark:
      "M3 21h18 M5 18h14 M6 8v10 M10 8v10 M14 8v10 M18 8v10 M3 8h18 L12 3 3 8z",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    send: "M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z",
    chat: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z M8 9h8 M8 13h5",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    chevron: "M6 9l6 6 6-6",
    chevronRight: "M9 18l6-6-6-6",
    church: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
    droplet: "M12 2s7 7.2 7 12a7 7 0 0 1-14 0c0-4.8 7-12 7-12z",
    cup: "M6 4h12v5a6 6 0 0 1-12 0z M8 20h8 M12 15v5 M18 6h2a2 2 0 0 1-2 3",
    heart:
      "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z",
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {(icons[name] || "").split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : "M" + d} />
      ))}
    </svg>
  )
}

// ===================== ACCOUNT SELECT SCREEN =====================
const AccountSelectScreen = ({
  onSelect,
}: {
  onSelect: (type: AccountType) => void
}) => {
  const [hovered, setHovered] = useState<AccountType | null>(null)
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #1A0A0A 0%, #3B0F0F 40%, #5C1414 70%, #7B1C1C 100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-center pt-16 pb-8 animate-fade-in">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <DiocesanSeal size={128} />
          </div>
          <div className="text-white text-sm sm:text-base font-mono tracking-[0.24em] uppercase mb-4 opacity-70">
            Archdiocese of Caceres
          </div>
          <h1
            className="text-6xl sm:text-7xl font-bold text-white mb-5 tracking-tight"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            ACROSS
          </h1>
          <p className="text-sm sm:text-base text-white/60 font-mono tracking-[0.16em] leading-relaxed px-4">
            AUTOMATED CENTRALIZED RESOURCE AND ONLINE SERVICES SYSTEM
          </p>
        </div>
      </div>

      {/* Account type cards */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-3xl">
          <p
            className="text-center text-white/70 text-sm mb-8 animate-fade-in stagger-1"
            style={{ fontFamily: "Lora" }}
          >
            Select your account type to continue
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in stagger-2">
            {[
              {
                type: "parishioner" as AccountType,
                label: "Parishioner",
                icon: "user",
                iconColor: "#F4C95D",
                iconBackground: "rgba(244,201,93,0.14)",
                iconBorder: "rgba(244,201,93,0.35)",
                tagline:
                  "Access sacramental records, request services, and track your requests.",
              },
              {
                type: "staff" as AccountType,
                label: "Parish Staff",
                icon: "church",
                iconColor: "#F29B8F",
                iconBackground: "rgba(242,155,143,0.14)",
                iconBorder: "rgba(242,155,143,0.35)",
                tagline:
                  "Manage parishioner requests, schedules, and submit archdiocesan reports.",
              },
              {
                type: "admin" as AccountType,
                label: "Archdiocese Admin",
                icon: "landmark",
                iconColor: "#93C5FD",
                iconBackground: "rgba(147,197,253,0.14)",
                iconBorder: "rgba(147,197,253,0.35)",
                tagline:
                  "Oversee parishes, review reports, and manage system-wide operations.",
              },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => onSelect(item.type)}
                onMouseEnter={() => setHovered(item.type)}
                onMouseLeave={() => setHovered(null)}
                className="relative rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer group flex flex-col items-center h-full"
                style={{
                  background:
                    hovered === item.type
                      ? "rgba(184, 148, 31, 0.15)"
                      : "rgba(255,255,255,0.06)",
                  border:
                    hovered === item.type
                      ? "2px solid rgba(184, 148, 31, 0.6)"
                      : "2px solid rgba(255,255,255,0.1)",
                  transform:
                    hovered === item.type
                      ? "translateY(-4px)"
                      : "translateY(0)",
                  boxShadow:
                    hovered === item.type
                      ? "0 12px 40px rgba(0,0,0,0.3)"
                      : "none",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    color: item.iconColor,
                    background: item.iconBackground,
                    border: `1px solid ${item.iconBorder}`,
                  }}
                >
                  <Icon name={item.icon} size={25} />
                </div>
                <h3
                  className="text-white font-semibold text-lg mb-2"
                  style={{ fontFamily: "Lora" }}
                >
                  {item.label}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.tagline}
                </p>
                <div
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background:
                      hovered === item.type
                        ? "#B8941F"
                        : "rgba(255,255,255,0.1)",
                  }}
                >
                  <Icon name="chevronRight" size={14} className="text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="flex-shrink-0 text-center text-white/30 text-xs pb-6 font-mono animate-fade-in stagger-3">
        © 2026 Archdiocese of Caceres · Naga City, Camarines Sur · v2.1.0
      </p>
    </div>
  )
}

// ===================== SIGNUP SCREEN =====================
const SignupScreen = ({
  onBack,
  onSuccess,
}: {
  onBack: () => void
  onSuccess: () => void
}) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dob: "",
    gender: "",
    civilStatus: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    address: "",
    barangay: "",
    municipality: "Naga City",
    parish: "",
    baptismCert: false,
    validId: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [agreed, setAgreed] = useState(false)

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  const parishes = [
    "Metropolitan Cathedral Parish",
    "Mater Salutis Parish",
    "Peñafrancia Shrine Parish",
    "Christ the King Parish",
    "San Francisco Parish",
    "Saint Joseph Parish, Pili",
    "San Nicolas Parish, Canaman",
    "Santo Tomas Parish, Libmanan",
    "Immaculate Conception Parish, Calabanga",
    "Holy Trinity Parish, Camaligan",
  ]

  const validate1 = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = "Required"
    if (!form.lastName.trim()) e.lastName = "Required"
    if (!form.dob) e.dob = "Required"
    if (!form.gender) e.gender = "Required"
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Valid email required"
    if (!form.phone.trim()) e.phone = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const validate2 = () => {
    const e: Record<string, string> = {}
    if (!form.parish) e.parish = "Required"
    if (!form.address.trim()) e.address = "Required"
    if (!form.barangay.trim()) e.barangay = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const validate3 = () => {
    const e: Record<string, string> = {}
    if (form.username.length < 4) e.username = "At least 4 characters"
    if (form.password.length < 6) e.password = "At least 6 characters"
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match"
    if (!agreed) e.agreed = "You must accept the terms"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 1 && validate1()) setStep(2)
    else if (step === 2 && validate2()) setStep(3)
    else if (step === 3 && validate3()) handleSubmit()
  }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1800))
    setLoading(false)
    setStep(4)
  }

  const labels = ["Personal Info", "Parish & Address", "Account Setup", "Done"]
  const F = ({
    label,
    id,
    type = "text",
    value,
    onChange,
    error,
    placeholder = "",
    optional = false,
  }: {
    label: string
    id: string
    type?: string
    value: string
    onChange: (v: string) => void
    error?: string
    placeholder?: string
    optional?: boolean
  }) => (
    <div>
      <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">
        {label}
        {optional && (
          <span className="ml-1 normal-case font-normal text-white/30">
            (optional)
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-white placeholder:text-white/30 text-sm transition-all"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: `1.5px solid ${error ? "#EF4444" : "rgba(255,255,255,0.15)"}`,
        }}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
  const Sel = ({
    label,
    id,
    value,
    onChange,
    error,
    options,
  }: {
    label: string
    id: string
    value: string
    onChange: (v: string) => void
    error?: string
    options: string[]
  }) => (
    <div>
      <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm transition-all"
        style={{
          background: "rgba(255,255,255,0.08)",
          color: value ? "white" : "rgba(255,255,255,0.3)",
          border: `1.5px solid ${error ? "#EF4444" : "rgba(255,255,255,0.15)"}`,
        }}
      >
        <option value="">— Select —</option>
        {options.map((o) => (
          <option
            key={o}
            value={o}
            style={{ background: "#2D0A0A", color: "white" }}
          >
            {o}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )

  return (
    <div
      className="min-h-screen flex"
      style={{
        background:
          "linear-gradient(135deg, #1A0A0A 0%, #3B0F0F 50%, #5C1414 100%)",
      }}
    >
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'url("/sign-in-background.jpg") center/cover' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,8,8,0.55), rgba(65,10,10,0.88))",
          }}
        />
        <div className="relative text-center text-white">
          <div className="flex justify-center mb-5">
            <DiocesanSeal size={104} />
          </div>
          <h2
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "Lora" }}
          >
            Archdiocese of Caceres
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto mb-8">
            Create your ACROSS account to access parish services and records.
          </p>
          {/* Progress sidebar */}
          <div className="flex flex-col gap-3 items-start text-left">
            {labels.slice(0, 3).map((l, i) => (
              <div
                key={l}
                className={`flex items-center gap-3 transition-all ${
                  step > i + 1
                    ? "opacity-100"
                    : step === i + 1
                      ? "opacity-100"
                      : "opacity-30"
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{
                    background:
                      step > i + 1
                        ? "#15803D"
                        : step === i + 1
                          ? "#C4971A"
                          : "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span
                  className={`text-sm font-semibold ${
                    step === i + 1 ? "text-yellow-300" : "text-white/70"
                  }`}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 lg:w-1/2 flex items-start justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-lg my-auto animate-scale-in">
          {step < 4 && (
            <button
              onClick={step === 1 ? onBack : () => setStep((s) => s - 1)}
              className="flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-6 transition-colors"
            >
              <Icon name="chevronRight" size={14} className="rotate-180" />{" "}
              {step === 1 ? "Back to sign in" : "Previous step"}
            </button>
          )}

          <div
            className="rounded-2xl p-7"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Mobile stepper */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className="flex-1 h-1 rounded-full transition-all"
                  style={{
                    background:
                      step >= s ? "#C4971A" : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>

            {/* ── STEP 1: Personal Info ── */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="mb-6">
                  <h2
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "Lora" }}
                  >
                    Personal Information
                  </h2>
                  <p className="text-white/40 text-sm mt-1">
                    Step 1 of 3 — Basic details about you
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <F
                    label="First Name"
                    id="fn"
                    value={form.firstName}
                    onChange={(v) => set("firstName", v)}
                    error={errors.firstName}
                  />
                  <F
                    label="Last Name"
                    id="ln"
                    value={form.lastName}
                    onChange={(v) => set("lastName", v)}
                    error={errors.lastName}
                  />
                </div>
                <F
                  label="Middle Name"
                  id="mn"
                  value={form.middleName}
                  onChange={(v) => set("middleName", v)}
                  optional
                />
                <F
                  label="Date of Birth"
                  id="dob"
                  type="date"
                  value={form.dob}
                  onChange={(v) => set("dob", v)}
                  error={errors.dob}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Sel
                    label="Gender"
                    id="gender"
                    value={form.gender}
                    onChange={(v) => set("gender", v)}
                    error={errors.gender}
                    options={["Male", "Female"]}
                  />
                  <Sel
                    label="Civil Status"
                    id="civil"
                    value={form.civilStatus}
                    onChange={(v) => set("civilStatus", v)}
                    error={errors.civilStatus}
                    options={["Single", "Married", "Widowed", "Separated"]}
                  />
                </div>
                <F
                  label="Email Address"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(v) => set("email", v)}
                  error={errors.email}
                  placeholder="you@email.com"
                />
                <F
                  label="Mobile Number"
                  id="phone"
                  value={form.phone}
                  onChange={(v) => set("phone", v)}
                  error={errors.phone}
                  placeholder="+63 9XX XXX XXXX"
                />
              </div>
            )}

            {/* ── STEP 2: Parish & Address ── */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="mb-6">
                  <h2
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "Lora" }}
                  >
                    Parish & Address
                  </h2>
                  <p className="text-white/40 text-sm mt-1">
                    Step 2 of 3 — Your parish affiliation and home address
                  </p>
                </div>
                <Sel
                  label="Registered Parish"
                  id="parish"
                  value={form.parish}
                  onChange={(v) => set("parish", v)}
                  error={errors.parish}
                  options={parishes}
                />
                <div
                  className="rounded-xl p-3 text-xs"
                  style={{
                    background: "rgba(196,151,26,0.1)",
                    border: "1px solid rgba(196,151,26,0.2)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  ✦ Your parish assignment will be verified by archdiocesan
                  staff. You will be notified once approved.
                </div>
                <F
                  label="Home Address (Street, Lot, Blk)"
                  id="address"
                  value={form.address}
                  onChange={(v) => set("address", v)}
                  error={errors.address}
                  placeholder="e.g. Blk 4 Lot 12, Peñafrancia Ave."
                />
                <div className="grid grid-cols-2 gap-4">
                  <F
                    label="Barangay"
                    id="brgy"
                    value={form.barangay}
                    onChange={(v) => set("barangay", v)}
                    error={errors.barangay}
                  />
                  <F
                    label="City / Municipality"
                    id="muni"
                    value={form.municipality}
                    onChange={(v) => set("municipality", v)}
                  />
                </div>
                {/* Document upload simulation */}
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
                    Supporting Documents
                  </label>
                  <p className="text-white/30 text-xs mb-3">
                    At least one document must be attached for verification.
                  </p>
                  {[
                    {
                      k: "baptismCert" as const,
                      label: "Baptismal Certificate",
                    },
                    {
                      k: "validId" as const,
                      label: "Government-issued ID (front)",
                    },
                  ].map((doc) => (
                    <label
                      key={doc.k}
                      className="flex items-center gap-3 mb-2 cursor-pointer group"
                    >
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{
                          background: form[doc.k]
                            ? "#7B1C1C"
                            : "rgba(255,255,255,0.1)",
                          border: `1.5px solid ${
                            form[doc.k] ? "#7B1C1C" : "rgba(255,255,255,0.2)"
                          }`,
                        }}
                      >
                        {form[doc.k] && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={form[doc.k]}
                        onChange={(e) => set(doc.k, e.target.checked)}
                        className="sr-only"
                      />
                      <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                        {doc.label} —{" "}
                        <span className="text-white/30 text-xs">
                          Simulated upload ✓
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 3: Account Setup ── */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="mb-6">
                  <h2
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "Lora" }}
                  >
                    Create Account
                  </h2>
                  <p className="text-white/40 text-sm mt-1">
                    Step 3 of 3 — Choose your login credentials
                  </p>
                </div>
                <F
                  label="Username"
                  id="uname"
                  value={form.username}
                  onChange={(v) => set("username", v.replace(/\s/g, ""))}
                  error={errors.username}
                  placeholder="e.g. juan.delacruz"
                />
                <div className="grid grid-cols-2 gap-4">
                  <F
                    label="Password"
                    id="pw"
                    type="password"
                    value={form.password}
                    onChange={(v) => set("password", v)}
                    error={errors.password}
                    placeholder="Min 6 characters"
                  />
                  <F
                    label="Confirm Password"
                    id="cpw"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(v) => set("confirmPassword", v)}
                    error={errors.confirmPassword}
                    placeholder="Repeat password"
                  />
                </div>
                {/* Password strength */}
                {form.password.length > 0 && (
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className="flex-1 h-1 rounded-full transition-all"
                          style={{
                            background:
                              form.password.length >= n * 3
                                ? form.password.length >= 10
                                  ? "#15803D"
                                  : form.password.length >= 7
                                    ? "#CA8A04"
                                    : "#DC2626"
                                : "rgba(255,255,255,0.1)",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-xs"
                      style={{
                        color:
                          form.password.length >= 10
                            ? "#4ADE80"
                            : form.password.length >= 7
                              ? "#FCD34D"
                              : "#FCA5A5",
                      }}
                    >
                      {form.password.length >= 10
                        ? "Strong password"
                        : form.password.length >= 7
                          ? "Good"
                          : "Too short"}
                    </p>
                  </div>
                )}
                {/* Summary card */}
                <div
                  className="rounded-xl p-4 space-y-1.5"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">
                    Account Summary
                  </p>
                  <p className="text-sm text-white/70">
                    <span className="text-white/40">Name:</span>{" "}
                    {form.firstName}{" "}
                    {form.middleName ? form.middleName[0] + ". " : ""}
                    {form.lastName}
                  </p>
                  <p className="text-sm text-white/70">
                    <span className="text-white/40">Email:</span> {form.email}
                  </p>
                  <p className="text-sm text-white/70">
                    <span className="text-white/40">Parish:</span>{" "}
                    {form.parish || "—"}
                  </p>
                  <p className="text-sm text-white/70">
                    <span className="text-white/40">Address:</span>{" "}
                    {form.barangay}, {form.municipality}
                  </p>
                </div>
                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    className="w-5 h-5 mt-0.5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{
                      background: agreed ? "#7B1C1C" : "rgba(255,255,255,0.1)",
                      border: `1.5px solid ${
                        agreed
                          ? "#7B1C1C"
                          : errors.agreed
                            ? "#EF4444"
                            : "rgba(255,255,255,0.2)"
                      }`,
                    }}
                  >
                    {agreed && <span className="text-white text-xs">✓</span>}
                  </div>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <span className="text-xs text-white/50 leading-relaxed">
                    I agree to the{" "}
                    <span className="text-yellow-400 underline cursor-pointer">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-yellow-400 underline cursor-pointer">
                      Privacy Policy
                    </span>{" "}
                    of the Archdiocese of Caceres ACROSS system. I confirm that
                    the information I provided is true and correct.
                  </span>
                </label>
                {errors.agreed && (
                  <p className="text-red-400 text-xs">{errors.agreed}</p>
                )}
              </div>
            )}

            {/* ── STEP 4: Success ── */}
            {step === 4 && (
              <div className="text-center py-4 animate-scale-in">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
                  style={{
                    background: "linear-gradient(135deg,#14532D,#15803D)",
                    boxShadow: "0 0 40px rgba(21,128,61,0.3)",
                  }}
                >
                  ✓
                </div>
                <h2
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: "Lora" }}
                >
                  Registration Submitted!
                </h2>
                <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto mb-6">
                  Your account request has been submitted to{" "}
                  <strong className="text-white/80">{form.parish}</strong>. A
                  parish staff member will review and verify your information
                  within{" "}
                  <strong className="text-white/80">2–3 business days</strong>.
                </p>
                <div
                  className="rounded-xl p-4 mb-6 text-left space-y-2"
                  style={{
                    background: "rgba(184,148,31,0.1)",
                    border: "1px solid rgba(184,148,31,0.25)",
                  }}
                >
                  <p className="text-xs text-yellow-300 font-bold uppercase tracking-widest mb-2">
                    What happens next
                  </p>
                  {[
                    "Parish staff will verify your submitted documents",
                    "You will receive an email confirmation at " + form.email,
                    "Once approved, you can sign in using your chosen credentials",
                  ].map((s, i) => (
                    <p
                      key={i}
                      className="text-xs text-white/60 flex items-start gap-2"
                    >
                      <span className="text-yellow-400 flex-shrink-0">
                        {i + 1}.
                      </span>
                      {s}
                    </p>
                  ))}
                </div>
                <button
                  onClick={onSuccess}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white btn-primary"
                >
                  Back to Sign In
                </button>
              </div>
            )}

            {/* Navigation button */}
            {step < 4 && (
              <button
                onClick={next}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm text-white btn-primary mt-6 flex items-center justify-center gap-2"
                style={{ opacity: loading ? 0.8 : 1 }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : step === 3 ? (
                  "Submit Registration"
                ) : (
                  "Continue →"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ===================== LOGIN SCREEN =====================
const LoginScreen = ({
  accountType,
  onLogin,
  onBack,
  onSignup,
}: {
  accountType: AccountType
  onLogin: () => void
  onBack: () => void
  onSignup: () => void
}) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const info = {
    parishioner: { subtitle: "Access your parish records and services" },
    staff: { subtitle: "Mater Salutis Parish – Staff Portal" },
    admin: { subtitle: "Administrative portal for the Archdiocese" },
  }[accountType]

  const handleLogin = async () => {
    setError("")
    const expected = DEMO_ACCOUNTS[accountType]
    if (username === expected.username && password === expected.password) {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 1200))
      onLogin()
    } else {
      setError("Invalid username or password. Please try again.")
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{
        background:
          "linear-gradient(135deg, #1A0A0A 0%, #3B0F0F 50%, #5C1414 100%)",
      }}
    >
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'url("/sign-in-background.jpg") center/cover' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,8,8,0.55), rgba(65,10,10,0.86))",
          }}
        />
        <div className="relative text-center text-white">
          <div className="flex justify-center mb-6">
            <DiocesanSeal size={112} />
          </div>
          <h2
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "Lora" }}
          >
            Archdiocese of Caceres
          </h2>
          <div className="mt-8 flex flex-col gap-3 text-sm text-white/70 text-left">
            <div className="flex items-center gap-3">
              <Icon
                name="mapPin"
                size={17}
                className="text-gold flex-shrink-0"
              />
              <span>Archbishops Palace, Naga City, Philippines</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="mail" size={17} className="text-gold flex-shrink-0" />
              <span>cccom@archcaceres.org</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon
                name="globe"
                size={17}
                className="text-gold flex-shrink-0"
              />
              <span>www.archdioceseofcaceres.org</span>
            </div>
          </div>
        </div>
      </div>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-scale-in">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-8 transition-colors"
          >
            <Icon name="chevronRight" size={14} className="rotate-180" /> Back
            to account selection
          </button>

          <div
            className="rounded-2xl p-8"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <DiocesanSeal size={88} />
              </div>
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Lora" }}
              >
                Sign In
              </h1>
              <p className="text-white/50 text-sm mt-1">{info.subtitle}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder:text-white/30 text-sm transition-all"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div>
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl text-white placeholder:text-white/30 text-sm pr-12 transition-all"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    <Icon name="eye" size={16} />
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 text-red-300 text-sm px-3 py-2 rounded-lg"
                  style={{
                    background: "rgba(220,38,38,0.15)",
                    border: "1px solid rgba(220,38,38,0.3)",
                  }}
                >
                  <Icon name="alert" size={14} /> {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all btn-primary mt-2"
                style={{ opacity: loading ? 0.8 : 1 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            {accountType === "parishioner" && (
              <div
                className="mt-5 text-center border-t pt-5"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <p className="text-white/40 text-sm">
                  Don't have an account?{" "}
                  <button
                    onClick={onSignup}
                    className="font-semibold transition-colors hover:text-yellow-200"
                    style={{ color: "#D4AF37" }}
                  >
                    Register as Parishioner
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const PaymentQr = ({ method }: { method: "bank" | "ewallet" }) => {
  return (
    <div className="w-40 h-40 bg-white rounded-xl p-2 border border-gray-200 shadow-sm">
      <img
        src="/payment-qr.png"
        alt={`${
          method === "bank" ? "Bank transfer" : "E-wallet"
        } payment QR code`}
        className="w-full h-full object-contain"
      />
    </div>
  )
}

// ===================== SERVICE REQUEST MODAL =====================
const ServiceRequestModal = ({
  service,
  onClose,
  onSubmit,
  initialStep = 1,
  initialSubject = "",
}: {
  service: ServiceOption
  onClose: () => void
  onSubmit: (req: ServiceRequest) => void
  initialStep?: number
  initialSubject?: string
}) => {
  const [step, setStep] = useState(initialStep)
  const [formData, setFormData] = useState({
    subjectName: initialSubject,
    dateOfBirth: "",
    motherName: "",
    fatherName: "",
    brideName: "",
    brideDateOfBirth: "",
    brideMotherName: "",
    brideFatherName: "",
    brideAddress: "",
    groomName: "",
    groomDateOfBirth: "",
    groomMotherName: "",
    groomFatherName: "",
    groomAddress: "",
    catechismClass: "",
    address: "",
    contactNo: "",
    notes: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "ewallet">("bank")
  const [paymentReference, setPaymentReference] = useState("")
  const [paymentProof, setPaymentProof] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<{
    date: string
    time: string
  } | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [trackingId, setTrackingId] = useState("")

  const schedules = AVAILABLE_SCHEDULES[service.type]
  const isDocumentRequest = service.category === "documents"

  const handleFileUpload = (req: string) => {
    if (!uploadedFiles.includes(req)) setUploadedFiles([...uploadedFiles, req])
  }

  const handleSubmit = () => {
    const id = `ACROSS-2026-${String(Math.floor(Math.random() * 900) + 500).padStart(5, "0")}`
    setTrackingId(id)
    setSubmitted(true)
    onSubmit({
      id,
      type: service.type,
      label: service.label,
      submittedDate: "Nov 23, 2026",
      status: "pending",
      subjectName:
        service.type === "matrimony"
          ? `${formData.brideName || "Bride"} & ${formData.groomName || "Groom"}`
          : formData.subjectName || "Unknown",
      parish: "Mater Salutis Parish",
      scheduleDate: selectedSchedule?.date || null,
      scheduleTime: selectedSchedule?.time || null,
      officiantName: null,
      notes: null,
      requirements: service.requirements,
      trackingHistory: [
        {
          date: "Nov 23, 2026 – Today",
          status: "Submitted",
          note: "Request submitted and received by the parish.",
        },
      ],
    })
  }

  const totalSteps = isDocumentRequest ? 4 : 5
  const stepLabels = isDocumentRequest
    ? ["Details", "Requirements", "Payment", "Review"]
    : ["Details", "Requirements", "Payment", "Schedule", "Review"]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div
        className={`w-full ${
          service.type === "matrimony" ? "max-w-4xl" : "max-w-2xl"
        } rounded-2xl bg-white shadow-2xl animate-scale-in flex flex-col max-h-[94vh] overflow-hidden`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-gray-100"
          style={{ background: "linear-gradient(135deg, #7B1C1C, #9B2C2C)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{service.icon}</span>
            <div>
              <h2
                className="text-white font-semibold text-lg"
                style={{ fontFamily: "Lora" }}
              >
                Request {service.label}
              </h2>
              <p className="text-white/60 text-xs">
                Mater Salutis Parish · ACROSS Online
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Step indicator */}
        {!submitted && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 flex-1 last:flex-none"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      i + 1 <= step ? "text-white" : "text-gray-400 bg-gray-100"
                    }`}
                    style={{
                      background:
                        i + 1 <= step
                          ? "linear-gradient(135deg, #7B1C1C, #9B2C2C)"
                          : undefined,
                    }}
                  >
                    {i + 1 < step ? <Icon name="check" size={12} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      i + 1 === step ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {stepLabels[i]}
                  </span>
                  {i < totalSteps - 1 && (
                    <div
                      className={`step-line ${i + 1 < step ? "active" : ""}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className={`flex-1 p-6 ${
            service.type === "matrimony"
              ? "overflow-y-auto lg:overflow-hidden"
              : "overflow-y-auto"
          }`}
        >
          {submitted ? (
            <div className="text-center py-8 animate-scale-in">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
                style={{ background: "#D1FAE5" }}
              >
                ✅
              </div>
              <h3
                className="text-2xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: "Lora" }}
              >
                Request Submitted!
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Your request has been received by Mater Salutis Parish.
              </p>
              <div
                className="rounded-xl px-6 py-4 mb-6 inline-block"
                style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
              >
                <p className="text-xs text-yellow-700 font-mono uppercase tracking-wider mb-1">
                  Tracking Number
                </p>
                <p className="text-2xl font-bold text-yellow-900 font-mono">
                  {trackingId}
                </p>
              </div>
              {selectedSchedule && (
                <div className="text-sm text-gray-600 mb-6">
                  <span className="font-medium">Preferred Schedule:</span>{" "}
                  {selectedSchedule.date} at {selectedSchedule.time}
                </div>
              )}
              <p className="text-xs text-gray-400">
                {isDocumentRequest
                  ? "The parish will contact you and send a notification when your certificate is ready for pickup."
                  : "You will receive a notification once the staff reviews your request."}
              </p>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4 animate-fade-in">
              <h3
                className="font-semibold text-gray-800 mb-4"
                style={{ fontFamily: "Lora" }}
              >
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.type === "matrimony" ? (
                  <>
                    {[
                      {
                        party: "Bride",
                        fields: [
                          {
                            key: "brideName",
                            label: "Bride's Full Name",
                            placeholder: "Full legal name",
                          },
                          {
                            key: "brideDateOfBirth",
                            label: "Bride's Date of Birth",
                            placeholder: "MM/DD/YYYY",
                          },
                          {
                            key: "brideMotherName",
                            label: "Bride's Mother's Full Name",
                            placeholder: "Full legal name",
                          },
                          {
                            key: "brideFatherName",
                            label: "Bride's Father's Full Name",
                            placeholder: "Full legal name",
                          },
                          {
                            key: "brideAddress",
                            label: "Bride's Home Address",
                            placeholder:
                              "House/Unit no., Street, Barangay, City",
                          },
                        ],
                      },
                      {
                        party: "Groom",
                        fields: [
                          {
                            key: "groomName",
                            label: "Groom's Full Name",
                            placeholder: "Full legal name",
                          },
                          {
                            key: "groomDateOfBirth",
                            label: "Groom's Date of Birth",
                            placeholder: "MM/DD/YYYY",
                          },
                          {
                            key: "groomMotherName",
                            label: "Groom's Mother's Full Name",
                            placeholder: "Full legal name",
                          },
                          {
                            key: "groomFatherName",
                            label: "Groom's Father's Full Name",
                            placeholder: "Full legal name",
                          },
                          {
                            key: "groomAddress",
                            label: "Groom's Home Address",
                            placeholder:
                              "House/Unit no., Street, Barangay, City",
                          },
                        ],
                      },
                    ].map((group) => (
                      <div
                        key={group.party}
                        className="col-span-1 rounded-xl p-4 bg-gray-50 border border-gray-100"
                      >
                        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                          {group.party} Information
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          {group.fields.map((field) => (
                            <div key={field.key}>
                              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                                {field.label}
                              </label>
                              <input
                                type="text"
                                placeholder={field.placeholder}
                                value={(formData as any)[field.key]}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    [field.key]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 rounded-lg border text-sm text-gray-800 bg-white"
                                style={{ borderColor: "#DDD6CE" }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      {
                        key: "subjectName",
                        label: `Name of ${
                          service.type === "burial"
                            ? "Deceased"
                            : "Person to be Baptized/Confirmed"
                        }`,
                        placeholder: "Full legal name",
                      },
                      {
                        key: "dateOfBirth",
                        label: "Date of Birth",
                        placeholder: "MM/DD/YYYY",
                      },
                      {
                        key: "motherName",
                        label: "Mother's Full Name",
                        placeholder: "Full legal name",
                      },
                      {
                        key: "fatherName",
                        label: "Father's Full Name",
                        placeholder: "Full legal name",
                      },
                    ].map((f) => (
                      <div key={f.key} className="col-span-1">
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                          {f.label}
                        </label>
                        <input
                          type="text"
                          placeholder={f.placeholder}
                          value={(formData as any)[f.key]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [f.key]: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2.5 rounded-lg border text-sm text-gray-800"
                          style={{ borderColor: "#DDD6CE" }}
                        />
                      </div>
                    ))}
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Home Address
                      </label>
                      <input
                        type="text"
                        placeholder="House/Unit no., Street, Barangay, City"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-lg border text-sm text-gray-800"
                        style={{ borderColor: "#DDD6CE" }}
                      />
                    </div>
                  </>
                )}
                {service.label === "Communion" && (
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                      Catechism Class / Sunday School Attended
                    </label>
                    <input
                      type="text"
                      placeholder="Name of parish, school, or catechism program"
                      value={formData.catechismClass}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          catechismClass: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-lg border text-sm text-gray-800"
                      style={{ borderColor: "#DDD6CE" }}
                    />
                  </div>
                )}
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    placeholder="+63 9XX XXX XXXX"
                    value={formData.contactNo}
                    onChange={(e) =>
                      setFormData({ ...formData, contactNo: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-lg border text-sm text-gray-800"
                    style={{ borderColor: "#DDD6CE" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Additional Notes
                </label>
                <textarea
                  placeholder="Any special requests or additional information..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm text-gray-800 resize-none"
                  style={{ borderColor: "#DDD6CE" }}
                />
              </div>
            </div>
          ) : step === 2 ? (
            <div className="animate-fade-in">
              <h3
                className="font-semibold text-gray-800 mb-1"
                style={{ fontFamily: "Lora" }}
              >
                Upload Requirements
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Please upload scanned copies or clear photos of the following
                documents.
              </p>
              <div className="space-y-3">
                {service.requirements.map((req) => (
                  <div
                    key={req}
                    className="flex items-center justify-between p-3 rounded-xl border transition-all"
                    style={{
                      borderColor: uploadedFiles.includes(req)
                        ? "#86EFAC"
                        : "#DDD6CE",
                      background: uploadedFiles.includes(req)
                        ? "#F0FDF4"
                        : "#FAFAF9",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          uploadedFiles.includes(req)
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {uploadedFiles.includes(req) ? (
                          "✓"
                        ) : (
                          <Icon name="file" size={14} />
                        )}
                      </div>
                      <span className="text-sm text-gray-700">{req}</span>
                    </div>
                    {!uploadedFiles.includes(req) ? (
                      <button
                        onClick={() => handleFileUpload(req)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                        style={{ background: "#7B1C1C", color: "white" }}
                      >
                        Upload
                      </button>
                    ) : (
                      <span className="text-xs text-green-600 font-semibold">
                        Uploaded ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div
                className="mt-4 upload-zone rounded-xl p-6 text-center cursor-pointer"
                onClick={() =>
                  service.requirements.forEach((r) => handleFileUpload(r))
                }
              >
                <Icon
                  name="upload"
                  size={24}
                  className="mx-auto text-gray-400 mb-2"
                />
                <p className="text-sm text-gray-500">
                  Drop files here or click to upload all
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Accepted: PDF, JPG, PNG (max 5MB each)
                </p>
              </div>
              {uploadedFiles.length < service.requirements.length && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <Icon name="alert" size={12} /> You may continue without
                  uploading all documents, but approval may be delayed.
                </p>
              )}
            </div>
          ) : step === 3 ? (
            <div className="animate-fade-in">
              <h3
                className="font-semibold text-gray-800 mb-1"
                style={{ fontFamily: "Lora" }}
              >
                Payment Method
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Choose a payment option, scan the QR code, and upload your
                receipt.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  {
                    key: "bank" as const,
                    label: "Bank Transfer",
                    icon: "landmark",
                  },
                  { key: "ewallet" as const, label: "E-Wallet", icon: "phone" },
                ].map((method) => (
                  <button
                    key={method.key}
                    onClick={() => {
                      setPaymentMethod(method.key)
                      setPaymentProof(false)
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      paymentMethod === method.key
                        ? "border-primary bg-red-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      name={method.icon}
                      size={20}
                      className={
                        paymentMethod === method.key
                          ? "text-primary"
                          : "text-gray-400"
                      }
                    />
                    <p className="text-sm font-semibold text-gray-800 mt-2">
                      {method.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {method.key === "bank"
                        ? "Online or over-the-counter"
                        : "GCash or Maya"}
                    </p>
                  </button>
                ))}
              </div>
              <div
                className="rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5"
                style={{ background: "#F7F5F2", border: "1px solid #DDD6CE" }}
              >
                <PaymentQr method={paymentMethod} />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    {paymentMethod === "bank"
                      ? "Bank Transfer Details"
                      : "E-Wallet Details"}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {paymentMethod === "bank"
                      ? "BPI · Mater Salutis Parish"
                      : "GCash / Maya · Mater Salutis Parish"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 font-mono">
                    {paymentMethod === "bank"
                      ? "Account 1234 5678 9012"
                      : "0917 123 4567"}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-white border border-gray-200">
                    <span className="text-xs text-gray-400">Amount</span>
                    <span className="text-sm font-bold text-primary">
                      {service.fee || "Parish-assessed fee"}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Demo QR code for prototype payment flow.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Payment Reference Number
                </label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Enter bank or e-wallet reference number"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm text-gray-800"
                  style={{ borderColor: "#DDD6CE" }}
                />
              </div>
              <button
                onClick={() => setPaymentProof(true)}
                className={`mt-4 w-full rounded-xl p-4 border-2 border-dashed flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                  paymentProof
                    ? "border-green-300 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-500 hover:border-primary hover:text-primary"
                }`}
              >
                <Icon name={paymentProof ? "check" : "upload"} size={17} />
                {paymentProof
                  ? "Payment receipt uploaded"
                  : "Upload payment receipt"}
              </button>
            </div>
          ) : step === 4 && !isDocumentRequest ? (
            <div className="animate-fade-in">
              <h3
                className="font-semibold text-gray-800 mb-1"
                style={{ fontFamily: "Lora" }}
              >
                Select Schedule
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Choose your preferred date and time. Final confirmation depends
                on parish availability.
              </p>
              <div className="space-y-3">
                {schedules.map((s) => (
                  <button
                    key={`${s.date}-${s.time}`}
                    onClick={() =>
                      setSelectedSchedule({ date: s.date, time: s.time })
                    }
                    className="w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all"
                    style={{
                      borderColor:
                        selectedSchedule?.date === s.date &&
                        selectedSchedule?.time === s.time
                          ? "#7B1C1C"
                          : "#DDD6CE",
                      background:
                        selectedSchedule?.date === s.date &&
                        selectedSchedule?.time === s.time
                          ? "#FDF5F5"
                          : "white",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background:
                            selectedSchedule?.date === s.date &&
                            selectedSchedule?.time === s.time
                              ? "#7B1C1C"
                              : "#F0EDE8",
                        }}
                      >
                        <Icon
                          name="calendar"
                          size={18}
                          className={
                            selectedSchedule?.date === s.date &&
                            selectedSchedule?.time === s.time
                              ? "text-white"
                              : "text-gray-500"
                          }
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">
                          {s.date}
                        </p>
                        <p className="text-xs text-gray-500">
                          {s.time} · {s.slots} slot{s.slots !== 1 ? "s" : ""}{" "}
                          available
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedSchedule?.date === s.date &&
                        selectedSchedule?.time === s.time
                          ? "border-[#7B1C1C]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedSchedule?.date === s.date &&
                        selectedSchedule?.time === s.time && (
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: "#7B1C1C" }}
                          />
                        )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h3
                className="font-semibold text-gray-800 mb-4"
                style={{ fontFamily: "Lora" }}
              >
                Review Your Request
              </h3>
              <div className="space-y-4">
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#F7F5F2", border: "1px solid #DDD6CE" }}
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                    Service
                  </p>
                  <p className="font-semibold text-gray-800">
                    {service.icon} {service.label}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Mater Salutis Parish, Naga City
                  </p>
                </div>
                {(formData.subjectName ||
                  formData.brideName ||
                  formData.groomName) && (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "#F7F5F2",
                      border: "1px solid #DDD6CE",
                    }}
                  >
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                      Personal Details
                    </p>
                    {service.type === "matrimony" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Bride
                          </p>
                          <p className="font-semibold text-gray-800">
                            {formData.brideName || "—"}
                          </p>
                          {formData.brideDateOfBirth && (
                            <p className="text-sm text-gray-500">
                              Born {formData.brideDateOfBirth}
                            </p>
                          )}
                          {formData.brideAddress && (
                            <p className="text-sm text-gray-500 mt-0.5">
                              {formData.brideAddress}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Groom
                          </p>
                          <p className="font-semibold text-gray-800">
                            {formData.groomName || "—"}
                          </p>
                          {formData.groomDateOfBirth && (
                            <p className="text-sm text-gray-500">
                              Born {formData.groomDateOfBirth}
                            </p>
                          )}
                          {formData.groomAddress && (
                            <p className="text-sm text-gray-500 mt-0.5">
                              {formData.groomAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-800">
                          {formData.subjectName}
                        </p>
                        {formData.address && (
                          <p className="text-sm text-gray-500 mt-0.5">
                            {formData.address}
                          </p>
                        )}
                      </>
                    )}
                    {service.label === "Communion" &&
                      formData.catechismClass && (
                        <p className="text-sm text-gray-500 mt-1">
                          Catechism Class / Sunday School:{" "}
                          {formData.catechismClass}
                        </p>
                      )}
                  </div>
                )}
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#F7F5F2", border: "1px solid #DDD6CE" }}
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                    Documents
                  </p>
                  <p className="text-sm text-gray-700">
                    {uploadedFiles.length} of {service.requirements.length}{" "}
                    uploaded
                  </p>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#F7F5F2", border: "1px solid #DDD6CE" }}
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                    Payment
                  </p>
                  <p className="font-semibold text-gray-800">
                    {paymentMethod === "bank" ? "Bank Transfer" : "E-Wallet"} ·{" "}
                    {service.fee || "Parish-assessed fee"}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {paymentReference
                      ? `Reference: ${paymentReference}`
                      : "No reference number entered"}
                    {" · "}
                    {paymentProof ? "Receipt uploaded" : "Receipt not uploaded"}
                  </p>
                </div>
                {selectedSchedule && (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "#F7F5F2",
                      border: "1px solid #DDD6CE",
                    }}
                  >
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                      Preferred Schedule
                    </p>
                    <p className="font-semibold text-gray-800">
                      {selectedSchedule.date}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedSchedule.time}
                    </p>
                  </div>
                )}
                {isDocumentRequest && (
                  <div
                    className="rounded-xl p-4 flex items-start gap-3"
                    style={{
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                    }}
                  >
                    <Icon
                      name="bell"
                      size={17}
                      className="text-blue-700 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">
                        Pickup notification
                      </p>
                      <p className="text-xs text-blue-700 mt-0.5">
                        No appointment date is required. Mater Salutis Parish
                        will contact you and notify you when the certificate is
                        ready for pickup.
                      </p>
                    </div>
                  </div>
                )}
                <div
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
                >
                  <span className="text-amber-500 mt-0.5">⚠️</span>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    By submitting this request, you confirm that all provided
                    information is accurate and complete. The parish staff will
                    review your submission within 2–3 business days.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <button
              onClick={step === 1 ? onClose : () => setStep(step - 1)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {step === 1 ? "Cancel" : "← Back"}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                Step {step} of {totalSteps}
              </span>
              {step < totalSteps ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2 rounded-lg text-sm font-semibold btn-primary"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 rounded-lg text-sm font-semibold btn-gold"
                >
                  Submit Request
                </button>
              )}
            </div>
          </div>
        )}
        {submitted && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-semibold btn-primary"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

type ChatAction = "confirmation-document" | "baptism-document" | "baptism-schedule" | "matrimony-schedule" | "payment" | "track"
type ChatReplyKind = "confirmation" | "status" | "schedule" | "payment" | "marriage" | "certificate" | "hours" | "error" | "handoff"

interface ChatMessage {
  id: number
  role: "user" | "assistant"
  text: string
  kind?: ChatReplyKind
}

const AskAcross = ({
  onAction,
}: {
  onAction: (action: ChatAction) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Maogmang aldaw, Joshua. I can help with parish requirements, fees, schedules, payments, and request updates.",
    },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [handoff, setHandoff] = useState(false)
  const messageEndRef = useRef<HTMLDivElement>(null)

  const quickReplies = [
    "How do I request a Baptismal Certificate?",
    "What are the requirements for Marriage?",
    "Book a baptism schedule",
    "Check my request status",
    "How do I pay?",
    "Parish office hours",
  ]

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  const getReply = (prompt: string): Omit<ChatMessage, "id" | "role"> => {
    const normalized = prompt.toLowerCase()
    if (
      normalized.includes("confirmation") &&
      (normalized.includes("how much") || normalized.includes("fee"))
    ) {
      return {
        kind: "confirmation",
        text: "A Confirmation Certificate from Mater Salutis Parish costs ₱50.00 and is usually ready in 3–5 business days.",
      }
    }
    if (
      (normalized.includes("where") && normalized.includes("baptism")) ||
      normalized.includes("request status") ||
      normalized.includes("track")
    ) {
      return {
        kind: "status",
        text: "Your Baptism request #ACROSS-2026-00141 is approved. Your appointment is confirmed for December 7, 2026 at 10:00 AM.",
      }
    }
    if (
      (normalized.includes("book") || normalized.includes("schedule")) &&
      normalized.includes("baptism")
    ) {
      return {
        kind: "schedule",
        text: "I found three available baptism appointments at Mater Salutis Parish. Select one to continue with Joshua Pascual’s details pre-filled.",
      }
    }
    if (normalized.includes("marriage") || normalized.includes("matrimony")) {
      return {
        kind: "marriage",
        text: "For Marriage, both parties need recent sacramental and civil documents. The parish recommends beginning at least three months before the intended wedding date.",
      }
    }
    if (
      normalized.includes("baptismal certificate") ||
      normalized.includes("request a baptismal")
    ) {
      return {
        kind: "certificate",
        text: "You can request a certified Baptismal Certificate online. The fee is ₱50.00 and processing normally takes 3–5 business days.",
      }
    }
    if (normalized.includes("pay") || normalized.includes("payment")) {
      return {
        kind: "payment",
        text: "ACROSS accepts GCash, Maya, and BPI bank transfer. Keep your reference number and upload a clear receipt during your request.",
      }
    }
    if (
      normalized.includes("office") ||
      normalized.includes("hours") ||
      normalized.includes("mass") ||
      normalized.includes("event")
    ) {
      return {
        kind: "hours",
        text: "The Mater Salutis Parish Office is open Monday–Saturday, 8:00 AM–12:00 PM and 1:00–5:00 PM. Sunday Masses are at 6:00 AM, 8:00 AM, 10:00 AM, and 5:00 PM.",
      }
    }
    return {
      kind: "error",
      text: "I could not find a reliable answer for that request. You can try again or ask the Mater Salutis Parish staff for help.",
    }
  }

  const sendPrompt = (prompt: string) => {
    const cleanPrompt = prompt.trim()
    if (!cleanPrompt || typing) return
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text: cleanPrompt },
    ])
    setInput("")
    setTyping(true)
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: "assistant", ...getReply(cleanPrompt) },
      ])
      setTyping(false)
    }, 750)
  }

  const startHandoff = () => {
    setHandoff(true)
    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "assistant",
        kind: "handoff",
        text: "I’ve prepared a staff handoff with your conversation summary. A parish secretary can continue from here.",
      },
    ])
  }

  const RichCard = ({ message }: { message: ChatMessage }) => {
    if (!message.kind || message.kind === "handoff") {
      return message.kind === "handoff" ? (
        <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3">
          <div className="flex items-center gap-2 text-green-800">
            <Icon name="check" size={15} />
            <span className="text-xs font-semibold">Staff handoff ready</span>
          </div>
          <p className="text-xs text-green-700 mt-2">
            Mater Salutis Parish Office · Queue MSP-028
          </p>
          <p className="text-[11px] text-green-600 mt-1">
            Expected reply within office hours: 15–30 minutes
          </p>
        </div>
      ) : null
    }

    if (message.kind === "error") {
      return (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
          <div className="flex items-center gap-2 text-danger">
            <Icon name="alert" size={15} />
            <span className="text-xs font-semibold">
              Unable to complete this answer
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() =>
                sendPrompt(
                  messages.filter((item) => item.role === "user").at(-1)
                    ?.text || "",
                )
              }
              className="chat-touch flex-1 rounded-lg border border-red-200 bg-white text-xs font-semibold text-danger"
            >
              Try again
            </button>
            <button
              onClick={startHandoff}
              className="chat-touch flex-1 rounded-lg bg-primary text-white text-xs font-semibold"
            >
              Talk to staff
            </button>
          </div>
        </div>
      )
    }

    const config = {
      confirmation: {
        eyebrow: "Certificate fee",
        title: "Confirmation Certificate · ₱50.00",
        details: [
          "Valid ID",
          "Baptismal Certificate",
          "Sponsor information",
          "3–5 business days",
        ],
        action: "Request Document",
        actionType: "confirmation-document" as ChatAction,
      },
      status: {
        eyebrow: "Approved request",
        title: "#ACROSS-2026-00141",
        details: [
          "Baptism – Infant",
          "Joshua Pascual",
          "Dec 7, 2026 · 10:00 AM",
          "Mater Salutis Main Church",
        ],
        action: "Track Request #ACROSS-2026-00141",
        actionType: "track" as ChatAction,
      },
      schedule: {
        eyebrow: "Available baptism slots",
        title: "December 2026",
        details: [
          "Dec 7 · 10:00 AM · 3 slots",
          "Dec 14 · 10:00 AM · 5 slots",
          "Dec 21 · 2:00 PM · 4 slots",
          "Arrive 30 minutes early",
        ],
        action: "Pick a Schedule",
        actionType: "baptism-schedule" as ChatAction,
      },
      payment: {
        eyebrow: "Secure payment",
        title: "Choose an online payment method",
        details: [
          "GCash or Maya",
          "BPI bank transfer",
          "Receipt upload required",
        ],
        action: "Pay Now",
        actionType: "payment" as ChatAction,
      },
      marriage: {
        eyebrow: "Marriage requirements",
        title: "Canonical preparation",
        details: [
          "PSA Birth Certificates",
          "PSA CENOMAR for both parties",
          "Recent Baptismal Certificates",
          "Confirmation Certificates",
          "Pre-Cana Seminar Certificate",
        ],
        action: "Pick a Schedule",
        actionType: "matrimony-schedule" as ChatAction,
      },
      certificate: {
        eyebrow: "Document request",
        title: "Baptismal Certificate · ₱50.00",
        details: [
          "Valid ID",
          "Proof of baptism, if available",
          "Authorization letter for representatives",
          "3–5 business days",
        ],
        action: "Request Document",
        actionType: "baptism-document" as ChatAction,
      },
      hours: {
        eyebrow: "Mater Salutis Parish",
        title: "Office and worship schedule",
        details: [
          "Mon–Sat · 8:00 AM–12:00 PM",
          "Mon–Sat · 1:00–5:00 PM",
          "Sunday Mass · 6 AM, 8 AM, 10 AM, 5 PM",
        ],
        action: "Pick a Schedule",
        actionType: "baptism-schedule" as ChatAction,
      },
    }[message.kind]

    return (
      <div className="mt-3 rounded-xl border border-gold/30 bg-white overflow-hidden">
        <div className="p-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gold-dark">
            {config.eyebrow}
          </p>
          <p
            className="text-sm font-semibold text-gray-800 mt-1"
            style={{ fontFamily: "Lora" }}
          >
            {config.title}
          </p>
          <ul className="mt-2 space-y-1">
            {config.details.map((detail) => (
              <li
                key={detail}
                className="flex items-start gap-1.5 text-[11px] text-gray-600"
              >
                <Icon
                  name="check"
                  size={11}
                  className="text-gold mt-0.5 flex-shrink-0"
                />
                {detail}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => {
            onAction(config.actionType)
            setIsOpen(false)
          }}
          className="chat-touch w-full px-3 bg-primary text-white text-xs font-semibold flex items-center justify-between"
        >
          {config.action}
          <Icon name="chevronRight" size={14} />
        </button>
      </div>
    )
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Ask ACROSS parish assistant"
          className="fixed z-50 right-4 bottom-4 sm:right-6 sm:bottom-6 min-w-14 h-14 px-4 rounded-full btn-primary flex items-center gap-2 shadow-2xl border-2 border-gold/70"
        >
          <Icon name="chat" size={21} />
          <span className="hidden sm:inline text-sm font-semibold">
            Ask ACROSS
          </span>
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-gold-light border-2 border-primary animate-pulse-ring" />
        </button>
      )}

      {isOpen && (
        <section
          role="dialog"
          aria-label="Ask ACROSS parish assistant"
          className="fixed z-50 inset-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[380px] sm:h-[560px] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border animate-scale-in"
        >
          <header className="flex items-center justify-between px-4 py-3.5 bg-primary-dark text-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                <Icon name="chat" size={17} className="text-gold-light" />
              </div>
              <div>
                <h2
                  className="font-semibold text-sm"
                  style={{ fontFamily: "Lora" }}
                >
                  Ask ACROSS · Parish Assistant
                </h2>
                <p className="text-[10px] text-white/55 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Automated assistant · Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="chat-touch w-11 flex items-center justify-center text-white/60 hover:text-white"
            >
              <Icon name="x" size={19} />
            </button>
          </header>

          <div
            className="flex-1 overflow-y-auto px-3 py-4 bg-[#F7F3ED]"
            aria-live="polite"
          >
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } animate-fade-in`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
                      message.role === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white border border-border text-gray-700 rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="text-xs leading-relaxed">{message.text}</p>
                    {message.role === "assistant" && (
                      <RichCard message={message} />
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div
                    className="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 flex gap-1"
                    aria-label="Assistant is typing"
                  >
                    <span className="chat-typing-dot" />
                    <span className="chat-typing-dot" />
                    <span className="chat-typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>

            {messages.length === 1 && !typing && (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Common questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => sendPrompt(reply)}
                      className="chat-touch rounded-full border border-gold/30 bg-white px-3 text-left text-[11px] font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 bg-white border-t border-border">
            {!handoff && (
              <button
                onClick={startHandoff}
                className="chat-touch w-full px-4 text-xs font-semibold text-primary flex items-center justify-center gap-2 border-b border-gray-100"
              >
                <Icon name="users" size={14} />
                Talk to parish staff
              </button>
            )}
            <form
              onSubmit={(event) => {
                event.preventDefault()
                sendPrompt(input)
              }}
              className="p-3 flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={handoff}
                placeholder={
                  handoff
                    ? "Conversation handed to parish staff"
                    : "Ask about services, schedules, or requests…"
                }
                className="chat-touch flex-1 min-w-0 rounded-xl border border-border px-3 text-xs bg-gray-50 disabled:text-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing || handoff}
                aria-label="Send message"
                className="chat-touch w-11 rounded-xl btn-primary flex items-center justify-center disabled:opacity-40"
              >
                <Icon name="send" size={16} />
              </button>
            </form>
            <p className="text-[9px] text-center text-gray-400 pb-2 px-4">
              Ask ACROSS is automated. Verify sacramental guidance with parish
              staff.
            </p>
          </div>
        </section>
      )}
    </>
  )
}

// ===================== PARISHIONER DASHBOARD =====================
const ParishionerDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [tab, setTab] = useState<ParishionerTab>("home")
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests)
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(
    null,
  )
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  )
  const [notifList, setNotifList] = useState(notifications)
  const [serviceFilter, setServiceFilter] = useState<"all" | ServiceCategory>(
    "all",
  )
  const [serviceModalStep, setServiceModalStep] = useState(1)
  const [serviceModalSubject, setServiceModalSubject] = useState("")
  const [downloadedRequest, setDownloadedRequest] = useState<string | null>(
    null,
  )
  const unreadCount = notifList.filter((n) => n.unread).length
  const visibleServices = SERVICE_CATALOG.filter(
    (service) => serviceFilter === "all" || service.category === serviceFilter,
  )

  const navItems: { key: ParishionerTab; label: string; icon: string }[] = [
    { key: "home", label: "Dashboard", icon: "home" },
    { key: "profile", label: "My Profile", icon: "user" },
    { key: "records", label: "My Records", icon: "book" },
    { key: "services", label: "Services", icon: "church" },
    { key: "requests", label: "My Requests", icon: "clipboard" },
    { key: "settings", label: "Settings", icon: "settings" },
  ]

  const handleChatAction = (action: ChatAction) => {
    if (action === "track") {
      const request =
        requests.find((item) => item.id === "ACROSS-2026-00141") || requests[0]
      setSelectedRequest(request)
      setTab("tracking")
      return
    }

    const isSchedule =
      action === "baptism-schedule" || action === "matrimony-schedule"
    const serviceLabel =
      action === "matrimony-schedule"
        ? "Matrimony"
        : action === "baptism-schedule"
          ? "Baptism"
          : action === "baptism-document"
            ? "Baptismal Certificate"
            : "Confirmation Certificate"
    const service = SERVICE_CATALOG.find(
      (item) =>
        item.category === (isSchedule ? "sacraments" : "documents") &&
        item.label === serviceLabel,
    )
    if (!service) return

    setServiceFilter(isSchedule ? "sacraments" : "documents")
    setServiceModalSubject("Joshua Pascual")
    setServiceModalStep(isSchedule ? 4 : action === "payment" ? 3 : 1)
    setSelectedService(service)
    setTab("services")
  }

  const downloadCompletionCertificate = (request: ServiceRequest) => {
    const escapeHtml = (value: string) =>
      value.replace(
        /[&<>"']/g,
        (character) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
          })[character] || character,
      )
    const completedEvent = [...request.trackingHistory]
      .reverse()
      .find((event) => event.status === "Completed")
    const completedDate =
      completedEvent?.date.split(" – ")[0] || request.scheduleDate || "2026"
    const certificate = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(request.id)} Completion Certificate</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #eee8de; color: #2a1713; font-family: Arial, sans-serif; }
    .page { width: 297mm; min-height: 210mm; padding: 13mm; background: #f8f3e9; }
    .frame { min-height: 184mm; padding: 12mm 18mm; border: 2px solid #7b1c1c; outline: 1px solid #b78b3e; outline-offset: -7px; text-align: center; position: relative; }
    .eyebrow { margin: 0; color: #7b1c1c; font-size: 10px; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; }
    .brand { margin: 7px 0 0; font-family: Georgia, serif; font-size: 27px; color: #341a18; }
    .rule { width: 75px; height: 2px; margin: 12px auto 20px; background: #b78b3e; }
    h1 { margin: 0; font-family: Georgia, serif; font-size: 38px; font-weight: 500; color: #7b1c1c; }
    .intro { margin: 15px auto 6px; font-family: Georgia, serif; font-size: 17px; color: #6b5e52; }
    .name { margin: 7px 0; font-family: Georgia, serif; font-size: 31px; font-weight: 700; color: #241613; }
    .service { margin: 12px auto 24px; max-width: 720px; font-size: 18px; line-height: 1.55; }
    .details { margin: 0 auto; max-width: 760px; display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid #d6c7b7; border-bottom: 1px solid #d6c7b7; }
    .detail { padding: 13px; border-right: 1px solid #d6c7b7; }
    .detail:last-child { border-right: 0; }
    .label { display: block; margin-bottom: 5px; color: #8c7b70; font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
    .value { font-family: Georgia, serif; font-size: 14px; font-weight: 700; }
    .signatures { margin: 27px auto 0; max-width: 690px; display: flex; justify-content: space-between; gap: 80px; }
    .signature { flex: 1; padding-top: 7px; border-top: 1px solid #4e4038; font-size: 11px; color: #6b5e52; }
    .foot { position: absolute; left: 18mm; right: 18mm; bottom: 10mm; color: #8c7b70; font-size: 9px; line-height: 1.5; }
    .ref { font-family: monospace; color: #7b1c1c; }
    @media print { body { background: white; } .page { width: 100%; min-height: 100vh; } }
  </style>
</head>
<body>
  <main class="page">
    <section class="frame">
      <p class="eyebrow">Archdiocese of Caceres · Naga City</p>
      <h2 class="brand">ACROSS</h2>
      <div class="rule"></div>
      <h1>Certificate of Completion</h1>
      <p class="intro">This certifies that</p>
      <p class="name">${escapeHtml(request.subjectName)}</p>
      <p class="service">has successfully completed the parish service workflow for <strong>${escapeHtml(request.label)}</strong> through ${escapeHtml(request.parish)}.</p>
      <div class="details">
        <div class="detail"><span class="label">Request Reference</span><span class="value">${escapeHtml(request.id)}</span></div>
        <div class="detail"><span class="label">Completion Date</span><span class="value">${escapeHtml(completedDate)}</span></div>
        <div class="detail"><span class="label">Status</span><span class="value">Completed</span></div>
      </div>
      <div class="signatures">
        <div class="signature">Parish Records Office</div>
        <div class="signature">Authorized Parish Representative</div>
      </div>
      <p class="foot">Digitally generated by ACROSS in 2026. <span class="ref">${escapeHtml(request.id)}</span><br>This certificate confirms completion of the service workflow and does not replace an official extract from the canonical register.</p>
    </section>
  </main>
</body>
</html>`
    const url = URL.createObjectURL(
      new Blob([certificate], { type: "text/html;charset=utf-8" }),
    )
    const link = document.createElement("a")
    link.href = url
    link.download = `${request.id}-completion-certificate.html`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setDownloadedRequest(request.id)
    window.setTimeout(
      () =>
        setDownloadedRequest((current) =>
          current === request.id ? null : current,
        ),
      2400,
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#EDE8DF" }}
    >
      <header
        className="flex-shrink-0 sticky top-0 z-40"
        style={{
          background: "#1C0808",
          boxShadow: "0 2px 16px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-center gap-4 lg:gap-6 px-4 lg:px-6 py-3">
          <div className="flex items-center gap-3 flex-shrink-0">
            <DiocesanSeal size={52} />
            <div
              className="text-white font-black text-2xl leading-tight tracking-tight"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              ACROSS
            </div>
          </div>
          <div
            className="hidden lg:block w-px h-12 flex-shrink-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #C4971A, transparent)",
            }}
          />
          <nav
            className="flex items-center gap-1 flex-1 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all"
                style={{
                  color:
                    tab === item.key ||
                    (item.key === "requests" && tab === "tracking")
                      ? "#C4971A"
                      : "rgba(255,255,255,0.55)",
                  background:
                    tab === item.key ||
                    (item.key === "requests" && tab === "tracking")
                      ? "rgba(196,151,26,0.12)"
                      : "transparent",
                  border:
                    tab === item.key ||
                    (item.key === "requests" && tab === "tracking")
                      ? "1px solid rgba(196,151,26,0.3)"
                      : "1px solid transparent",
                }}
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setTab("notifications")}
              title="Notifications"
              aria-label="Notifications"
              className="relative p-2 rounded-lg text-white/50 bg-white/5 hover:text-white/80 transition-colors"
            >
              <Icon name="bell" size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center bg-primary">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <img
                src={parishionerProfilePhoto}
                alt="Joshua Pascual"
                className="w-7 h-7 rounded-full object-cover border border-gold/50"
              />
              <div>
                <div className="text-white text-xs font-semibold leading-tight">
                  Joshua Pascual
                </div>
                <div className="text-white/40 text-xs">Parishioner</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign out"
              className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
            >
              <Icon name="logout" size={16} />
            </button>
          </div>
        </div>
        <div
          className="h-0.5"
          style={{
            background: `linear-gradient(to right, #7B1C1C, #C4971A ${((navItems.findIndex((n) => n.key === (tab === "tracking" ? "requests" : tab)) + 1) / navItems.length) * 100}%, transparent ${((navItems.findIndex((n) => n.key === (tab === "tracking" ? "requests" : tab)) + 1) / navItems.length) * 100}%)`,
          }}
        />
      </header>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div key={tab} className="animate-fade-in">
            {/* ── HOME TAB ── */}
            {tab === "home" && (
              <div>
                <div className="mb-6">
                  <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Lora" }}
                  >
                    Welcome Back, Joshua Pascual!
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Mater Salutis Parish · Brgy. Cararayan, Naga City
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    {
                      label: "Active Requests",
                      value: requests.filter((r) => r.status !== "completed")
                        .length,
                      icon: "clipboard",
                      color: "#7B1C1C",
                      bg: "#FDF5F5",
                    },
                    {
                      label: "Sacramental Records",
                      value: sacramentalRecords.length,
                      icon: "book",
                      color: "#1D4ED8",
                      bg: "#EFF6FF",
                    },
                    {
                      label: "Completed Services",
                      value: requests.filter((r) => r.status === "completed")
                        .length,
                      icon: "check",
                      color: "#14532D",
                      bg: "#F0FDF4",
                    },
                    {
                      label: "Notifications",
                      value: unreadCount,
                      icon: "bell",
                      color: "#B8941F",
                      bg: "#FFFBEB",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-4 card-lift"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">
                            {stat.label}
                          </p>
                          <p
                            className="text-2xl font-bold"
                            style={{ color: stat.color, fontFamily: "Lora" }}
                          >
                            {stat.value}
                          </p>
                        </div>
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ background: stat.bg }}
                        >
                          <Icon
                            name={stat.icon}
                            size={17}
                            className={`text-[${stat.color}]`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent requests */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div
                    className="lg:col-span-2 bg-white rounded-2xl p-5"
                    style={{ border: "1px solid #DDD6CE" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2
                        className="font-semibold text-gray-800"
                        style={{ fontFamily: "Lora" }}
                      >
                        Recent Requests
                      </h2>
                      <button
                        onClick={() => setTab("requests")}
                        className="text-xs font-semibold"
                        style={{ color: "#7B1C1C" }}
                      >
                        View all →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {requests.slice(0, 3).map((req) => (
                        <div
                          key={req.id}
                          onClick={() => {
                            setSelectedRequest(req)
                            setTab("tracking")
                          }}
                          className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:bg-gray-50"
                          style={{ border: "1px solid #F0EDE8" }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-base bg-gray-50 border"
                              style={{ borderColor: "#DDD6CE" }}
                            >
                              {SERVICES.find((s) => s.type === req.type)?.icon}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {req.label}
                              </p>
                              <p className="text-xs text-gray-400">
                                {req.subjectName} ·{" "}
                                <span className="font-mono">{req.id}</span>
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={req.status} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Parish calendar */}
                  <div
                    className="bg-white rounded-2xl p-5"
                    style={{ border: "1px solid #DDD6CE" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2
                          className="font-semibold text-gray-800"
                          style={{ fontFamily: "Lora" }}
                        >
                          Parish Calendar
                        </h2>
                        <p className="text-xs text-gray-400">September 2026</p>
                      </div>
                      <Icon
                        name="calendar"
                        size={19}
                        className="text-primary"
                      />
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div
                          key={day}
                          className="text-center text-[10px] font-semibold text-gray-400 py-1"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[
                        null,
                        null,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9,
                        10,
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23,
                        24,
                        25,
                        26,
                        27,
                        28,
                        29,
                        30,
                      ].map((day, index) => (
                        <button
                          key={index}
                          disabled={!day}
                          className={`aspect-square rounded-lg text-xs flex items-center justify-center transition-colors ${
                            day === 12
                              ? "bg-primary text-white font-bold hover:bg-primary-light"
                              : day === 8 || day === 19
                                ? "bg-gold/15 text-gold-dark font-semibold"
                                : day
                                  ? "text-gray-600 hover:bg-gray-100"
                                  : ""
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                    <div
                      className="mt-4 pt-4 border-t space-y-2"
                      style={{ borderColor: "#F0EDE8" }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-700">
                            Sep 12 · Our Lady of Salvation Fiesta
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Mater Salutis Parish
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-700">
                            Sep 19 · Feast of Our Lady of Peñafrancia
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Archdiocesan celebration
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notifications preview */}
                {unreadCount > 0 && (
                  <div
                    className="mt-6 rounded-2xl p-4"
                    style={{
                      background: "#FEF3C7",
                      border: "1px solid #FDE68A",
                    }}
                  >
                    <p className="text-sm font-semibold text-amber-800 mb-2">
                      📢 New Notifications
                    </p>
                    {notifList
                      .filter((n) => n.unread)
                      .slice(0, 2)
                      .map((n) => (
                        <div key={n.id} className="text-xs text-amber-700 mb-1">
                          • {n.title}: {n.message.slice(0, 80)}...
                        </div>
                      ))}
                    <button
                      onClick={() => setTab("notifications")}
                      className="text-xs font-semibold text-amber-900 mt-1 underline"
                    >
                      View all →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── PROFILE TAB ── */}
            {tab === "profile" && (
              <div>
                <div className="mb-6">
                  <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Lora" }}
                  >
                    My Profile
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Your personal information and parish membership details
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile card */}
                  <div
                    className="bg-white rounded-2xl p-6 lg:py-10 text-center flex flex-col items-center justify-center"
                    style={{ border: "1px solid #DDD6CE" }}
                  >
                    <img
                      src={parishionerProfilePhoto}
                      alt="Profile portrait of Joshua Pascual"
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-gold/40 shadow-md"
                    />
                    <h2
                      className="font-bold text-gray-800 mb-1"
                      style={{ fontFamily: "Lora" }}
                    >
                      {parishionerProfile.name}
                    </h2>
                    <p className="text-xs text-gray-400 font-mono">
                      {parishionerProfile.parishCode}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold badge-approved">
                      ✓ Active Parishioner
                    </div>
                    <div className="mt-4 text-sm text-gray-500 space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <Icon
                          name="church"
                          size={13}
                          className="text-gray-400"
                        />
                        {parishionerProfile.parish}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          name="clock"
                          size={13}
                          className="text-gray-400"
                        />
                        Since {parishionerProfile.registeredSince}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div
                    className="lg:col-span-2 bg-white rounded-2xl p-6"
                    style={{ border: "1px solid #DDD6CE" }}
                  >
                    <h3
                      className="font-semibold text-gray-800 mb-4"
                      style={{ fontFamily: "Lora" }}
                    >
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Full Name", value: parishionerProfile.name },
                        {
                          label: "Baptismal Name",
                          value: parishionerProfile.baptismalName,
                        },
                        {
                          label: "Date of Birth",
                          value: parishionerProfile.dob,
                        },
                        { label: "Gender", value: parishionerProfile.gender },
                        {
                          label: "Civil Status",
                          value: parishionerProfile.civilStatus,
                        },
                        { label: "Email", value: parishionerProfile.email },
                        { label: "Phone", value: parishionerProfile.phone },
                        {
                          label: "Barangay",
                          value: parishionerProfile.barangay,
                        },
                      ].map((field) => (
                        <div key={field.label}>
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">
                            {field.label}
                          </p>
                          <p className="text-sm text-gray-800 font-medium">
                            {field.value}
                          </p>
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">
                          Home Address
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          {parishionerProfile.address}
                        </p>
                      </div>
                    </div>
                    <div
                      className="mt-5 pt-5 border-t"
                      style={{ borderColor: "#DDD6CE" }}
                    >
                      <h3
                        className="font-semibold text-gray-800 mb-3"
                        style={{ fontFamily: "Lora" }}
                      >
                        Baptismal Sponsors
                      </h3>
                      <div className="flex gap-4">
                        <div
                          className="flex-1 p-3 rounded-xl"
                          style={{
                            background: "#F7F5F2",
                            border: "1px solid #DDD6CE",
                          }}
                        >
                          <p className="text-xs text-gray-400 mb-0.5">Ninong</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {parishionerProfile.sponsor2}
                          </p>
                        </div>
                        <div
                          className="flex-1 p-3 rounded-xl"
                          style={{
                            background: "#F7F5F2",
                            border: "1px solid #DDD6CE",
                          }}
                        >
                          <p className="text-xs text-gray-400 mb-0.5">Ninang</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {parishionerProfile.sponsor1}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── RECORDS TAB ── */}
            {tab === "records" && (
              <div>
                <div className="mb-6">
                  <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Lora" }}
                  >
                    Sacramental Records
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Your official records from the Archdiocese of Caceres
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {sacramentalRecords.map((rec, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-5 animate-fade-in card-lift"
                      style={{
                        border: "1px solid #DDD6CE",
                        animationDelay: `${i * 0.06}s`,
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #FEF3C7, #FDE68A)",
                            }}
                          >
                            {rec.type === "Baptism"
                              ? "💧"
                              : rec.type === "First Communion"
                                ? "✝"
                                : rec.type === "Confirmation"
                                  ? "🕊️"
                                  : "💍"}
                          </div>
                          <div>
                            <h3
                              className="font-bold text-gray-800"
                              style={{ fontFamily: "Lora" }}
                            >
                              {rec.type}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {rec.parish}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {rec.date}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Officiant: {rec.officiant}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <div className="text-xs font-mono text-gray-400 space-y-0.5">
                            <div>
                              Book:{" "}
                              <span className="text-gray-600 font-semibold">
                                {rec.bookNo}
                              </span>
                            </div>
                            <div>
                              Page:{" "}
                              <span className="text-gray-600 font-semibold">
                                {rec.pageNo}
                              </span>
                            </div>
                            <div>
                              Entry:{" "}
                              <span className="text-gray-600 font-semibold">
                                {rec.entryNo}
                              </span>
                            </div>
                          </div>
                          <button className="text-xs px-4 py-2 rounded-lg font-semibold btn-primary">
                            Request Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SERVICES TAB ── */}
            {tab === "services" && (
              <div>
                <div className="mb-6">
                  <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Lora" }}
                  >
                    Parish Services
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Request sacramental services and document certificates
                    online
                  </p>
                </div>
                <div
                  className="inline-flex flex-wrap items-center gap-1 p-1.5 mb-6 rounded-xl bg-white"
                  style={{ border: "1px solid #DDD6CE" }}
                >
                  {[
                    { key: "all" as const, label: "All" },
                    { key: "sacraments" as const, label: "Sacrament Services" },
                    { key: "documents" as const, label: "Documents" },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setServiceFilter(filter.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        serviceFilter === filter.key
                          ? "bg-primary text-white shadow-sm"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {visibleServices.map((svc, index) => (
                    <div
                      key={`${svc.category}-${svc.label}`}
                      className="bg-white rounded-2xl p-6 card-lift animate-fade-in flex flex-col"
                      style={{
                        border: "1px solid #DDD6CE",
                        animationDelay: `${index * 0.04}s`,
                      }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `${svc.accent}12`,
                            color: svc.accent,
                            border: `1px solid ${svc.accent}25`,
                          }}
                        >
                          <Icon name={svc.iconName} size={22} />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-1"
                            style={{ color: svc.accent }}
                          >
                            {svc.category === "documents"
                              ? "Document Request"
                              : "Sacrament Service"}
                          </p>
                          <h3
                            className="font-bold text-gray-800 text-lg leading-tight"
                            style={{ fontFamily: "Lora" }}
                          >
                            {svc.label}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {svc.description}
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="rounded-xl p-3 bg-gray-50">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Fee
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            {svc.fee}
                          </p>
                        </div>
                        <div className="rounded-xl p-3 bg-gray-50">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Processing
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            {svc.processing}
                          </p>
                        </div>
                      </div>
                      <div className="mb-5 flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Requirements
                        </p>
                        <ul className="space-y-1.5">
                          {svc.requirements.map((requirement) => (
                            <li
                              key={requirement}
                              className="text-xs text-gray-600 flex items-start gap-2"
                            >
                              <Icon
                                name="check"
                                size={12}
                                className="text-gold mt-0.5 flex-shrink-0"
                              />
                              <span>{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => {
                          setServiceModalStep(1)
                          setServiceModalSubject("")
                          setSelectedService(svc)
                        }}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold btn-primary"
                      >
                        {svc.category === "documents"
                          ? "Request Document"
                          : "Request Service"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── REQUESTS TAB ── */}
            {tab === "requests" && (
              <div>
                <div className="mb-6">
                  <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Lora" }}
                  >
                    My Requests
                  </h1>
                  <p className="text-gray-500 text-sm">
                    All submitted service requests and their current status
                  </p>
                </div>
                <div className="space-y-4">
                  {requests.map((req, i) => (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl p-5 card-lift animate-fade-in"
                      style={{
                        border:
                          req.status === "completed"
                            ? "1.5px solid #86EFAC"
                            : "1px solid #DDD6CE",
                        boxShadow:
                          req.status === "completed"
                            ? "0 6px 20px rgba(20,83,45,.08)"
                            : undefined,
                        animationDelay: `${i * 0.07}s`,
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-gray-50 border flex-shrink-0"
                            style={{ borderColor: "#DDD6CE" }}
                          >
                            {SERVICES.find((s) => s.type === req.type)?.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {req.label}
                            </h3>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                              {req.id}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Subject: {req.subjectName}
                            </p>
                            <p className="text-xs text-gray-400">
                              Submitted: {req.submittedDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <StatusBadge status={req.status} />
                          {req.scheduleDate && (
                            <p className="text-xs text-gray-500">
                              📅 {req.scheduleDate} · {req.scheduleTime}
                            </p>
                          )}
                          {req.status === "completed" ? (
                            <div className="flex flex-col sm:items-end gap-1.5">
                              <button
                                onClick={() =>
                                  downloadCompletionCertificate(req)
                                }
                                className="min-h-11 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                                style={{
                                  background: "#14532D",
                                  boxShadow: "0 3px 10px rgba(20,83,45,.24)",
                                }}
                              >
                                <Icon
                                  name={
                                    downloadedRequest === req.id
                                      ? "check"
                                      : "file"
                                  }
                                  size={15}
                                />
                                {downloadedRequest === req.id
                                  ? "Certificate Downloaded"
                                  : "Download Certificate"}
                              </button>
                              <span className="text-[10px] font-medium text-green-700">
                                Your completed service record is ready
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedRequest(req)
                                setTab("tracking")
                              }}
                              className="text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors hover:bg-gray-50"
                              style={{
                                borderColor: "#7B1C1C",
                                color: "#7B1C1C",
                              }}
                            >
                              Track →
                            </button>
                          )}
                        </div>
                      </div>
                      {req.notes && (
                        <div
                          className="mt-4 p-3 rounded-xl text-sm text-amber-800 flex items-start gap-2"
                          style={{
                            background: "#FEF3C7",
                            border: "1px solid #FDE68A",
                          }}
                        >
                          <span>📌</span>{" "}
                          <span className="text-xs">{req.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => setTab("services")}
                    className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold"
                  >
                    + New Request
                  </button>
                </div>
              </div>
            )}

            {/* ── TRACKING TAB ── */}
            {tab === "tracking" && (
              <div>
                <div className="mb-6">
                  <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Lora" }}
                  >
                    My Requests & Tracking
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Review your requests and follow their real-time status
                    updates
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    {requests.map((req) => (
                      <button
                        key={req.id}
                        onClick={() => setSelectedRequest(req)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          selectedRequest?.id === req.id
                            ? "border-[#7B1C1C] bg-red-50"
                            : "bg-white hover:bg-gray-50 border-gray-200"
                        } border`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-800">
                            {req.label}
                          </span>
                          <StatusBadge status={req.status} />
                        </div>
                        <p className="text-xs text-gray-400 font-mono">
                          {req.id}
                        </p>
                      </button>
                    ))}
                  </div>

                  {selectedRequest ? (
                    <div
                      className="lg:col-span-2 bg-white rounded-2xl p-6 animate-slide-right"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">
                              {
                                SERVICES.find(
                                  (s) => s.type === selectedRequest.type,
                                )?.icon
                              }
                            </span>
                            <h2
                              className="font-bold text-gray-800"
                              style={{ fontFamily: "Lora" }}
                            >
                              {selectedRequest.label}
                            </h2>
                          </div>
                          <p className="text-xs font-mono text-gray-400">
                            {selectedRequest.id}
                          </p>
                        </div>
                        <StatusBadge status={selectedRequest.status} />
                      </div>

                      {selectedRequest.scheduleDate && (
                        <div
                          className="p-4 rounded-xl mb-6 flex items-center gap-3"
                          style={{
                            background: "#D1FAE5",
                            border: "1px solid #86EFAC",
                          }}
                        >
                          <span className="text-2xl">📅</span>
                          <div>
                            <p className="text-sm font-semibold text-green-800">
                              Schedule Confirmed
                            </p>
                            <p className="text-sm text-green-700">
                              {selectedRequest.scheduleDate} at{" "}
                              {selectedRequest.scheduleTime}
                            </p>
                            {selectedRequest.officiantName && (
                              <p className="text-xs text-green-600">
                                Officiant: {selectedRequest.officiantName}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <h3 className="font-semibold text-gray-700 mb-4 text-sm">
                        Transaction Timeline
                      </h3>
                      <div className="relative">
                        {selectedRequest.trackingHistory.map((evt, i) => (
                          <div key={i} className="flex gap-4 mb-4">
                            <div className="flex flex-col items-center">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                style={{
                                  background:
                                    i ===
                                    selectedRequest.trackingHistory.length - 1
                                      ? "#7B1C1C"
                                      : "#B8941F",
                                }}
                              >
                                {i ===
                                selectedRequest.trackingHistory.length - 1
                                  ? "●"
                                  : "✓"}
                              </div>
                              {i <
                                selectedRequest.trackingHistory.length - 1 && (
                                <div
                                  className="w-0.5 flex-1 mt-1"
                                  style={{
                                    background: "#DDD6CE",
                                    minHeight: "24px",
                                  }}
                                />
                              )}
                            </div>
                            <div className="pb-4">
                              <p className="text-xs font-mono text-gray-400">
                                {evt.date}
                              </p>
                              <p className="font-semibold text-sm text-gray-800">
                                {evt.status}
                              </p>
                              <p className="text-sm text-gray-500">
                                {evt.note}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedRequest.notes && (
                        <div
                          className="mt-2 p-4 rounded-xl"
                          style={{
                            background: "#FEF3C7",
                            border: "1px solid #FDE68A",
                          }}
                        >
                          <p className="text-xs font-semibold text-amber-800 mb-1">
                            📌 Staff Note
                          </p>
                          <p className="text-sm text-amber-800">
                            {selectedRequest.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="lg:col-span-2 bg-white rounded-2xl p-6 flex items-center justify-center"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <div className="text-center text-gray-400">
                        <Icon
                          name="history"
                          size={40}
                          className="mx-auto mb-3 opacity-30"
                        />
                        <p className="text-sm">
                          Select a request to view tracking details
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {tab === "notifications" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1
                      className="text-2xl font-bold text-gray-800"
                      style={{ fontFamily: "Lora" }}
                    >
                      Notifications
                    </h1>
                    <p className="text-gray-500 text-sm">
                      {unreadCount} unread
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifList(
                        notifList.map((n) => ({ ...n, unread: false })),
                      )
                    }
                    className="text-xs font-semibold px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
                    style={{ borderColor: "#7B1C1C", color: "#7B1C1C" }}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="space-y-3">
                  {notifList.map((notif, i) => (
                    <div
                      key={notif.id}
                      onClick={() =>
                        setNotifList(
                          notifList.map((n) =>
                            n.id === notif.id ? { ...n, unread: false } : n,
                          ),
                        )
                      }
                      className={`bg-white rounded-2xl p-5 cursor-pointer transition-all card-lift animate-fade-in ${
                        notif.unread ? "border-l-4" : ""
                      }`}
                      style={{
                        border: `1px solid #DDD6CE`,
                        borderLeftColor: notif.unread ? "#7B1C1C" : "#DDD6CE",
                        animationDelay: `${i * 0.06}s`,
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-gray-50">
                          {notif.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm text-gray-800">
                              {notif.title}
                            </p>
                            {notif.unread && (
                              <span className="notif-dot flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── HISTORY TAB ── */}
            {tab === "history" && (
              <div>
                <div className="mb-6">
                  <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Lora" }}
                  >
                    Transaction History
                  </h1>
                  <p className="text-gray-500 text-sm">
                    All completed and past service transactions
                  </p>
                </div>
                <div
                  className="bg-white rounded-2xl"
                  style={{ border: "1px solid #DDD6CE" }}
                >
                  <div
                    className="p-4 border-b flex items-center gap-3"
                    style={{ borderColor: "#DDD6CE" }}
                  >
                    <div className="flex-1 relative">
                      <Icon
                        name="search"
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Search history..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
                        style={{ borderColor: "#DDD6CE" }}
                      />
                    </div>
                    <select
                      className="px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: "#DDD6CE" }}
                    >
                      <option>All Types</option>
                      <option>Baptism</option>
                      <option>Matrimony</option>
                      <option>Confirmation</option>
                      <option>Burial</option>
                    </select>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "#F7F5F2" }}>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Reference No.
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req, i) => (
                        <tr
                          key={req.id}
                          className="border-t hover:bg-gray-50 transition-colors"
                          style={{ borderColor: "#DDD6CE" }}
                        >
                          <td className="px-4 py-3 text-xs font-mono text-gray-500">
                            {req.id}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {SERVICES.find((s) => s.type === req.type)?.icon}{" "}
                            {req.label}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {req.subjectName}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">
                            {req.submittedDate}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={req.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {tab === "settings" && (
              <div className="min-h-[calc(100dvh-7rem)] lg:min-h-[calc(100dvh-9rem)] flex flex-col">
                <div className="mb-6">
                  <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Lora" }}
                  >
                    Account Settings
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Manage your account preferences and notifications
                  </p>
                </div>
                <div className="space-y-6 max-w-2xl w-full">
                  {[
                    {
                      section: "Notification Preferences",
                      items: [
                        {
                          label: "Email notifications for request updates",
                          enabled: true,
                        },
                        {
                          label: "SMS alerts for approved requests",
                          enabled: true,
                        },
                        {
                          label: "Parish announcements and events",
                          enabled: false,
                        },
                      ],
                    },
                    {
                      section: "Privacy Settings",
                      items: [
                        {
                          label: "Allow parish staff to view my profile",
                          enabled: true,
                        },
                        {
                          label: "Show my records to affiliated parishes",
                          enabled: false,
                        },
                      ],
                    },
                    {
                      section: "Account",
                      items: [
                        { label: "Two-factor authentication", enabled: false },
                        { label: "Login activity alerts", enabled: true },
                      ],
                    },
                  ].map(({ section, items }) => (
                    <div
                      key={section}
                      className="bg-white rounded-2xl p-5"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <h3
                        className="font-semibold text-gray-800 mb-4"
                        style={{ fontFamily: "Lora" }}
                      >
                        {section}
                      </h3>
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between"
                          >
                            <p className="text-sm text-gray-700">
                              {item.label}
                            </p>
                            <button
                              className={`w-12 h-6 rounded-full transition-all relative ${
                                item.enabled ? "bg-[#7B1C1C]" : "bg-gray-200"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                  item.enabled ? "left-6" : "left-0.5"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <footer className="mt-auto pt-12 max-w-2xl w-full">
                  <div
                    className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    style={{
                      background: "#FFF8F5",
                      border: "1px solid #FECACA",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "#FEE2E2", color: "#991B1B" }}
                      >
                        <Icon name="logout" size={17} />
                      </span>
                      <div>
                        <p
                          className="text-sm font-semibold text-gray-800"
                          style={{ fontFamily: "Lora" }}
                        >
                          Session & Access
                        </p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          Securely end your current ACROSS session on this
                          device.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onLogout}
                      className="min-h-11 px-5 rounded-xl flex items-center justify-center gap-2 text-sm text-white font-semibold transition-all hover:-translate-y-0.5 flex-shrink-0"
                      style={{
                        background: "#991B1B",
                        boxShadow: "0 3px 10px rgba(153,27,27,.2)",
                      }}
                    >
                      <Icon name="logout" size={16} /> Sign Out of ACROSS
                    </button>
                  </div>
                </footer>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Service request modal */}
      {selectedService && (
        <ServiceRequestModal
          service={selectedService}
          initialStep={serviceModalStep}
          initialSubject={serviceModalSubject}
          onClose={() => setSelectedService(null)}
          onSubmit={(newReq) => {
            setRequests([newReq, ...requests])
            setTimeout(() => setSelectedService(null), 3000)
          }}
        />
      )}

      <AskAcross onAction={handleChatAction} />
    </div>
  )
}

// ===================== STAFF REQUEST REVIEW MODAL =====================
const StaffReviewModal = ({
  request,
  onClose,
  onApprove,
  onReturn,
}: {
  request: typeof staffRequests[0]
  onClose: () => void
  onApprove: (id: string, note: string, schedule: string, time: string) => void
  onReturn: (id: string, note: string) => void
}) => {
  const [mode, setMode] = useState<"review" | "approve" | "return">("review")
  const [approveNote, setApproveNote] = useState("")
  const [returnNote, setReturnNote] = useState("")
  const [schedule, setSchedule] = useState("")
  const [time, setTime] = useState("")
  const [selectedDocument, setSelectedDocument] = useState(
    request.requirements[0],
  )
  const [verifiedDocuments, setVerifiedDocuments] =
    useState<Record<string, boolean>>(
      Object.fromEntries(
        request.requirements.map((requirement) => [requirement, true]),
      ),
    )
  const [affectedDocuments, setAffectedDocuments] = useState<string[]>([])
  const [discrepancies, setDiscrepancies] = useState<string[]>([])
  const [returnError, setReturnError] = useState("")

  const discrepancyOptions = [
    "Missing or incomplete document",
    "Unreadable or low-quality scan",
    "Information does not match request",
    "Missing signature, seal, or certification",
    "Incorrect document type",
  ]

  const openReturnFlow = () => {
    const unverified = request.requirements.filter(
      (requirement) => !verifiedDocuments[requirement],
    )
    setAffectedDocuments(
      unverified.length > 0 ? unverified : [selectedDocument],
    )
    setMode("return")
    setReturnError("")
  }

  const toggleListItem = (
    value: string,
    values: string[],
    setValues: (items: string[]) => void,
  ) => {
    setValues(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    )
    setReturnError("")
  }

  const submitReturn = () => {
    if (
      affectedDocuments.length === 0 ||
      discrepancies.length === 0 ||
      !returnNote.trim()
    ) {
      setReturnError(
        "Select an affected document and discrepancy, then add a note for the applicant.",
      )
      return
    }

    const notice = [
      `Correction requested for: ${affectedDocuments.join(", ")}.`,
      `Discrepancies: ${discrepancies.join("; ")}.`,
      `Staff note: ${returnNote.trim()}`,
      `Applicant notified via ACROSS and email (${request.parishionerEmail}).`,
    ].join(" ")
    onReturn(request.id, notice)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl animate-scale-in flex flex-col max-h-[92vh] overflow-hidden">
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ background: "linear-gradient(135deg, #7B1C1C, #9B2C2C)" }}
        >
          <div>
            <h2
              className="text-white font-semibold"
              style={{ fontFamily: "Lora" }}
            >
              Review Request
            </h2>
            <p className="text-white/60 text-xs font-mono">{request.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Request summary */}
          <div
            className="rounded-xl p-4 mb-4"
            style={{ background: "#F7F5F2", border: "1px solid #DDD6CE" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">
                {SERVICES.find((s) => s.type === request.type)?.icon}
              </span>
              <div>
                <p className="font-semibold text-gray-800">{request.label}</p>
                <p className="text-xs text-gray-500">
                  Submitted: {request.submittedDate}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                  Subject
                </p>
                <p className="font-medium text-gray-700">
                  {request.subjectName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                  Contact
                </p>
                <p className="font-medium text-gray-700">{request.contactNo}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                  Email
                </p>
                <p className="font-medium text-gray-700">
                  {request.parishionerEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Document review workspace */}
          <div className="mb-4">
            <div className="flex items-end justify-between gap-4 mb-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Required Documents
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Select a file to inspect it without leaving this request.
                </p>
              </div>
              <span className="text-xs font-semibold text-green-700">
                {Object.values(verifiedDocuments).filter(Boolean).length}/
                {request.requirements.length} verified
              </span>
            </div>
            <div
              className="grid md:grid-cols-[minmax(240px,0.8fr)_minmax(360px,1.2fr)] rounded-xl overflow-hidden border"
              style={{ borderColor: "#DDD6CE" }}
            >
              <div className="p-3 space-y-2" style={{ background: "#F7F5F2" }}>
                {request.requirements.map((requirement, index) => (
                  <button
                    key={requirement}
                    type="button"
                    onClick={() => setSelectedDocument(requirement)}
                    className="w-full text-left rounded-xl p-3 transition-all"
                    style={{
                      background:
                        selectedDocument === requirement
                          ? "#FFFFFF"
                          : "transparent",
                      border:
                        selectedDocument === requirement
                          ? "1px solid #B8941F"
                          : "1px solid transparent",
                      boxShadow:
                        selectedDocument === requirement
                          ? "0 3px 12px rgba(30,23,20,.08)"
                          : "none",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "#FEE2E2", color: "#7B1C1C" }}
                      >
                        <Icon name="book" size={15} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-gray-800 leading-tight">
                          {requirement}
                        </span>
                        <span className="block text-[11px] text-gray-400 mt-1 truncate">
                          PDF · {(1.2 + index * 0.4).toFixed(1)} MB
                        </span>
                      </span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          color:
                            selectedDocument === requirement
                              ? "#7B1C1C"
                              : "#9C8F84",
                        }}
                      >
                        Preview
                      </span>
                    </div>
                    <label
                      className="mt-3 flex items-center gap-2 text-xs font-semibold text-green-700"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={verifiedDocuments[requirement]}
                        onChange={(event) =>
                          setVerifiedDocuments({
                            ...verifiedDocuments,
                            [requirement]: event.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      Verified against request
                    </label>
                  </button>
                ))}
              </div>

              <div className="p-4 md:p-5 bg-[#E9E4DC] min-h-[300px]">
                <div className="mb-3">
                  <div>
                    <p className="text-xs font-bold text-gray-700">
                      {selectedDocument}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Uploaded Nov 22, 2026 · PDF document
                    </p>
                  </div>
                </div>
                <div
                  className="mx-auto max-w-md min-h-[235px] bg-white shadow-md border px-8 py-6 relative overflow-hidden"
                  style={{ borderColor: "#D5CEC5" }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: "#7B1C1C" }}
                  />
                  <div
                    className="text-center border-b pb-4"
                    style={{ borderColor: "#E7E1D9" }}
                  >
                    <p className="text-[9px] font-mono tracking-[0.25em] text-gray-400 uppercase">
                      Uploaded supporting document
                    </p>
                    <h3
                      className="text-base font-bold text-gray-800 mt-2"
                      style={{ fontFamily: "Lora" }}
                    >
                      {selectedDocument}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Certified copy · 2026
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-4 mt-5">
                    {[
                      ["Applicant / Subject", request.subjectName],
                      ["Request reference", request.id],
                      ["Parish", request.parish],
                      ["Document status", "Complete · Legible"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[8px] uppercase tracking-wider text-gray-400">
                          {label}
                        </p>
                        <p className="text-[11px] font-semibold text-gray-700 mt-1">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div
                    className="mt-6 pt-3 border-t flex items-center justify-between"
                    style={{ borderColor: "#E7E1D9" }}
                  >
                    <span className="text-[9px] text-gray-400">
                      Preview generated securely in ACROSS
                    </span>
                    <span className="text-[9px] font-mono text-gray-400">
                      Page 1 of 1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {mode === "approve" && (
            <div className="space-y-4 animate-fade-in">
              <div className="h-px" style={{ background: "#DDD6CE" }} />
              <p
                className="font-semibold text-gray-800 text-sm"
                style={{ fontFamily: "Lora" }}
              >
                Set Schedule
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">
                    Date
                  </label>
                  <input
                    type="date"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "#DDD6CE" }}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "#DDD6CE" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">
                  Message to Parishioner
                </label>
                <textarea
                  rows={3}
                  value={approveNote}
                  onChange={(e) => setApproveNote(e.target.value)}
                  placeholder="Add instructions or reminders..."
                  className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                  style={{ borderColor: "#DDD6CE" }}
                />
              </div>
            </div>
          )}

          {mode === "return" && (
            <div className="space-y-4 animate-fade-in">
              <div className="h-px" style={{ background: "#DDD6CE" }} />
              <div>
                <p
                  className="font-semibold text-gray-800 text-sm"
                  style={{ fontFamily: "Lora" }}
                >
                  Return for Correction
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Record the discrepancy once; ACROSS will build and send the
                  applicant notice.
                </p>
              </div>
              <fieldset>
                <legend className="block text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">
                  Affected documents
                </legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {request.requirements.map((requirement) => (
                    <label
                      key={requirement}
                      className="flex items-start gap-2 rounded-lg border bg-white p-3 text-xs text-gray-700"
                      style={{ borderColor: "#DDD6CE" }}
                    >
                      <input
                        type="checkbox"
                        checked={affectedDocuments.includes(requirement)}
                        onChange={() =>
                          toggleListItem(
                            requirement,
                            affectedDocuments,
                            setAffectedDocuments,
                          )
                        }
                        className="mt-0.5 rounded"
                      />
                      {requirement}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="block text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">
                  Discrepancy type
                </legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {discrepancyOptions.map((discrepancy) => (
                    <label
                      key={discrepancy}
                      className="flex items-start gap-2 rounded-lg border bg-white p-3 text-xs text-gray-700"
                      style={{ borderColor: "#DDD6CE" }}
                    >
                      <input
                        type="checkbox"
                        checked={discrepancies.includes(discrepancy)}
                        onChange={() =>
                          toggleListItem(
                            discrepancy,
                            discrepancies,
                            setDiscrepancies,
                          )
                        }
                        className="mt-0.5 rounded"
                      />
                      {discrepancy}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">
                  Note to applicant
                </label>
                <textarea
                  rows={3}
                  value={returnNote}
                  onChange={(e) => {
                    setReturnNote(e.target.value)
                    setReturnError("")
                  }}
                  placeholder="Give the applicant a clear next step, such as which page or detail to replace."
                  className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                  style={{ borderColor: returnError ? "#B91C1C" : "#DDD6CE" }}
                />
              </div>
              {returnError && (
                <p role="alert" className="text-xs font-semibold text-red-700">
                  {returnError}
                </p>
              )}
              <div
                className="rounded-xl p-3 flex items-start gap-3"
                style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
              >
                <Icon
                  name="bell"
                  size={16}
                  className="text-blue-700 mt-0.5 flex-shrink-0"
                />
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Automatic notification:</strong> The correction
                  summary and note will be sent to {request.parishionerEmail}{" "}
                  and added to the applicant’s ACROSS notifications.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between gap-3">
          {mode === "review" ? (
            <>
              <button
                onClick={openReturnFlow}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-red-50"
                style={{ borderColor: "#7F1D1D", color: "#7F1D1D" }}
              >
                ↩ Return
              </button>
              <button
                onClick={() => setMode("approve")}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary"
              >
                ✓ Approve
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setMode("review")}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                ← Back
              </button>
              {mode === "approve" ? (
                <button
                  onClick={() =>
                    onApprove(request.id, approveNote, schedule, time)
                  }
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary"
                >
                  Confirm Approval
                </button>
              ) : (
                <button
                  onClick={submitReturn}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: "#7F1D1D", color: "white" }}
                >
                  <Icon name="send" size={14} /> Return & Notify Applicant
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ===================== STAFF DASHBOARD =====================
const StaffDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [tab, setTab] = useState<StaffTab>("home")
  const [requests, setRequests] = useState(staffRequests)
  const [filterStatus, setFilterStatus] = useState<RequestStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [reviewingReq, setReviewingReq] =
    useState<typeof staffRequests[0] | null>(null)
  const [notifList, setNotifList] = useState(staffNotifications)
  const [reports, setReports] = useState(archdioceseReports)
  const [reportCategory, setReportCategory] =
    useState<"all" | StaffReportCategory>("all")
  const [creatingReport, setCreatingReport] = useState(false)
  const [newReport, setNewReport] = useState({
    category: "Sacramental Records" as StaffReportCategory,
    period: "4th Quarter 2026",
    baptisms: "",
    matrimony: "",
    confirmations: "",
    burials: "",
    parishioners: "",
    households: "",
    newRegistrations: "",
    sundayOffertory: "",
    specialCollections: "",
    donations: "",
    expenses: "",
    recordsReviewed: "",
    discrepancies: "",
    corrections: "",
    activeMinistries: "",
    volunteers: "",
    activities: "",
    assetsCount: "",
    repairs: "",
    maintenanceCost: "",
    notes: "",
  })
  const [parishSearch, setParishSearch] = useState("")
  const [donations, setDonations] = useState<DonationRecord[]>(initialDonations)
  const [selectedYear, setSelectedYear] = useState<string>("2026")
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-10")
  const [selectedDay, setSelectedDay] = useState<string>("all")
  const [donationCategoryFilter, setDonationCategoryFilter] =
    useState<"all" | DonationCategory>("all")
  const [donationSearchQuery, setDonationSearchQuery] = useState("")
  const [isLoggingDonation, setIsLoggingDonation] = useState(false)
  const [donationFormError, setDonationFormError] = useState<string | null>(
    null,
  )
  const [donationToast, setDonationToast] = useState<string | null>(null)
  const [newDonationForm, setNewDonationForm] = useState({
    donorName: "",
    contactInfo: "",
    isAnonymous: false,
    date: "2026-10-26",
    category: "Cash" as DonationCategory,
    cashAmount: "",
    paymentMethod: "Cash",
    foodItemName: "",
    foodType: "Canned Goods",
    foodQuantity: "",
    foodUnit: "cans",
    otherItemName: "",
    otherQuantity: "",
    notes: "",
  })
  const unreadCount = notifList.filter((n) => n.unread).length
  const pendingCount = requests.filter((r) => r.status === "pending").length
  const filteredReports = reports.filter(
    (report) => reportCategory === "all" || report.category === reportCategory,
  )

  const formatDateDisplay = (isoDate: string) => {
    const [year, month, day] = isoDate.split("-").map(Number)
    if (!year || !month || !day) return isoDate
    const dt = new Date(year, month - 1, day)
    return dt.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatMonthDisplay = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-").map(Number)
    if (!year || !month) return yearMonth
    const dt = new Date(year, month - 1, 1)
    return dt.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const availableYears = Array.from(
    new Set(["2026", "2025", ...donations.map((d) => d.dateKey.slice(0, 4))]),
  ).sort((a, b) => b.localeCompare(a))

  const availableMonthsForYear = Array.from(
    new Set(
      donations
        .filter((d) => d.dateKey.startsWith(selectedYear))
        .map((d) => d.dateKey.slice(0, 7)),
    ),
  ).sort((a, b) => b.localeCompare(a))

  const availableDaysForMonth =
    selectedMonth === "all"
      ? []
      : Array.from(
          new Set(
            donations
              .filter((d) => d.dateKey.startsWith(selectedMonth))
              .map((d) => d.dateKey),
          ),
        ).sort((a, b) => b.localeCompare(a))

  const drillLevel: "year" | "month" | "day" =
    selectedMonth === "all" ? "year" : selectedDay === "all" ? "month" : "day"

  const currentPeriodLabel =
    drillLevel === "year"
      ? `Annual Summary · ${selectedYear}`
      : drillLevel === "month"
        ? `Monthly Summary · ${formatMonthDisplay(selectedMonth)}`
        : `Daily Summary · ${formatDateDisplay(selectedDay)}`

  const filteredDonations = donations.filter((d) => {
    const matchDate =
      selectedDay !== "all"
        ? d.dateKey === selectedDay
        : selectedMonth !== "all"
          ? d.dateKey.startsWith(selectedMonth)
          : d.dateKey.startsWith(selectedYear)
    const matchCategory =
      donationCategoryFilter === "all" || d.category === donationCategoryFilter
    const q = donationSearchQuery.toLowerCase().trim()
    const matchSearch =
      !q ||
      d.donorName.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.subDetail.toLowerCase().includes(q) ||
      d.staffHandler.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q)
    return matchDate && matchCategory && matchSearch
  })

  const totalCashCollected = filteredDonations
    .filter((d) => d.category === "Cash")
    .reduce((sum, d) => sum + (d.cashAmount || 0), 0)

  const totalFoodUnits = filteredDonations
    .filter((d) => d.category === "Food")
    .reduce((sum, d) => sum + (d.goodsCount || 0), 0)

  const totalOtherUnits = filteredDonations
    .filter((d) => d.category === "Other")
    .reduce((sum, d) => sum + (d.goodsCount || 0), 0)

  const handleSaveDonation = () => {
    setDonationFormError(null)
    const donorDisplay = newDonationForm.isAnonymous
      ? "Anonymous"
      : newDonationForm.donorName.trim()
    if (!newDonationForm.isAnonymous && !donorDisplay) {
      setDonationFormError(
        "Please enter the donor name or enable the Anonymous toggle.",
      )
      return
    }

    let description = ""
    let subDetail = ""
    let quantityOrAmount = ""
    let cashAmount: number | undefined
    let goodsCount: number | undefined

    if (newDonationForm.category === "Cash") {
      const parsedAmount = parseFloat(newDonationForm.cashAmount)
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setDonationFormError(
          "Please enter a valid monetary amount greater than ₱0.00.",
        )
        return
      }
      cashAmount = parsedAmount
      quantityOrAmount = `₱${parsedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      description = newDonationForm.notes.trim()
        ? newDonationForm.notes.trim()
        : `${newDonationForm.paymentMethod} Offertory & Donation`
      subDetail = `Payment Method: ${newDonationForm.paymentMethod}`
    } else if (newDonationForm.category === "Food") {
      if (!newDonationForm.foodItemName.trim()) {
        setDonationFormError("Please enter the food item name.")
        return
      }
      const parsedQty = parseInt(newDonationForm.foodQuantity, 10)
      if (isNaN(parsedQty) || parsedQty <= 0) {
        setDonationFormError(
          "Please enter a valid quantity for the food donation.",
        )
        return
      }
      goodsCount = parsedQty
      quantityOrAmount = `${parsedQty} ${newDonationForm.foodUnit}`
      description = `${parsedQty} ${newDonationForm.foodUnit} of ${newDonationForm.foodItemName.trim()}`
      subDetail = `${newDonationForm.foodType} · Parish Pantry Inventory`
    } else {
      if (!newDonationForm.otherItemName.trim()) {
        setDonationFormError("Please enter the item category or name.")
        return
      }
      const parsedQty = parseInt(newDonationForm.otherQuantity, 10)
      if (isNaN(parsedQty) || parsedQty <= 0) {
        setDonationFormError("Please enter a valid quantity for the item.")
        return
      }
      goodsCount = parsedQty
      quantityOrAmount = `${parsedQty} ${parsedQty === 1 ? "item" : "items"}`
      description = newDonationForm.otherItemName.trim()
      subDetail = "Liturgical & Parish Material Donation"
    }

    const newRecord: DonationRecord = {
      id: `DON-${newDonationForm.date.replace(/-/g, "")}-${String(donations.length + 1).padStart(2, "0")}`,
      dateKey: newDonationForm.date,
      dateLabel: formatDateDisplay(newDonationForm.date),
      timeLabel: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      donorName: donorDisplay || "Anonymous",
      isAnonymous: newDonationForm.isAnonymous,
      contactInfo: newDonationForm.isAnonymous
        ? "Anonymous Parishioner"
        : newDonationForm.contactInfo.trim() || "No contact provided",
      category: newDonationForm.category,
      description,
      subDetail,
      quantityOrAmount,
      cashAmount,
      goodsCount,
      paymentMethod:
        newDonationForm.category === "Cash"
          ? newDonationForm.paymentMethod
          : undefined,
      foodType:
        newDonationForm.category === "Food"
          ? newDonationForm.foodType
          : undefined,
      notes: newDonationForm.notes.trim() || undefined,
      staffHandler: "Sec. Lourdes Casas",
    }

    setDonations([newRecord, ...donations])
    setSelectedYear(newDonationForm.date.slice(0, 4))
    setSelectedMonth(newDonationForm.date.slice(0, 7))
    setSelectedDay(newDonationForm.date)
    setIsLoggingDonation(false)
    setNewDonationForm({
      donorName: "",
      contactInfo: "",
      isAnonymous: false,
      date: newDonationForm.date,
      category: "Cash",
      cashAmount: "",
      paymentMethod: "Cash",
      foodItemName: "",
      foodType: "Canned Goods",
      foodQuantity: "",
      foodUnit: "cans",
      otherItemName: "",
      otherQuantity: "",
      notes: "",
    })
    setDonationToast(
      `Logged ${newRecord.category.toLowerCase()} donation (${newRecord.quantityOrAmount}) from ${newRecord.donorName}.`,
    )
    setTimeout(() => setDonationToast(null), 4000)
  }
  const reportFields: Record<StaffReportCategory, {
    key: keyof typeof newReport
    label: string
  }[]> = {
    Census: [
      { key: "parishioners", label: "Registered Parishioners" },
      { key: "households", label: "Registered Households" },
      { key: "newRegistrations", label: "New Registrations" },
    ],
    "Sacramental Records": [
      { key: "baptisms", label: "Baptisms" },
      { key: "matrimony", label: "Matrimony" },
      { key: "confirmations", label: "Confirmations" },
      { key: "burials", label: "Burial Masses" },
    ],
    "Offertory & Collections": [
      { key: "sundayOffertory", label: "Sunday Offertory (₱)" },
      { key: "specialCollections", label: "Special Collections (₱)" },
      { key: "donations", label: "Donations (₱)" },
      { key: "expenses", label: "Parish Expenses (₱)" },
    ],
    "Parish Records": [
      { key: "recordsReviewed", label: "Records Reviewed" },
      { key: "discrepancies", label: "Discrepancies Found" },
      { key: "corrections", label: "Corrections Completed" },
    ],
    Ministries: [
      { key: "activeMinistries", label: "Active Ministries" },
      { key: "volunteers", label: "Active Volunteers" },
      { key: "activities", label: "Formation Activities" },
    ],
    "Assets & Maintenance": [
      { key: "assetsCount", label: "Assets Inventoried" },
      { key: "repairs", label: "Repairs Completed" },
      { key: "maintenanceCost", label: "Maintenance Cost (₱)" },
    ],
  }

  const navItems: { key: StaffTab; label: string; icon: string }[] = [
    { key: "home", label: "Dashboard", icon: "home" },
    { key: "parishioners", label: "Parishioner", icon: "users" },
    { key: "schedule", label: "Calendar", icon: "calendar" },
    { key: "requests", label: "Requests", icon: "clipboard" },
    { key: "records", label: "Records", icon: "book" },
    { key: "donations", label: "Donations & Offerings", icon: "heart" },
    { key: "reports", label: "Reports", icon: "chart" },
    { key: "settings", label: "Settings", icon: "settings" },
  ]

  const filteredRequests = requests.filter((r) => {
    const matchStatus = filterStatus === "all" || r.status === filterStatus
    const matchSearch =
      !searchQuery ||
      r.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchSearch
  })

  const handleApprove = (
    id: string,
    note: string,
    schedule: string,
    time: string,
  ) => {
    setRequests(
      requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "approved" as RequestStatus,
              scheduleDate: schedule || "TBD",
              scheduleTime: time || "TBD",
              notes: note,
              trackingHistory: [
                ...r.trackingHistory,
                {
                  date: "Now",
                  status: "Approved",
                  note: note || "Request has been approved by parish staff.",
                },
              ],
            }
          : r,
      ),
    )
    setReviewingReq(null)
  }

  const handleReturn = (id: string, note: string) => {
    setRequests(
      requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "returned" as RequestStatus,
              notes: note,
              trackingHistory: [
                ...r.trackingHistory,
                { date: "Now", status: "Returned", note },
              ],
            }
          : r,
      ),
    )
    setReviewingReq(null)
  }

  const handleSubmitReport = () => {
    const value = (key: keyof typeof newReport) =>
      parseInt(String(newReport[key])) || 0
    const sacramentTotal =
      value("baptisms") +
      value("matrimony") +
      value("confirmations") +
      value("burials")
    const summaries: Record<StaffReportCategory, string> = {
      Census: `${value("parishioners").toLocaleString()} parishioners · ${value("households").toLocaleString()} households · ${value("newRegistrations")} new registrations`,
      "Sacramental Records": `${sacramentTotal} sacramental records submitted for verification`,
      "Offertory & Collections": `₱${value("sundayOffertory").toLocaleString()} Sunday offertory · ₱${value("specialCollections").toLocaleString()} special collections · ₱${value("donations").toLocaleString()} donations`,
      "Parish Records": `${value("recordsReviewed")} records reviewed · ${value("discrepancies")} discrepancies · ${value("corrections")} corrections completed`,
      Ministries: `${value("activeMinistries")} active ministries · ${value("volunteers")} volunteers · ${value("activities")} formation activities`,
      "Assets & Maintenance": `${value("assetsCount")} assets inventoried · ${value("repairs")} repairs · ₱${value("maintenanceCost").toLocaleString()} maintenance cost`,
    }
    const pending = reports.find(
      (report) =>
        report.status === "pending" && report.category === newReport.category,
    )
    const submittedReport: StaffReport = {
      id:
        pending?.id ||
        `RPT-2026-${String(reports.length + 1).padStart(3, "0")}`,
      title:
        pending?.title || `${newReport.period} ${newReport.category} Report`,
      category: newReport.category,
      period: newReport.period,
      dueDate: pending?.dueDate || "Dec 15, 2026",
      submittedDate: "Nov 23, 2026",
      status: "submitted",
      summary: newReport.notes.trim() || summaries[newReport.category],
      baptisms:
        newReport.category === "Sacramental Records" ? value("baptisms") : null,
      matrimony:
        newReport.category === "Sacramental Records"
          ? value("matrimony")
          : null,
      confirmations:
        newReport.category === "Sacramental Records"
          ? value("confirmations")
          : null,
      burials:
        newReport.category === "Sacramental Records" ? value("burials") : null,
      total:
        newReport.category === "Sacramental Records" ? sacramentTotal : null,
    }
    if (pending) {
      setReports(
        reports.map((report) =>
          report.id === pending.id ? submittedReport : report,
        ),
      )
    } else {
      setReports([submittedReport, ...reports])
    }
    setCreatingReport(false)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#EDE8DF" }}
    >
      <header
        className="flex-shrink-0 sticky top-0 z-40"
        style={{
          background: "#1C0808",
          boxShadow: "0 2px 16px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-center gap-4 lg:gap-6 px-4 lg:px-6 py-3">
          <div className="flex items-center gap-3 flex-shrink-0">
            <DiocesanSeal size={52} />
            <div
              className="text-white font-black text-2xl leading-tight tracking-tight"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              ACROSS
            </div>
          </div>
          <div
            className="hidden lg:block w-px h-12 flex-shrink-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #C4971A, transparent)",
            }}
          />
          <nav
            className="flex items-center gap-1 flex-1 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {navItems.map((item) => {
              const alert = item.key === "requests" && pendingCount > 0
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all"
                  style={{
                    color:
                      tab === item.key ? "#C4971A" : "rgba(255,255,255,0.55)",
                    background:
                      tab === item.key
                        ? "rgba(196,151,26,0.12)"
                        : "transparent",
                    border:
                      tab === item.key
                        ? "1px solid rgba(196,151,26,0.3)"
                        : "1px solid transparent",
                  }}
                >
                  <Icon name={item.icon} size={14} />
                  {item.label}
                  {alert && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </button>
              )
            })}
          </nav>
          <div className="flex items-center gap-2 flex-shrink-0">
            {pendingCount > 0 && (
              <button
                onClick={() => setTab("requests")}
                className="hidden xl:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gold/15 text-gold border border-gold/30"
              >
                {pendingCount} pending
              </button>
            )}
            <button
              onClick={() => setTab("notifications")}
              title="Notifications"
              aria-label="Notifications"
              className="relative p-2 rounded-lg text-white/50 bg-white/5 hover:text-white/80 transition-colors"
            >
              <Icon name="bell" size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center bg-primary">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <img
                src="/parish-staff-profile.jpg"
                alt="Sec. Lourdes Casas"
                className="w-7 h-7 rounded-full object-cover border border-gold/50"
              />
              <div>
                <div className="text-white text-xs font-semibold leading-tight">
                  Sec. Lourdes Casas
                </div>
                <div className="text-white/40 text-xs">Parish Secretary</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign out"
              className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
            >
              <Icon name="logout" size={16} />
            </button>
          </div>
        </div>
        <div
          className="h-0.5"
          style={{
            background: `linear-gradient(to right, #7B1C1C, #C4971A ${((navItems.findIndex((n) => n.key === tab) + 1) / navItems.length) * 100}%, transparent ${((navItems.findIndex((n) => n.key === tab) + 1) / navItems.length) * 100}%)`,
          }}
        />
      </header>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div key={tab} className="animate-fade-in">
            {/* ── STAFF HOME ── */}
            {tab === "home" && (
              <div>
                <div className="mb-6">
                  <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Lora" }}
                  >
                    Parish Dashboard
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Mater Salutis Parish · Naga City · November 23, 2026
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    {
                      label: "Pending Requests",
                      value: requests.filter((r) => r.status === "pending")
                        .length,
                      color: "#7B1C1C",
                      bg: "#FDF5F5",
                      icon: "alert",
                    },
                    {
                      label: "For Review",
                      value: requests.filter((r) => r.status === "for-review")
                        .length,
                      color: "#1E3A5F",
                      bg: "#DBEAFE",
                      icon: "eye",
                    },
                    {
                      label: "Approved Today",
                      value: requests.filter((r) => r.status === "approved")
                        .length,
                      color: "#065F46",
                      bg: "#D1FAE5",
                      icon: "check",
                    },
                    {
                      label: "Registered Parishioners",
                      value: parishionerDirectory.length,
                      color: "#B8941F",
                      bg: "#FFFBEB",
                      icon: "users",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-4 card-lift"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">
                            {stat.label}
                          </p>
                          <p
                            className="text-2xl font-bold"
                            style={{ color: stat.color, fontFamily: "Lora" }}
                          >
                            {stat.value}
                          </p>
                        </div>
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ background: stat.bg }}
                        >
                          <Icon name={stat.icon} size={17} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pending requests */}
                  <div
                    className="bg-white rounded-2xl p-5"
                    style={{ border: "1px solid #DDD6CE" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2
                        className="font-semibold text-gray-800"
                        style={{ fontFamily: "Lora" }}
                      >
                        Needs Attention
                      </h2>
                      <button
                        onClick={() => setTab("requests")}
                        className="text-xs font-semibold"
                        style={{ color: "#7B1C1C" }}
                      >
                        View all →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {requests
                        .filter(
                          (r) =>
                            r.status === "pending" || r.status === "for-review",
                        )
                        .slice(0, 4)
                        .map((req) => (
                          <div
                            key={req.id}
                            className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:bg-gray-50"
                            style={{ border: "1px solid #F0EDE8" }}
                            onClick={() => setReviewingReq(req)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">
                                {
                                  SERVICES.find((s) => s.type === req.type)
                                    ?.icon
                                }
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">
                                  {req.subjectName}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {req.label} · {req.submittedDate}
                                </p>
                              </div>
                            </div>
                            <StatusBadge status={req.status} />
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Report status */}
                  <div
                    className="bg-white rounded-2xl p-5"
                    style={{ border: "1px solid #DDD6CE" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2
                        className="font-semibold text-gray-800"
                        style={{ fontFamily: "Lora" }}
                      >
                        Report Status
                      </h2>
                      <button
                        onClick={() => setTab("reports")}
                        className="text-xs font-semibold"
                        style={{ color: "#7B1C1C" }}
                      >
                        Manage →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {reports.slice(0, 3).map((rep) => (
                        <div
                          key={rep.id}
                          className={`p-3 rounded-xl report-${rep.status}`}
                          style={{
                            background: "#FAFAF9",
                            border: "1px solid #DDD6CE",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {rep.period}
                              </p>
                              <p className="text-xs text-gray-400">
                                Due: {rep.dueDate}
                              </p>
                            </div>
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                rep.status === "submitted"
                                  ? "badge-completed"
                                  : rep.status === "pending"
                                    ? "badge-pending"
                                    : rep.status === "late"
                                      ? "badge-returned"
                                      : "badge-for-review"
                              }`}
                            >
                              {rep.status.charAt(0).toUpperCase() +
                                rep.status.slice(1)}
                            </span>
                          </div>
                          {rep.total !== null && (
                            <p className="text-xs text-gray-500 mt-1">
                              Total records: {rep.total}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                  {/* Parish calendar and complete event list */}
                  <div
                    className="xl:col-span-2 bg-white rounded-2xl p-5"
                    style={{ border: "1px solid #DDD6CE" }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2
                          className="font-semibold text-gray-800"
                          style={{ fontFamily: "Lora" }}
                        >
                          Parish Calendar
                        </h2>
                        <p className="text-xs text-gray-400">
                          All Mater Salutis Parish events · September 2026
                        </p>
                      </div>
                      <button
                        onClick={() => setTab("schedule")}
                        className="text-xs font-semibold flex items-center gap-1.5 text-primary"
                      >
                        <Icon name="calendar" size={14} /> Full calendar
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                            (day) => (
                              <div
                                key={day}
                                className="text-center text-[10px] font-bold uppercase text-gray-400 py-1"
                              >
                                {day}
                              </div>
                            ),
                          )}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {[
                            null,
                            null,
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15,
                            16,
                            17,
                            18,
                            19,
                            20,
                            21,
                            22,
                            23,
                            24,
                            25,
                            26,
                            27,
                            28,
                            29,
                            30,
                          ].map((day, index) => {
                            const hasEvent =
                              day !== null &&
                              parishCalendarItems.some(
                                (event) => event.day === day,
                              )
                            const hasService =
                              day !== null &&
                              scheduledParishServices.some(
                                (service) => service.day === day,
                              )
                            const isFeast = day === 12 || day === 19
                            return (
                              <div
                                key={index}
                                className={`aspect-square rounded-lg flex items-center justify-center text-xs relative ${
                                  isFeast
                                    ? "bg-primary text-white font-bold"
                                    : hasService
                                      ? "bg-blue-100 text-blue-700 font-semibold"
                                      : hasEvent
                                        ? "bg-gold/15 text-gold-dark font-semibold"
                                        : day
                                          ? "text-gray-600 hover:bg-gray-50"
                                          : ""
                                }`}
                              >
                                {day}
                                {hasEvent && !isFeast && (
                                  <span
                                    className={`absolute bottom-1 w-1 h-1 rounded-full ${
                                      hasService ? "bg-blue-600" : "bg-gold"
                                    }`}
                                  />
                                )}
                              </div>
                            )
                          })}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            Major feast
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-gold" />
                            Parish event
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            Scheduled service
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                          All Events
                        </p>
                        <div className="space-y-2">
                          {parishCalendarItems.map((event) => (
                            <div
                              key={`${event.date}-${event.title}`}
                              className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100"
                            >
                              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-primary flex-shrink-0">
                                <Icon name={event.icon} size={16} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-semibold text-gray-800 leading-snug">
                                    {event.title}
                                  </p>
                                  <span className="text-[10px] font-semibold text-primary whitespace-nowrap">
                                    {event.date}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                  {event.time} · {event.location}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notification preview */}
                  <div
                    className="bg-white rounded-2xl p-5"
                    style={{ border: "1px solid #DDD6CE" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2
                          className="font-semibold text-gray-800"
                          style={{ fontFamily: "Lora" }}
                        >
                          Notifications
                        </h2>
                        <p className="text-xs text-gray-400">
                          {unreadCount} unread updates
                        </p>
                      </div>
                      <button
                        onClick={() => setTab("notifications")}
                        className="w-9 h-9 rounded-xl bg-red-50 text-primary flex items-center justify-center relative"
                      >
                        <Icon name="bell" size={17} />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {notifList.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() =>
                            setNotifList(
                              notifList.map((item) =>
                                item.id === notification.id
                                  ? { ...item, unread: false }
                                  : item,
                              ),
                            )
                          }
                          className={`w-full text-left p-3 rounded-xl border transition-colors ${
                            notification.unread
                              ? "bg-red-50/60 border-red-100"
                              : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <Icon
                              name={notification.unread ? "alert" : "bell"}
                              size={15}
                              className={
                                notification.unread
                                  ? "text-primary mt-0.5"
                                  : "text-gray-400 mt-0.5"
                              }
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-800">
                                {notification.title}
                              </p>
                              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1.5">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setTab("notifications")}
                      className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── PARISHIONERS ── */}
            {tab === "parishioners" && (
              <div>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h1
                      className="text-2xl font-bold text-gray-800"
                      style={{ fontFamily: "Lora" }}
                    >
                      Parishioner Directory
                    </h1>
                    <p className="text-gray-500 text-sm">
                      {parishionerDirectory.length} registered parishioners
                    </p>
                  </div>
                  <button className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
                    <Icon name="plus" size={14} /> Register New
                  </button>
                </div>

                <div
                  className="bg-white rounded-2xl"
                  style={{ border: "1px solid #DDD6CE" }}
                >
                  <div
                    className="p-4 border-b flex items-center gap-3"
                    style={{ borderColor: "#DDD6CE" }}
                  >
                    <div className="flex-1 relative">
                      <Icon
                        name="search"
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={parishSearch}
                        onChange={(e) => setParishSearch(e.target.value)}
                        placeholder="Search by name or barangay..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
                        style={{ borderColor: "#DDD6CE" }}
                      />
                    </div>
                    <select
                      className="px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: "#DDD6CE" }}
                    >
                      <option>All Barangays</option>
                      <option>Barrio Obrero</option>
                      <option>Abella</option>
                      <option>Triangulo</option>
                    </select>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: "#F7F5F2" }}>
                          {[
                            "ID",
                            "Full Name",
                            "Barangay",
                            "Registered",
                            "Records",
                            "Status",
                            "Actions",
                          ].map((h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parishionerDirectory
                          .filter(
                            (p) =>
                              !parishSearch ||
                              p.name
                                .toLowerCase()
                                .includes(parishSearch.toLowerCase()) ||
                              p.barangay
                                .toLowerCase()
                                .includes(parishSearch.toLowerCase()),
                          )
                          .map((p, i) => (
                            <tr
                              key={p.id}
                              className="border-t hover:bg-gray-50 transition-colors"
                              style={{ borderColor: "#DDD6CE" }}
                            >
                              <td className="px-4 py-3 text-xs font-mono text-gray-400">
                                {p.id}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                    style={{ background: "#7B1C1C" }}
                                  >
                                    {p.name
                                      .split(" ")
                                      .map((w) => w[0])
                                      .join("")
                                      .slice(0, 2)}
                                  </div>
                                  <span className="text-sm font-medium text-gray-800">
                                    {p.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {p.barangay}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-400">
                                {p.registered}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 text-center">
                                {p.records}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                    p.status === "Active"
                                      ? "badge-completed"
                                      : "badge-returned"
                                  }`}
                                >
                                  {p.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  className="text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors hover:bg-gray-50"
                                  style={{
                                    borderColor: "#7B1C1C",
                                    color: "#7B1C1C",
                                  }}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── SCHEDULE ── */}
            {tab === "schedule" && (
              <div>
                <div className="mb-6">
                  <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Lora" }}
                  >
                    Schedule & Calendar
                  </h1>
                  <p className="text-gray-500 text-sm">
                    September 2026 · All Mater Salutis Parish events
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Calendar */}
                  <div
                    className="bg-white rounded-2xl p-5"
                    style={{ border: "1px solid #DDD6CE" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className="font-semibold text-gray-800"
                        style={{ fontFamily: "Lora" }}
                      >
                        September 2026
                      </h3>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100">
                          <Icon
                            name="chevronRight"
                            size={14}
                            className="rotate-180 text-gray-500"
                          />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100">
                          <Icon
                            name="chevronRight"
                            size={14}
                            className="text-gray-500"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                        <div
                          key={d}
                          className="text-center text-xs font-semibold text-gray-400 py-1"
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[
                        null,
                        null,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9,
                        10,
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23,
                        24,
                        25,
                        26,
                        27,
                        28,
                        29,
                        30,
                      ].map((day, i) => (
                        <div
                          key={i}
                          className={`cal-day text-gray-700 ${
                            day !== null &&
                            scheduledParishServices.some(
                              (service) => service.day === day,
                            )
                              ? "bg-blue-100 text-blue-700 font-semibold"
                              : day !== null &&
                                  parishCalendarItems.some(
                                    (event) => event.day === day,
                                  )
                                ? "available"
                                : ""
                          } ${day === 12 ? "selected" : ""} ${
                            !day ? "disabled" : ""
                          }`}
                        >
                          {day || ""}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded bg-green-100 border border-green-300" />
                        Parish event
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
                        Scheduled service
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded bg-primary" />
                        Parish fiesta
                      </span>
                    </div>
                  </div>

                  {/* Upcoming */}
                  <div
                    className="lg:col-span-2 bg-white rounded-2xl p-5"
                    style={{ border: "1px solid #DDD6CE" }}
                  >
                    <h3
                      className="font-semibold text-gray-800 mb-4"
                      style={{ fontFamily: "Lora" }}
                    >
                      All Parish Events
                    </h3>
                    <div className="space-y-3">
                      {parishCalendarItems.map((event) => (
                        <div
                          key={`${event.date}-${event.title}`}
                          className="flex items-center gap-4 p-4 rounded-xl"
                          style={{
                            background: "#F7F5F2",
                            border: "1px solid #DDD6CE",
                          }}
                        >
                          <div className="flex-shrink-0 w-14 text-center">
                            <p className="text-xs text-gray-400">SEP</p>
                            <p
                              className="text-lg font-bold"
                              style={{ color: "#7B1C1C", fontFamily: "Lora" }}
                            >
                              {event.day}
                            </p>
                          </div>
                          <div
                            className="w-px h-10 flex-shrink-0"
                            style={{ background: "#DDD6CE" }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-semibold text-gray-800">
                                {event.title}
                              </p>
                              <span className="text-xs text-gray-400">
                                {event.time}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {event.location}
                            </p>
                            <p className="text-xs text-gray-400">
                              {event.type}
                            </p>
                          </div>
                          <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-primary flex items-center justify-center">
                            <Icon name={event.icon} size={16} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── REQUESTS ── */}
            {tab === "requests" && (
              <div>
                <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h1
                      className="text-2xl font-bold text-gray-800"
                      style={{ fontFamily: "Lora" }}
                    >
                      Service Requests
                    </h1>
                    <p className="text-gray-500 text-sm">
                      {filteredRequests.length} requests · {pendingCount}{" "}
                      pending
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <div
                  className="bg-white rounded-2xl p-4 mb-4 flex flex-wrap gap-3 items-center"
                  style={{ border: "1px solid #DDD6CE" }}
                >
                  <div className="flex-1 min-w-48 relative">
                    <Icon
                      name="search"
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or tracking number..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: "#DDD6CE" }}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {([
                      "all",
                      "pending",
                      "for-review",
                      "approved",
                      "completed",
                      "returned",
                    ] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          filterStatus === s
                            ? "text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        style={{
                          background:
                            filterStatus === s ? "#7B1C1C" : "#F7F5F2",
                        }}
                      >
                        {s === "all"
                          ? "All"
                          : statusLabel[(s as RequestStatus)]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredRequests.map((req, i) => (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl p-5 animate-fade-in"
                      style={{
                        border: "1px solid #DDD6CE",
                        animationDelay: `${i * 0.05}s`,
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <span className="text-2xl flex-shrink-0">
                            {SERVICES.find((s) => s.type === req.type)?.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-gray-800">
                                {req.subjectName}
                              </h3>
                              <StatusBadge status={req.status} />
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {req.label}
                            </p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                              {req.id} · {req.submittedDate}
                            </p>
                            {req.parishionerEmail && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                ✉ {req.parishionerEmail} · 📞 {req.contactNo}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                          {(req.status === "pending" ||
                            req.status === "for-review") && (
                            <button
                              onClick={() => setReviewingReq(req)}
                              className="px-4 py-2 rounded-xl text-sm font-semibold btn-primary flex items-center gap-1.5"
                            >
                              <Icon name="eye" size={13} /> Review
                            </button>
                          )}
                          {req.status === "approved" && (
                            <button
                              onClick={() =>
                                setRequests(
                                  requests.map((r) =>
                                    r.id === req.id
                                      ? {
                                          ...r,
                                          status: "completed" as RequestStatus,
                                        }
                                      : r,
                                  ),
                                )
                              }
                              className="px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors"
                              style={{
                                borderColor: "#14532D",
                                color: "#14532D",
                              }}
                            >
                              ✓ Mark Complete
                            </button>
                          )}
                          <button
                            className="px-3 py-2 rounded-xl text-sm text-gray-500 border hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "#DDD6CE" }}
                          >
                            <Icon name="eye" size={14} />
                          </button>
                        </div>
                      </div>
                      {req.notes && (
                        <div
                          className="mt-3 p-3 rounded-xl text-xs"
                          style={{
                            background: "#F7F5F2",
                            border: "1px solid #DDD6CE",
                          }}
                        >
                          Staff note: {req.notes}
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredRequests.length === 0 && (
                    <div
                      className="bg-white rounded-2xl p-12 text-center"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <Icon
                        name="search"
                        size={40}
                        className="mx-auto mb-3 text-gray-300"
                      />
                      <p className="text-gray-400 text-sm">
                        No requests found matching your filters.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── RECORDS ── */}
            {tab === "records" && (
              <div>
                <div className="mb-6">
                  <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Lora" }}
                  >
                    Parish Records
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Sacramental registries maintained by Mater Salutis Parish
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    {
                      label: "Baptisms (2026)",
                      value: 87,
                      icon: "💧",
                      color: "#1D4ED8",
                    },
                    {
                      label: "Matrimony (2026)",
                      value: 14,
                      icon: "💍",
                      color: "#BE185D",
                    },
                    {
                      label: "Confirmations (2026)",
                      value: 52,
                      icon: "🕊️",
                      color: "#6D28D9",
                    },
                    {
                      label: "Burial Masses (2026)",
                      value: 23,
                      icon: "⛪",
                      color: "#374151",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-4 text-center"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: stat.color, fontFamily: "Lora" }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  className="bg-white rounded-2xl"
                  style={{ border: "1px solid #DDD6CE" }}
                >
                  <div
                    className="p-4 border-b flex items-center justify-between"
                    style={{ borderColor: "#DDD6CE" }}
                  >
                    <h3
                      className="font-semibold text-gray-800"
                      style={{ fontFamily: "Lora" }}
                    >
                      Recent Entries
                    </h3>
                    <button className="text-xs font-semibold px-4 py-2 rounded-lg btn-primary">
                      + Add Record
                    </button>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "#F7F5F2" }}>
                        {["Type", "Name", "Date", "Officiant", "Registry"].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          type: "💧 Baptism",
                          name: "Sofia Marie Gonzales",
                          date: "Nov 22, 2026",
                          officiant: "Fr. Eduardo Santos",
                          reg: "B-2026-087",
                        },
                        {
                          type: "💍 Matrimony",
                          name: "Roberto V. & Carmen D.",
                          date: "Nov 20, 2026",
                          officiant: "Fr. Eduardo Santos",
                          reg: "M-2026-014",
                        },
                        {
                          type: "⛪ Burial",
                          name: "Rodrigo S. Mendoza",
                          date: "Nov 19, 2026",
                          officiant: "Fr. Eduardo Santos",
                          reg: "BUR-2026-023",
                        },
                        {
                          type: "💧 Baptism",
                          name: "Lucas Miguel Reyes",
                          date: "Dec 7, 2026",
                          officiant: "Fr. Eduardo Santos",
                          reg: "B-2026-088 (sched)",
                        },
                      ].map((row, i) => (
                        <tr
                          key={i}
                          className="border-t hover:bg-gray-50 transition-colors"
                          style={{ borderColor: "#DDD6CE" }}
                        >
                          <td className="px-4 py-3 text-sm">{row.type}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">
                            {row.name}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">
                            {row.date}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {row.officiant}
                          </td>
                          <td className="px-4 py-3 text-xs font-mono text-gray-400">
                            {row.reg}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── DONATIONS & OFFERINGS ── */}
            {tab === "donations" && (
              <div>
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1
                      className="text-2xl font-bold text-gray-800"
                      style={{ fontFamily: "Lora" }}
                    >
                      Donations &amp; Offerings
                    </h1>
                    <p className="text-gray-500 text-sm">
                      Track cash collections, food pantry contributions, and
                      liturgical offerings received by Mater Salutis Parish
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDonationFormError(null)
                      setIsLoggingDonation(true)
                    }}
                    className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 self-start sm:self-auto shadow-sm"
                  >
                    + Log New Donation
                  </button>
                </div>

                {donationToast && (
                  <div
                    className="mb-5 p-3.5 rounded-xl flex items-center justify-between gap-3 animate-fade-in"
                    style={{
                      background: "#D1FAE5",
                      border: "1px solid #6EE7B7",
                      color: "#065F46",
                    }}
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span>✓</span>
                      <span>{donationToast}</span>
                    </div>
                    <button
                      onClick={() => setDonationToast(null)}
                      className="text-xs font-bold opacity-70 hover:opacity-100"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Hierarchical Drill-Down Date Selector Filter & Summary Metric Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
                  {/* Hierarchical Date Selector & Filter Bar Card */}
                  <div
                    className="lg:col-span-5 bg-white rounded-2xl p-4 flex flex-col justify-between gap-3"
                    style={{ border: "1px solid #DDD6CE" }}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <Icon
                          name="calendar"
                          size={14}
                          className="text-primary"
                        />
                        Filter by Collection Date
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                        <button
                          onClick={() => {
                            setSelectedMonth("all")
                            setSelectedDay("all")
                          }}
                          className={`px-2 py-0.5 rounded transition-colors ${
                            drillLevel === "year"
                              ? "bg-primary text-white"
                              : "text-primary hover:bg-red-50"
                          }`}
                        >
                          {selectedYear}
                        </button>
                        {selectedMonth !== "all" && (
                          <>
                            <span className="text-gray-300">/</span>
                            <button
                              onClick={() => setSelectedDay("all")}
                              className={`px-2 py-0.5 rounded transition-colors ${
                                drillLevel === "month"
                                  ? "bg-primary text-white"
                                  : "text-primary hover:bg-red-50"
                              }`}
                            >
                              {formatMonthDisplay(selectedMonth).split(" ")[0]}
                            </button>
                          </>
                        )}
                        {selectedDay !== "all" && (
                          <>
                            <span className="text-gray-300">/</span>
                            <span className="px-2 py-0.5 rounded bg-primary text-white">
                              {formatDateDisplay(selectedDay).split(",")[0]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Year -> Month -> Day Hierarchical Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          Year
                        </label>
                        <select
                          aria-label="Filter by Year"
                          value={selectedYear}
                          onChange={(e) => {
                            const yr = e.target.value
                            setSelectedYear(yr)
                            setSelectedMonth("all")
                            setSelectedDay("all")
                          }}
                          className="w-full px-2.5 py-2 rounded-xl border text-xs font-semibold text-gray-800 bg-amber-50/40 focus:outline-none"
                          style={{ borderColor: "#C4971A" }}
                        >
                          {availableYears.map((yr) => (
                            <option key={yr} value={yr}>
                              {yr} (Annual)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          Month
                        </label>
                        <select
                          aria-label="Filter by Month"
                          value={selectedMonth}
                          onChange={(e) => {
                            const mo = e.target.value
                            setSelectedMonth(mo)
                            setSelectedDay("all")
                          }}
                          className="w-full px-2.5 py-2 rounded-xl border text-xs font-semibold text-gray-800 bg-amber-50/40 focus:outline-none"
                          style={{
                            borderColor:
                              selectedMonth !== "all" ? "#C4971A" : "#DDD6CE",
                          }}
                        >
                          <option value="all">
                            All Months ({selectedYear})
                          </option>
                          {availableMonthsForYear.map((ym) => (
                            <option key={ym} value={ym}>
                              {formatMonthDisplay(ym)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          Specific Day
                        </label>
                        <select
                          aria-label="Filter by Specific Day"
                          value={selectedDay}
                          disabled={selectedMonth === "all"}
                          onChange={(e) => setSelectedDay(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border text-xs font-semibold text-gray-800 bg-amber-50/40 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                          style={{
                            borderColor:
                              selectedDay !== "all" ? "#C4971A" : "#DDD6CE",
                          }}
                        >
                          <option value="all">
                            {selectedMonth === "all"
                              ? "Select Month first"
                              : `All Days (${formatMonthDisplay(selectedMonth).split(" ")[0]})`}
                          </option>
                          {availableDaysForMonth.map((dateKey) => (
                            <option key={dateKey} value={dateKey}>
                              {formatDateDisplay(dateKey)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Localized Summary Metric Cards */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div
                      className="bg-white rounded-2xl p-4 card-lift flex flex-col justify-between"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">
                            Total Cash Collected
                          </p>
                          <p
                            className="text-2xl font-bold"
                            style={{ color: "#065F46", fontFamily: "Lora" }}
                          >
                            ₱
                            {totalCashCollected.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold"
                          style={{ background: "#D1FAE5", color: "#065F46" }}
                        >
                          ₱
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">
                        {currentPeriodLabel}
                      </p>
                    </div>

                    <div
                      className="bg-white rounded-2xl p-4 card-lift flex flex-col justify-between"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">
                            Food Donations
                          </p>
                          <p
                            className="text-2xl font-bold"
                            style={{ color: "#92400E", fontFamily: "Lora" }}
                          >
                            {totalFoodUnits}{" "}
                            <span className="text-sm font-normal text-gray-500">
                              {drillLevel === "year"
                                ? "lbs/items"
                                : "food items"}
                            </span>
                          </p>
                        </div>
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                          style={{ background: "#FEF3C7", color: "#92400E" }}
                        >
                          🥫
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">
                        {
                          filteredDonations.filter((d) => d.category === "Food")
                            .length
                        }{" "}
                        pantry &amp; harvest entries
                      </p>
                    </div>

                    <div
                      className="bg-white rounded-2xl p-4 card-lift flex flex-col justify-between"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">
                            Other Donations
                          </p>
                          <p
                            className="text-2xl font-bold"
                            style={{ color: "#7B1C1C", fontFamily: "Lora" }}
                          >
                            {totalOtherUnits}{" "}
                            <span className="text-sm font-normal text-gray-500">
                              {drillLevel === "year"
                                ? "other items"
                                : "other donations"}
                            </span>
                          </p>
                        </div>
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                          style={{ background: "#FDF5F5", color: "#7B1C1C" }}
                        >
                          🕯️
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">
                        {filteredDonations.length} total records (
                        {filteredDonations.filter((d) => d.isAnonymous).length}{" "}
                        anonymous)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secondary search, category filter & quick hierarchical drill-down pills */}
                <div
                  className="bg-white rounded-2xl mb-6"
                  style={{ border: "1px solid #DDD6CE" }}
                >
                  <div
                    className="p-4 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-3"
                    style={{ borderColor: "#DDD6CE" }}
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">
                        Quick Drill-Down:
                      </span>
                      {[
                        {
                          label: "2026 (Year)",
                          yr: "2026",
                          mo: "all",
                          dy: "all",
                        },
                        {
                          label: "2025 (Year)",
                          yr: "2025",
                          mo: "all",
                          dy: "all",
                        },
                        {
                          label: "Oct 2026",
                          yr: "2026",
                          mo: "2026-10",
                          dy: "all",
                        },
                        {
                          label: "Sep 2026",
                          yr: "2026",
                          mo: "2026-09",
                          dy: "all",
                        },
                        {
                          label: "Oct 26",
                          yr: "2026",
                          mo: "2026-10",
                          dy: "2026-10-26",
                        },
                        {
                          label: "Oct 25",
                          yr: "2026",
                          mo: "2026-10",
                          dy: "2026-10-25",
                        },
                        {
                          label: "Oct 24",
                          yr: "2026",
                          mo: "2026-10",
                          dy: "2026-10-24",
                        },
                      ].map((preset) => {
                        const isActive =
                          selectedYear === preset.yr &&
                          selectedMonth === preset.mo &&
                          selectedDay === preset.dy
                        return (
                          <button
                            key={preset.label}
                            onClick={() => {
                              setSelectedYear(preset.yr)
                              setSelectedMonth(preset.mo)
                              setSelectedDay(preset.dy)
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              isActive
                                ? "bg-primary text-white shadow-sm"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {preset.label}
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <select
                        aria-label="Filter by Donation Category"
                        value={donationCategoryFilter}
                        onChange={(e) =>
                          setDonationCategoryFilter(
                            e.target.value as "all" | DonationCategory,
                          )
                        }
                        className="px-3 py-2 rounded-lg border text-xs font-semibold text-gray-700 bg-white"
                        style={{ borderColor: "#DDD6CE" }}
                      >
                        <option value="all">All Categories</option>
                        <option value="Cash">Cash</option>
                        <option value="Food">Food</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="relative w-full sm:w-64">
                        <Icon
                          name="search"
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={donationSearchQuery}
                          onChange={(e) =>
                            setDonationSearchQuery(e.target.value)
                          }
                          placeholder="Search donor, item, handler..."
                          className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
                          style={{ borderColor: "#DDD6CE" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Inventory Data Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: "#F7F5F2" }}>
                          {[
                            "Date / Time",
                            "Donor Name",
                            "Category",
                            "Description / Details",
                            "Quantity or Amount",
                            "Staff Handler",
                          ].map((header) => (
                            <th
                              key={header}
                              className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDonations.map((entry) => {
                          const catBadge =
                            entry.category === "Cash"
                              ? { bg: "#D1FAE5", text: "#065F46", icon: "💵" }
                              : entry.category === "Food"
                                ? { bg: "#FEF3C7", text: "#92400E", icon: "🥫" }
                                : { bg: "#EDE9FE", text: "#5B21B6", icon: "🕯️" }

                          return (
                            <tr
                              key={entry.id}
                              className="border-t hover:bg-amber-50/30 transition-colors"
                              style={{ borderColor: "#DDD6CE" }}
                            >
                              <td className="px-4 py-3.5 align-top whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-800">
                                  {entry.dateLabel}
                                </div>
                                <div className="text-xs text-gray-400 font-mono">
                                  {entry.timeLabel} · {entry.id}
                                </div>
                              </td>
                              <td className="px-4 py-3.5 align-top">
                                {entry.isAnonymous ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                    🕊️ Anonymous
                                  </span>
                                ) : (
                                  <div>
                                    <div className="text-sm font-medium text-gray-800">
                                      {entry.donorName}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {entry.contactInfo}
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3.5 align-top whitespace-nowrap">
                                <span
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                                  style={{
                                    background: catBadge.bg,
                                    color: catBadge.text,
                                  }}
                                >
                                  <span>{catBadge.icon}</span>
                                  {entry.category}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 align-top max-w-md">
                                <div className="text-sm font-semibold text-gray-800">
                                  {entry.description}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {entry.subDetail}
                                </div>
                                {entry.notes && (
                                  <div className="text-[11px] text-gray-400 italic mt-1">
                                    "{entry.notes}"
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3.5 align-top whitespace-nowrap">
                                <span
                                  className="text-sm font-bold px-2.5 py-1 rounded-lg"
                                  style={{
                                    fontFamily: "Lora",
                                    background:
                                      entry.category === "Cash"
                                        ? "#ECFDF5"
                                        : "#F8F4EE",
                                    color:
                                      entry.category === "Cash"
                                        ? "#065F46"
                                        : "#7B1C1C",
                                  }}
                                >
                                  {entry.quantityOrAmount}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 align-top whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                                    style={{ background: "#7B1C1C" }}
                                  >
                                    {entry.staffHandler
                                      .split(" ")
                                      .map((w) => w[0])
                                      .join("")
                                      .slice(0, 2)}
                                  </div>
                                  <span className="text-xs font-medium text-gray-700">
                                    {entry.staffHandler}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                        {filteredDonations.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-4 py-12 text-center text-gray-400 text-sm"
                            >
                              No donations or offerings found for the selected
                              filter criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {tab === "notifications" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1
                      className="text-2xl font-bold text-gray-800"
                      style={{ fontFamily: "Lora" }}
                    >
                      Notifications
                    </h1>
                    <p className="text-gray-500 text-sm">
                      {unreadCount} unread
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifList(
                        notifList.map((n) => ({ ...n, unread: false })),
                      )
                    }
                    className="text-xs font-semibold px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
                    style={{ borderColor: "#7B1C1C", color: "#7B1C1C" }}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="space-y-3">
                  {notifList.map((notif, i) => (
                    <div
                      key={notif.id}
                      onClick={() =>
                        setNotifList(
                          notifList.map((n) =>
                            n.id === notif.id ? { ...n, unread: false } : n,
                          ),
                        )
                      }
                      className={`bg-white rounded-2xl p-5 cursor-pointer card-lift animate-fade-in ${
                        notif.unread ? "border-l-4" : ""
                      }`}
                      style={{
                        border: "1px solid #DDD6CE",
                        borderLeftColor: notif.unread ? "#7B1C1C" : "#DDD6CE",
                        animationDelay: `${i * 0.06}s`,
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-gray-50">
                          {notif.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm text-gray-800">
                              {notif.title}
                            </p>
                            {notif.unread && (
                              <span className="notif-dot flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── REPORTS ── */}
            {tab === "reports" && (
              <div>
                <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h1
                      className="text-2xl font-bold text-gray-800"
                      style={{ fontFamily: "Lora" }}
                    >
                      Archdiocesan Reports
                    </h1>
                    <p className="text-gray-500 text-sm">
                      Quarterly census, parish records, collections, ministries,
                      assets, and sacramental reports
                    </p>
                  </div>
                  <button
                    onClick={() => setCreatingReport(true)}
                    className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                  >
                    <Icon name="send" size={14} /> Submit Report
                  </button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    {
                      label: "Submitted",
                      value: reports.filter((r) => r.status === "submitted")
                        .length,
                      color: "#065F46",
                      bg: "#D1FAE5",
                    },
                    {
                      label: "Pending",
                      value: reports.filter((r) => r.status === "pending")
                        .length,
                      color: "#78350F",
                      bg: "#FEF3C7",
                    },
                    {
                      label: "Late",
                      value: reports.filter((r) => r.status === "late").length,
                      color: "#7F1D1D",
                      bg: "#FEE2E2",
                    },
                    {
                      label: "Returned",
                      value: reports.filter((r) => r.status === "returned")
                        .length,
                      color: "#1E3A5F",
                      bg: "#DBEAFE",
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-4 text-center"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <p
                        className="text-2xl font-bold"
                        style={{ color: s.color, fontFamily: "Lora" }}
                      >
                        {s.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Report category filters */}
                <div
                  className="bg-white rounded-2xl p-3 mb-6 flex flex-wrap gap-2"
                  style={{ border: "1px solid #DDD6CE" }}
                >
                  {([
                    "all",
                    "Census",
                    "Sacramental Records",
                    "Offertory & Collections",
                    "Parish Records",
                    "Ministries",
                    "Assets & Maintenance",
                  ] as const).map((category) => (
                    <button
                      key={category}
                      onClick={() => setReportCategory(category)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        reportCategory === category
                          ? "bg-primary text-white shadow-sm"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {category === "all" ? "All Reports" : category}
                    </button>
                  ))}
                </div>

                {/* Report list */}
                <div className="space-y-4">
                  {filteredReports.map((rep, i) => (
                    <div
                      key={rep.id}
                      className={`bg-white rounded-2xl p-5 animate-fade-in report-${rep.status}`}
                      style={{
                        border: "1px solid #DDD6CE",
                        animationDelay: `${i * 0.07}s`,
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3
                              className="font-semibold text-gray-800"
                              style={{ fontFamily: "Lora" }}
                            >
                              {rep.title}
                            </h3>
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                rep.status === "submitted"
                                  ? "badge-completed"
                                  : rep.status === "pending"
                                    ? "badge-pending"
                                    : rep.status === "late"
                                      ? "badge-returned"
                                      : "badge-for-review"
                              }`}
                            >
                              {rep.status.charAt(0).toUpperCase() +
                                rep.status.slice(1)}
                            </span>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-2">
                            {rep.category}
                          </span>
                          <p className="text-xs text-gray-400 mb-1">
                            Period: {rep.period} · Due: {rep.dueDate}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {rep.summary}
                          </p>
                          {rep.submittedDate && (
                            <p className="text-xs text-green-600 font-semibold">
                              ✓ Submitted: {rep.submittedDate}
                            </p>
                          )}
                          {rep.total !== null && (
                            <div className="flex items-center gap-4 mt-3 flex-wrap">
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-semibold">
                                💧 Baptisms: {rep.baptisms}
                              </span>
                              <span className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded-lg font-semibold">
                                💍 Matrimony: {rep.matrimony}
                              </span>
                              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg font-semibold">
                                🕊️ Confirmations: {rep.confirmations}
                              </span>
                              <span className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-lg font-semibold">
                                ⛪ Burials: {rep.burials}
                              </span>
                              <span className="text-xs font-bold text-gray-700">
                                Total: {rep.total}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {rep.status === "pending" && (
                            <button
                              onClick={() => {
                                setNewReport({
                                  ...newReport,
                                  category: rep.category,
                                  period: rep.period,
                                })
                                setCreatingReport(true)
                              }}
                              className="px-4 py-2 rounded-xl text-sm font-semibold btn-primary"
                            >
                              Submit Now
                            </button>
                          )}
                          {rep.status === "submitted" && (
                            <button
                              className="px-4 py-2 rounded-xl text-sm font-semibold border text-gray-600 hover:bg-gray-50 transition-colors"
                              style={{ borderColor: "#DDD6CE" }}
                            >
                              View PDF
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SETTINGS ── */}
            {tab === "settings" && (
              <div>
                <div className="mb-6">
                  <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Lora" }}
                  >
                    Staff Settings
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Manage your parish workspace, alerts, and account
                    preferences
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div
                    className="bg-white rounded-2xl p-6"
                    style={{ border: "1px solid #DDD6CE" }}
                  >
                    <img
                      src="/parish-staff-profile.jpg"
                      alt="Profile portrait of Sec. Lourdes Casas"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-gold/40 shadow-sm mb-4"
                    />
                    <h2
                      className="font-semibold text-gray-800"
                      style={{ fontFamily: "Lora" }}
                    >
                      Sec. Lourdes Casas
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Parish Secretary
                    </p>
                    <div
                      className="mt-5 pt-5 border-t space-y-3 text-sm"
                      style={{ borderColor: "#F0EDE8" }}
                    >
                      <div className="flex items-center gap-2 text-gray-600">
                        <Icon
                          name="church"
                          size={15}
                          className="text-gray-400"
                        />
                        Mater Salutis Parish
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Icon name="mail" size={15} className="text-gray-400" />
                        matersalutis@caceres.ph
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                    <div
                      className="bg-white rounded-2xl p-6"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <h2
                        className="font-semibold text-gray-800 mb-4"
                        style={{ fontFamily: "Lora" }}
                      >
                        Notification Preferences
                      </h2>
                      <div className="space-y-4">
                        {[
                          {
                            label: "New service request alerts",
                            enabled: true,
                          },
                          {
                            label: "Upcoming parish event reminders",
                            enabled: true,
                          },
                          {
                            label: "Archdiocesan report deadline alerts",
                            enabled: true,
                          },
                          {
                            label: "Daily activity summary by email",
                            enabled: false,
                          },
                        ].map((preference) => (
                          <div
                            key={preference.label}
                            className="flex items-center justify-between gap-4"
                          >
                            <p className="text-sm text-gray-700">
                              {preference.label}
                            </p>
                            <button
                              className={`w-11 h-6 rounded-full relative transition-colors ${
                                preference.enabled
                                  ? "bg-primary"
                                  : "bg-gray-200"
                              }`}
                              aria-label={`Toggle ${preference.label}`}
                            >
                              <span
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                                  preference.enabled ? "left-5.5" : "left-0.5"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      className="bg-white rounded-2xl p-6"
                      style={{ border: "1px solid #DDD6CE" }}
                    >
                      <h2
                        className="font-semibold text-gray-800 mb-2"
                        style={{ fontFamily: "Lora" }}
                      >
                        Account Security
                      </h2>
                      <p className="text-sm text-gray-500 mb-4">
                        Update your password and secure your parish staff
                        account.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button className="px-4 py-2 rounded-xl text-sm font-semibold btn-primary">
                          Change Password
                        </button>
                        <button
                          onClick={onLogout}
                          className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Log New Donation Modal */}
      {isLoggingDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
            <div
              className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #7B1C1C, #9B2C2C)",
              }}
            >
              <div>
                <h2
                  className="text-white font-semibold text-lg"
                  style={{ fontFamily: "Lora" }}
                >
                  Log New Donation or Offering
                </h2>
                <p className="text-white/70 text-xs">
                  Mater Salutis Parish Inventory &amp; Offertory Registry
                </p>
              </div>
              <button
                onClick={() => setIsLoggingDonation(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {donationFormError && (
                <div
                  className="p-3 rounded-xl text-xs font-semibold"
                  style={{
                    background: "#FEE2E2",
                    color: "#7F1D1D",
                    border: "1px solid #FCA5A5",
                  }}
                >
                  ⚠️ {donationFormError}
                </div>
              )}

              {/* Anonymous Toggle */}
              <div
                className="flex items-center justify-between p-3.5 rounded-xl"
                style={{ background: "#F7F5F2", border: "1px solid #DDD6CE" }}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Anonymous Donation
                  </p>
                  <p className="text-xs text-gray-500">
                    Enable if the donor wishes to remain unnamed in parish
                    records
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={newDonationForm.isAnonymous}
                  onClick={() =>
                    setNewDonationForm({
                      ...newDonationForm,
                      isAnonymous: !newDonationForm.isAnonymous,
                    })
                  }
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    newDonationForm.isAnonymous ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                      newDonationForm.isAnonymous ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Donor Name & Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-semibold">
                    Donor Name
                  </label>
                  <input
                    type="text"
                    disabled={newDonationForm.isAnonymous}
                    value={
                      newDonationForm.isAnonymous
                        ? "Anonymous"
                        : newDonationForm.donorName
                    }
                    onChange={(e) =>
                      setNewDonationForm({
                        ...newDonationForm,
                        donorName: e.target.value,
                      })
                    }
                    placeholder="e.g. Familia Dela Cruz"
                    className="w-full px-3 py-2 rounded-lg border text-sm disabled:bg-gray-100 disabled:text-gray-400"
                    style={{ borderColor: "#DDD6CE" }}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-semibold">
                    Contact Info (Phone / Email)
                  </label>
                  <input
                    type="text"
                    disabled={newDonationForm.isAnonymous}
                    value={
                      newDonationForm.isAnonymous
                        ? ""
                        : newDonationForm.contactInfo
                    }
                    onChange={(e) =>
                      setNewDonationForm({
                        ...newDonationForm,
                        contactInfo: e.target.value,
                      })
                    }
                    placeholder={
                      newDonationForm.isAnonymous
                        ? "Hidden for anonymous donor"
                        : "e.g. +63 917 000 0000"
                    }
                    className="w-full px-3 py-2 rounded-lg border text-sm disabled:bg-gray-100 disabled:text-gray-400"
                    style={{ borderColor: "#DDD6CE" }}
                  />
                </div>
              </div>

              {/* Date Picker & Category Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-semibold">
                    Date Received
                  </label>
                  <input
                    type="date"
                    value={newDonationForm.date}
                    onChange={(e) =>
                      setNewDonationForm({
                        ...newDonationForm,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                    style={{ borderColor: "#DDD6CE" }}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-semibold">
                    Donation Category
                  </label>
                  <select
                    value={newDonationForm.category}
                    onChange={(e) =>
                      setNewDonationForm({
                        ...newDonationForm,
                        category: e.target.value as DonationCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-white font-semibold text-gray-800"
                    style={{ borderColor: "#DDD6CE" }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Food">Food</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Conditional Dynamic Fields */}
              <div
                className="p-4 rounded-xl space-y-4"
                style={{ background: "#FAF7F2", border: "1px solid #E5DEC9" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#7B1C1C" }}
                  >
                    {newDonationForm.category === "Cash" &&
                      "💵 Cash / Monetary Offering Details"}
                    {newDonationForm.category === "Food" &&
                      "🥫 Food & Pantry Item Details"}
                    {newDonationForm.category === "Other" &&
                      "🕯️ Liturgical / Material Goods Details"}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Required fields
                  </span>
                </div>

                {newDonationForm.category === "Cash" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-semibold">
                        Monetary Amount (₱)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newDonationForm.cashAmount}
                        onChange={(e) =>
                          setNewDonationForm({
                            ...newDonationForm,
                            cashAmount: e.target.value,
                          })
                        }
                        placeholder="e.g. 250.00"
                        className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                        style={{ borderColor: "#DDD6CE" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-semibold">
                        Payment Method
                      </label>
                      <select
                        value={newDonationForm.paymentMethod}
                        onChange={(e) =>
                          setNewDonationForm({
                            ...newDonationForm,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                        style={{ borderColor: "#DDD6CE" }}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Check">Check</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Online Giving">Online Giving</option>
                      </select>
                    </div>
                  </div>
                )}

                {newDonationForm.category === "Food" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-semibold">
                          Item Name
                        </label>
                        <input
                          type="text"
                          value={newDonationForm.foodItemName}
                          onChange={(e) =>
                            setNewDonationForm({
                              ...newDonationForm,
                              foodItemName: e.target.value,
                            })
                          }
                          placeholder="e.g. soup, fruit juice, cooking oil"
                          className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                          style={{ borderColor: "#DDD6CE" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-semibold">
                          Food Type
                        </label>
                        <select
                          value={newDonationForm.foodType}
                          onChange={(e) =>
                            setNewDonationForm({
                              ...newDonationForm,
                              foodType: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                          style={{ borderColor: "#DDD6CE" }}
                        >
                          <option value="Canned Goods">Canned Goods</option>
                          <option value="Fresh Produce">Fresh Produce</option>
                          <option value="Dry Grains & Rice">
                            Dry Grains &amp; Rice
                          </option>
                          <option value="Baked Goods">Baked Goods</option>
                          <option value="Beverages">Beverages</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-semibold">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newDonationForm.foodQuantity}
                          onChange={(e) =>
                            setNewDonationForm({
                              ...newDonationForm,
                              foodQuantity: e.target.value,
                            })
                          }
                          placeholder="e.g. 12"
                          className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                          style={{ borderColor: "#DDD6CE" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-semibold">
                          Units
                        </label>
                        <select
                          value={newDonationForm.foodUnit}
                          onChange={(e) =>
                            setNewDonationForm({
                              ...newDonationForm,
                              foodUnit: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                          style={{ borderColor: "#DDD6CE" }}
                        >
                          <option value="cans">cans</option>
                          <option value="bottles">bottles</option>
                          <option value="bottle">bottle</option>
                          <option value="boxes">boxes</option>
                          <option value="packs">packs</option>
                          <option value="pounds">pounds</option>
                          <option value="crates">crates</option>
                          <option value="sacks">sacks</option>
                          <option value="kg">kg</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {newDonationForm.category === "Other" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1 font-semibold">
                        Item Category / Name
                      </label>
                      <input
                        type="text"
                        value={newDonationForm.otherItemName}
                        onChange={(e) =>
                          setNewDonationForm({
                            ...newDonationForm,
                            otherItemName: e.target.value,
                          })
                        }
                        placeholder="e.g. Altar Linens & Candles, Sanctuary Vestments"
                        className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                        style={{ borderColor: "#DDD6CE" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-semibold">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newDonationForm.otherQuantity}
                        onChange={(e) =>
                          setNewDonationForm({
                            ...newDonationForm,
                            otherQuantity: e.target.value,
                          })
                        }
                        placeholder="1"
                        className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                        style={{ borderColor: "#DDD6CE" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* General Notes */}
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-semibold">
                  General Notes / Intention
                </label>
                <textarea
                  rows={3}
                  value={newDonationForm.notes}
                  onChange={(e) =>
                    setNewDonationForm({
                      ...newDonationForm,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Add any special mass intentions, storage instructions, or acknowledgment remarks..."
                  className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                  style={{ borderColor: "#DDD6CE" }}
                />
              </div>
            </div>

            <div
              className="px-6 py-4 border-t bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0"
              style={{ borderColor: "#DDD6CE" }}
            >
              <button
                type="button"
                onClick={() => setIsLoggingDonation(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium border hover:bg-gray-100 transition-colors"
                style={{ borderColor: "#DDD6CE", color: "#4B5563" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDonation}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold btn-primary flex items-center gap-2"
              >
                <Icon name="check" size={15} />
                Save Donation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Submit report modal */}
      {creatingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
            <div
              className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #7B1C1C, #9B2C2C)",
              }}
            >
              <h2
                className="text-white font-semibold"
                style={{ fontFamily: "Lora" }}
              >
                Submit Archdiocesan Report
              </h2>
              <button
                onClick={() => setCreatingReport(false)}
                className="text-white/60 hover:text-white"
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-semibold">
                    Report Type
                  </label>
                  <select
                    value={newReport.category}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        category: e.target.value as StaffReportCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                    style={{ borderColor: "#DDD6CE" }}
                  >
                    {([
                      "Census",
                      "Sacramental Records",
                      "Offertory & Collections",
                      "Parish Records",
                      "Ministries",
                      "Assets & Maintenance",
                    ] as const).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-semibold">
                    Reporting Period
                  </label>
                  <input
                    type="text"
                    value={newReport.period}
                    onChange={(e) =>
                      setNewReport({ ...newReport, period: e.target.value })
                    }
                    placeholder="e.g. 4th Quarter 2026"
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "#DDD6CE" }}
                  />
                </div>
              </div>
              <div
                className="p-3 rounded-xl mb-4 text-sm flex items-center gap-2"
                style={{
                  background: "#FEF3C7",
                  border: "1px solid #FDE68A",
                  color: "#78350F",
                }}
              >
                <Icon name="chart" size={16} />
                <span>
                  <strong>{newReport.category}</strong> · {newReport.period}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {reportFields[newReport.category].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs text-gray-500 mb-1 font-semibold">
                      {field.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={String(newReport[field.key])}
                      onChange={(e) =>
                        setNewReport({
                          ...newReport,
                          [field.key]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: "#DDD6CE" }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-semibold">
                  Report Summary / Additional Notes
                </label>
                <textarea
                  rows={3}
                  value={newReport.notes}
                  onChange={(e) =>
                    setNewReport({ ...newReport, notes: e.target.value })
                  }
                  placeholder="Any special notes or observations for this period..."
                  className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                  style={{ borderColor: "#DDD6CE" }}
                />
              </div>
            </div>
            <div
              className="px-6 py-4 border-t bg-gray-50 flex gap-3 flex-shrink-0"
              style={{ borderColor: "#DDD6CE" }}
            >
              <button
                onClick={() => setCreatingReport(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border hover:bg-gray-100 transition-colors"
                style={{ borderColor: "#DDD6CE" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary flex items-center justify-center gap-2"
              >
                <Icon name="send" size={14} /> Submit to Archdiocese
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review modal */}
      {reviewingReq && (
        <StaffReviewModal
          request={reviewingReq}
          onClose={() => setReviewingReq(null)}
          onApprove={handleApprove}
          onReturn={handleReturn}
        />
      )}
    </div>
  )
}

// AdminDashboard imported from ./AdminDashboard

// ===================== MAIN APP =====================
export default function App() {
  const [screen, setScreen] = useState<AppScreen>("select")
  const [accountType, setAccountType] = useState<AccountType>("parishioner")

  const handleSelectAccount = (type: AccountType) => {
    setAccountType(type)
    setScreen("login")
  }

  const handleLogin = () => {
    if (accountType === "parishioner") setScreen("parishioner")
    else if (accountType === "staff") setScreen("staff")
    else setScreen("admin")
  }

  const handleLogout = () => {
    setScreen("select")
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {screen === "select" && (
        <AccountSelectScreen onSelect={handleSelectAccount} />
      )}
      {screen === "login" && (
        <LoginScreen
          accountType={accountType}
          onLogin={handleLogin}
          onBack={() => setScreen("select")}
          onSignup={() => setScreen("signup")}
        />
      )}
      {screen === "signup" && (
        <SignupScreen
          onBack={() => setScreen("login")}
          onSuccess={() => setScreen("login")}
        />
      )}
      {screen === "parishioner" && (
        <ParishionerDashboard onLogout={handleLogout} />
      )}
      {screen === "staff" && <StaffDashboard onLogout={handleLogout} />}
      {screen === "admin" && <AdminDashboard onLogout={handleLogout} />}
    </div>
  )
}
