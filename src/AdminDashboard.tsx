import { useEffect, useState } from "react"

// ─── TYPES ───────────────────────────────────────────────────────────────────
type AdminTab = "overview" | "parishes" | "reports" | "statistics" | "records" | "users" | "notifications" | "settings"
type ReportStatus = "submitted" | "pending" | "late" | "returned"

interface Parish {
  id: string
  code: string
  name: string
  shortName: string
  barangay: string
  municipality: string
  province: string
  vicariate: string
  priest: string
  phone: string
  email: string
  parishioners: number
  households: number
  established: number
  feast: string
  category: "cathedral" | "shrine" | "parish"
  reportStatus: ReportStatus
  sacraments: {
    baptisms: number
    matrimony: number
    confirmations: number
    burials: number
  }
  lastSubmission: string | null
}

interface Report {
  id: string
  parishCode: string
  parishName: string
  period: string
  dueDate: string
  submittedDate: string | null
  status: ReportStatus
  baptisms: number | null
  matrimony: number | null
  confirmations: number | null
  burials: number | null
  total: number | null
  submittedBy: string | null
  note: string | null
}

interface FinancialReport {
  id: string
  parishCode: string
  parishName: string
  period: string
  dueDate: string
  submittedDate: string | null
  status: ReportStatus
  totalCollections: number | null
  totalExpenses: number | null
  netBalance: number | null
  amountRemitted: number | null
  diocesanShare: number
  submittedBy: string | null
  remittanceReceived: boolean
  note: string | null
  collections: { label: string; amount: number }[]
  expenses: { label: string; amount: number }[]
}

interface RecordEntry {
  id: string
  type: "Baptism" | "Matrimony" | "Confirmation" | "Burial"
  name: string
  date: string
  dateShort: string
  parish: string
  officiant: string
  bookNo: string
  pageNo: string
  entryNo: string
}

interface User {
  id: string
  name: string
  email: string
  initials: string
  role: "Chancellor" | "Archdiocesan Staff" | "Parish Administrator" | "Parish Secretary" | "Finance Officer"
  parish: string | null
  lastSeen: string
  active: boolean
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PARISHES: Parish[] = [
  {
    id: "MCC",
    code: "CAC-000",
    name: "Metropolitan Cathedral Parish",
    shortName: "Cathedral",
    barangay: "Abella",
    municipality: "Naga City",
    province: "Camarines Sur",
    vicariate: "Naga City",
    priest: "Rt. Rev. Msgr. Francisco C. Borja",
    phone: "(054) 472-5678",
    email: "cathedral@caceres.ph",
    parishioners: 12450,
    households: 3106,
    established: 1595,
    feast: "St. John the Baptist – June 24",
    category: "cathedral",
    reportStatus: "submitted",
    sacraments: {
      baptisms: 245,
      matrimony: 62,
      confirmations: 380,
      burials: 89,
    },
    lastSubmission: "Nov 22, 2026",
  },
  {
    id: "MSP",
    code: "CAC-001",
    name: "Mater Salutis Parish",
    shortName: "Mater Salutis",
    barangay: "Cararayan",
    municipality: "Naga City",
    province: "Camarines Sur",
    vicariate: "Naga City",
    priest: "Rev. Fr. Eduardo T. Santos",
    phone: "(054) 472-1234",
    email: "matersalutis@caceres.ph",
    parishioners: 4820,
    households: 1204,
    established: 1962,
    feast: "Our Lady of Salvation – Sep 12",
    category: "parish",
    reportStatus: "submitted",
    sacraments: { baptisms: 87, matrimony: 14, confirmations: 52, burials: 23 },
    lastSubmission: "Nov 23, 2026",
  },
  {
    id: "PNF",
    code: "CAC-002",
    name: "Peñafrancia Shrine Parish",
    shortName: "Peñafrancia Shrine",
    barangay: "Peñafrancia",
    municipality: "Naga City",
    province: "Camarines Sur",
    vicariate: "Naga City",
    priest: "Rev. Fr. Cornelio A. Villanueva, OP",
    phone: "(054) 472-9012",
    email: "penafrancia@caceres.ph",
    parishioners: 8930,
    households: 2232,
    established: 1710,
    feast: "Our Lady of Peñafrancia – 3rd Sat. of Sep",
    category: "shrine",
    reportStatus: "submitted",
    sacraments: {
      baptisms: 163,
      matrimony: 28,
      confirmations: 145,
      burials: 57,
    },
    lastSubmission: "Nov 21, 2026",
  },
  {
    id: "CTK",
    code: "CAC-003",
    name: "Christ the King Parish",
    shortName: "Christ the King",
    barangay: "Concepcion Pequeña",
    municipality: "Naga City",
    province: "Camarines Sur",
    vicariate: "Naga City",
    priest: "Rev. Fr. Andres G. Lim",
    phone: "(054) 472-3456",
    email: "christking@caceres.ph",
    parishioners: 5610,
    households: 1402,
    established: 1978,
    feast: "Christ the King – Last Sunday of Nov",
    category: "parish",
    reportStatus: "pending",
    sacraments: { baptisms: 94, matrimony: 19, confirmations: 0, burials: 31 },
    lastSubmission: null,
  },
  {
    id: "SFP",
    code: "CAC-004",
    name: "San Francisco Parish",
    shortName: "San Francisco",
    barangay: "Lerma",
    municipality: "Naga City",
    province: "Camarines Sur",
    vicariate: "Naga City",
    priest: "Rev. Fr. Renato J. Cueva",
    phone: "(054) 473-2101",
    email: "sanfrancisco@caceres.ph",
    parishioners: 3890,
    households: 972,
    established: 1954,
    feast: "St. Francis of Assisi – Oct 4",
    category: "parish",
    reportStatus: "late",
    sacraments: { baptisms: 61, matrimony: 10, confirmations: 0, burials: 19 },
    lastSubmission: null,
  },
  {
    id: "SJP",
    code: "CAC-005",
    name: "Saint Joseph Parish",
    shortName: "St. Joseph Pili",
    barangay: "Poblacion",
    municipality: "Pili",
    province: "Camarines Sur",
    vicariate: "Rinconada",
    priest: "Rev. Fr. Mario G. Panganiban",
    phone: "(054) 477-5234",
    email: "stjoseph@caceres.ph",
    parishioners: 6120,
    households: 1530,
    established: 1882,
    feast: "St. Joseph – Mar 19",
    category: "parish",
    reportStatus: "submitted",
    sacraments: {
      baptisms: 112,
      matrimony: 22,
      confirmations: 68,
      burials: 40,
    },
    lastSubmission: "Nov 20, 2026",
  },
  {
    id: "SNP",
    code: "CAC-006",
    name: "San Nicolas Parish",
    shortName: "San Nicolas",
    barangay: "Poblacion",
    municipality: "Canaman",
    province: "Camarines Sur",
    vicariate: "Naga City",
    priest: "Rev. Fr. Benedict A. Torres",
    phone: "(054) 472-8821",
    email: "sannicolas@caceres.ph",
    parishioners: 2870,
    households: 717,
    established: 1751,
    feast: "St. Nicholas of Tolentino – Sep 10",
    category: "parish",
    reportStatus: "returned",
    sacraments: { baptisms: 48, matrimony: 7, confirmations: 0, burials: 14 },
    lastSubmission: "Nov 9, 2026",
  },
  {
    id: "STP",
    code: "CAC-007",
    name: "Santo Tomas Parish",
    shortName: "Sto. Tomas",
    barangay: "Poblacion",
    municipality: "Libmanan",
    province: "Camarines Sur",
    vicariate: "Libmanan",
    priest: "Rev. Fr. Herminigildo C. Delos Reyes",
    phone: "(054) 860-1145",
    email: "stotomas@caceres.ph",
    parishioners: 4200,
    households: 1050,
    established: 1628,
    feast: "St. Thomas the Apostle – Jul 3",
    category: "parish",
    reportStatus: "submitted",
    sacraments: { baptisms: 76, matrimony: 11, confirmations: 40, burials: 28 },
    lastSubmission: "Nov 19, 2026",
  },
  {
    id: "ICP",
    code: "CAC-008",
    name: "Immaculate Conception Parish",
    shortName: "Immaculate Conception",
    barangay: "Poblacion",
    municipality: "Calabanga",
    province: "Camarines Sur",
    vicariate: "Libmanan",
    priest: "Rev. Fr. Jose A. Caños",
    phone: "(054) 860-2267",
    email: "immcon@caceres.ph",
    parishioners: 3550,
    households: 887,
    established: 1793,
    feast: "Immaculate Conception – Dec 8",
    category: "parish",
    reportStatus: "submitted",
    sacraments: { baptisms: 58, matrimony: 9, confirmations: 0, burials: 20 },
    lastSubmission: "Nov 18, 2026",
  },
  {
    id: "HTP",
    code: "CAC-009",
    name: "Holy Trinity Parish",
    shortName: "Holy Trinity",
    barangay: "Poblacion",
    municipality: "Camaligan",
    province: "Camarines Sur",
    vicariate: "Naga City",
    priest: "Rev. Fr. Victorino G. Bueno",
    phone: "(054) 472-6677",
    email: "holytrin@caceres.ph",
    parishioners: 3100,
    households: 775,
    established: 1847,
    feast: "Most Holy Trinity – 1st Sun. after Pentecost",
    category: "parish",
    reportStatus: "pending",
    sacraments: { baptisms: 52, matrimony: 8, confirmations: 0, burials: 17 },
    lastSubmission: null,
  },
]

const REPORTS: Report[] = [
  {
    id: "RPT-2026-11-MCC",
    parishCode: "CAC-000",
    parishName: "Metropolitan Cathedral",
    period: "Nov 2026",
    dueDate: "Dec 5, 2026",
    submittedDate: "Nov 22, 2026",
    status: "submitted",
    baptisms: 24,
    matrimony: 6,
    confirmations: 38,
    burials: 9,
    total: 77,
    submittedBy: "Sr. Rosario Buenaflor",
    note: null,
  },
  {
    id: "RPT-2026-11-MSP",
    parishCode: "CAC-001",
    parishName: "Mater Salutis Parish",
    period: "Nov 2026",
    dueDate: "Dec 5, 2026",
    submittedDate: "Nov 23, 2026",
    status: "submitted",
    baptisms: 9,
    matrimony: 2,
    confirmations: 0,
    burials: 4,
    total: 15,
    submittedBy: "Sec. Lourdes Casas",
    note: null,
  },
  {
    id: "RPT-2026-11-PNF",
    parishCode: "CAC-002",
    parishName: "Peñafrancia Shrine",
    period: "Nov 2026",
    dueDate: "Dec 5, 2026",
    submittedDate: "Nov 21, 2026",
    status: "submitted",
    baptisms: 18,
    matrimony: 3,
    confirmations: 14,
    burials: 6,
    total: 41,
    submittedBy: "Fr. Cornelio Villanueva, OP",
    note: null,
  },
  {
    id: "RPT-2026-11-SJP",
    parishCode: "CAC-005",
    parishName: "Saint Joseph Parish",
    period: "Nov 2026",
    dueDate: "Dec 5, 2026",
    submittedDate: "Nov 20, 2026",
    status: "submitted",
    baptisms: 11,
    matrimony: 2,
    confirmations: 6,
    burials: 4,
    total: 23,
    submittedBy: "Sec. Carina Molina",
    note: null,
  },
  {
    id: "RPT-2026-11-ICP",
    parishCode: "CAC-008",
    parishName: "Immaculate Conception",
    period: "Nov 2026",
    dueDate: "Dec 5, 2026",
    submittedDate: "Nov 18, 2026",
    status: "submitted",
    baptisms: 6,
    matrimony: 1,
    confirmations: 0,
    burials: 3,
    total: 10,
    submittedBy: "Fr. Jose Caños",
    note: null,
  },
  {
    id: "RPT-2026-11-STP",
    parishCode: "CAC-007",
    parishName: "Santo Tomas Parish",
    period: "Nov 2026",
    dueDate: "Dec 5, 2026",
    submittedDate: "Nov 19, 2026",
    status: "submitted",
    baptisms: 7,
    matrimony: 1,
    confirmations: 4,
    burials: 3,
    total: 15,
    submittedBy: "Fr. H.C. Delos Reyes",
    note: null,
  },
  {
    id: "RPT-2026-11-CTK",
    parishCode: "CAC-003",
    parishName: "Christ the King Parish",
    period: "Nov 2026",
    dueDate: "Dec 5, 2026",
    submittedDate: null,
    status: "pending",
    baptisms: null,
    matrimony: null,
    confirmations: null,
    burials: null,
    total: null,
    submittedBy: null,
    note: "First reminder sent Nov 20.",
  },
  {
    id: "RPT-2026-11-HTP",
    parishCode: "CAC-009",
    parishName: "Holy Trinity Parish",
    period: "Nov 2026",
    dueDate: "Dec 5, 2026",
    submittedDate: null,
    status: "pending",
    baptisms: null,
    matrimony: null,
    confirmations: null,
    burials: null,
    total: null,
    submittedBy: null,
    note: null,
  },
  {
    id: "RPT-2026-10-SFP",
    parishCode: "CAC-004",
    parishName: "San Francisco Parish",
    period: "Oct 2026",
    dueDate: "Nov 5, 2026",
    submittedDate: null,
    status: "late",
    baptisms: null,
    matrimony: null,
    confirmations: null,
    burials: null,
    total: null,
    submittedBy: null,
    note: "Two reminders sent. No response from parish contact.",
  },
  {
    id: "RPT-2026-10-SNP",
    parishCode: "CAC-006",
    parishName: "San Nicolas Parish",
    period: "Oct 2026",
    dueDate: "Nov 5, 2026",
    submittedDate: "Nov 9, 2026",
    status: "returned",
    baptisms: 12,
    matrimony: 2,
    confirmations: 0,
    burials: 5,
    total: 19,
    submittedBy: "Fr. Benedict Torres",
    note: "Entry total (19) does not match sum of sacramental entries. Please correct and resubmit.",
  },
]

const FINANCIAL_REPORTS: FinancialReport[] = [
  {
    id: "FIN-2026-11-MSP",
    parishCode: "CAC-001",
    parishName: "Mater Salutis Parish",
    period: "November 2026",
    dueDate: "Dec 10, 2026",
    submittedDate: "Dec 6, 2026",
    status: "submitted",
    totalCollections: 428750,
    totalExpenses: 276400,
    netBalance: 152350,
    amountRemitted: 42875,
    diocesanShare: 10,
    submittedBy: "Sec. Lourdes B. Casas",
    remittanceReceived: false,
    note: null,
    collections: [
      { label: "Sunday collections", amount: 248500 },
      { label: "Mass stipends", amount: 64250 },
      { label: "Special collections", amount: 71000 },
      { label: "Donations", amount: 45000 },
    ],
    expenses: [
      { label: "Utilities", amount: 68400 },
      { label: "Salaries and allowances", amount: 128000 },
      { label: "Repairs and maintenance", amount: 52000 },
      { label: "Charity and outreach", amount: 28000 },
    ],
  },
  {
    id: "FIN-2026-11-MCC",
    parishCode: "CAC-000",
    parishName: "Metropolitan Cathedral",
    period: "November 2026",
    dueDate: "Dec 10, 2026",
    submittedDate: "Dec 5, 2026",
    status: "submitted",
    totalCollections: 1268400,
    totalExpenses: 782500,
    netBalance: 485900,
    amountRemitted: 126840,
    diocesanShare: 10,
    submittedBy: "Sr. Rosario C. Buenaflor",
    remittanceReceived: true,
    note: null,
    collections: [
      { label: "Sunday collections", amount: 756000 },
      { label: "Mass stipends", amount: 182400 },
      { label: "Special collections", amount: 210000 },
      { label: "Donations", amount: 120000 },
    ],
    expenses: [
      { label: "Utilities", amount: 164500 },
      { label: "Salaries and allowances", amount: 338000 },
      { label: "Repairs and maintenance", amount: 195000 },
      { label: "Charity and outreach", amount: 85000 },
    ],
  },
  {
    id: "FIN-2026-11-CTK",
    parishCode: "CAC-003",
    parishName: "Christ the King Parish",
    period: "November 2026",
    dueDate: "Dec 10, 2026",
    submittedDate: null,
    status: "pending",
    totalCollections: null,
    totalExpenses: null,
    netBalance: null,
    amountRemitted: null,
    diocesanShare: 10,
    submittedBy: null,
    remittanceReceived: false,
    note: "Automatic reminder scheduled for December 8.",
    collections: [],
    expenses: [],
  },
  {
    id: "FIN-2026-11-SFP",
    parishCode: "CAC-004",
    parishName: "San Francisco Parish",
    period: "November 2026",
    dueDate: "Dec 10, 2026",
    submittedDate: null,
    status: "late",
    totalCollections: null,
    totalExpenses: null,
    netBalance: null,
    amountRemitted: null,
    diocesanShare: 10,
    submittedBy: null,
    remittanceReceived: false,
    note: "Due date passed. Finance reminder sent twice.",
    collections: [],
    expenses: [],
  },
  {
    id: "FIN-2026-11-SNP",
    parishCode: "CAC-006",
    parishName: "San Nicolas Parish",
    period: "November 2026",
    dueDate: "Dec 10, 2026",
    submittedDate: "Dec 9, 2026",
    status: "returned",
    totalCollections: 246800,
    totalExpenses: 158300,
    netBalance: 91500,
    amountRemitted: 24680,
    diocesanShare: 10,
    submittedBy: "Fr. Benedict A. Torres",
    remittanceReceived: false,
    note: "Reported net balance differs from collections less expenses by ₱3,000. Please correct and attach the missing bank deposit slip.",
    collections: [
      { label: "Sunday collections", amount: 148000 },
      { label: "Mass stipends", amount: 38800 },
      { label: "Special collections", amount: 36000 },
      { label: "Donations", amount: 24000 },
    ],
    expenses: [
      { label: "Utilities", amount: 42300 },
      { label: "Salaries and allowances", amount: 76000 },
      { label: "Repairs and maintenance", amount: 28000 },
      { label: "Charity and outreach", amount: 12000 },
    ],
  },
  {
    id: "FIN-2026-11-PNF",
    parishCode: "CAC-002",
    parishName: "Peñafrancia Shrine",
    period: "November 2026",
    dueDate: "Dec 10, 2026",
    submittedDate: "Dec 7, 2026",
    status: "submitted",
    totalCollections: 896200,
    totalExpenses: 512900,
    netBalance: 383300,
    amountRemitted: 89620,
    diocesanShare: 10,
    submittedBy: "Fr. Cornelio A. Villanueva, OP",
    remittanceReceived: false,
    note: null,
    collections: [
      { label: "Sunday collections", amount: 502000 },
      { label: "Mass stipends", amount: 110200 },
      { label: "Special collections", amount: 184000 },
      { label: "Donations", amount: 100000 },
    ],
    expenses: [
      { label: "Utilities", amount: 112900 },
      { label: "Salaries and allowances", amount: 226000 },
      { label: "Repairs and maintenance", amount: 114000 },
      { label: "Charity and outreach", amount: 60000 },
    ],
  },
]

const RECORDS: RecordEntry[] = [
  {
    id: "REC-001",
    type: "Baptism",
    name: "Lucas Miguel Reyes",
    date: "December 7, 2026",
    dateShort: "Dec 7",
    parish: "Mater Salutis Parish",
    officiant: "Fr. Eduardo Santos",
    bookNo: "B-2026-088",
    pageNo: "14",
    entryNo: "4",
  },
  {
    id: "REC-002",
    type: "Matrimony",
    name: "Roberto Villanueva & Carmen Dela Cruz",
    date: "November 20, 2026",
    dateShort: "Nov 20",
    parish: "Mater Salutis Parish",
    officiant: "Fr. Eduardo Santos",
    bookNo: "M-2026-014",
    pageNo: "09",
    entryNo: "5",
  },
  {
    id: "REC-003",
    type: "Burial",
    name: "Rodrigo Santos Mendoza",
    date: "November 19, 2026",
    dateShort: "Nov 19",
    parish: "Mater Salutis Parish",
    officiant: "Fr. Eduardo Santos",
    bookNo: "BUR-2026-023",
    pageNo: "22",
    entryNo: "8",
  },
  {
    id: "REC-004",
    type: "Baptism",
    name: "Anna Beatrice Perez",
    date: "November 16, 2026",
    dateShort: "Nov 16",
    parish: "Metropolitan Cathedral",
    officiant: "Msgr. Francisco Borja",
    bookNo: "B-2026-241",
    pageNo: "67",
    entryNo: "21",
  },
  {
    id: "REC-005",
    type: "Confirmation",
    name: "Catechism Group A – 38 confirmands",
    date: "November 14, 2026",
    dateShort: "Nov 14",
    parish: "Metropolitan Cathedral",
    officiant: "Most Rev. Roland Tria Tirona",
    bookNo: "CNF-2026-019",
    pageNo: "3",
    entryNo: "1",
  },
  {
    id: "REC-006",
    type: "Matrimony",
    name: "Jaime Alvarez & Sofia Reyes",
    date: "November 9, 2026",
    dateShort: "Nov 9",
    parish: "Peñafrancia Shrine",
    officiant: "Fr. Cornelio Villanueva, OP",
    bookNo: "M-2026-028",
    pageNo: "11",
    entryNo: "3",
  },
  {
    id: "REC-007",
    type: "Baptism",
    name: "Gabriel Emmanuel Santos",
    date: "November 7, 2026",
    dateShort: "Nov 7",
    parish: "Christ the King Parish",
    officiant: "Fr. Andres Lim",
    bookNo: "B-2026-093",
    pageNo: "41",
    entryNo: "14",
  },
  {
    id: "REC-008",
    type: "Burial",
    name: "Corazon Balmaceda Villanueva",
    date: "November 5, 2026",
    dateShort: "Nov 5",
    parish: "Saint Joseph Parish, Pili",
    officiant: "Fr. Mario Panganiban",
    bookNo: "BUR-2026-039",
    pageNo: "18",
    entryNo: "6",
  },
  {
    id: "REC-009",
    type: "Baptism",
    name: "Maria Isabella Cruz",
    date: "November 3, 2026",
    dateShort: "Nov 3",
    parish: "Peñafrancia Shrine",
    officiant: "Fr. Cornelio Villanueva, OP",
    bookNo: "B-2026-162",
    pageNo: "88",
    entryNo: "33",
  },
  {
    id: "REC-010",
    type: "Confirmation",
    name: "Catechism Group B – 45 confirmands",
    date: "October 28, 2026",
    dateShort: "Oct 28",
    parish: "Peñafrancia Shrine",
    officiant: "Most Rev. Roland Tria Tirona",
    bookNo: "CNF-2026-015",
    pageNo: "5",
    entryNo: "1",
  },
]

const USERS: User[] = [
  {
    id: "U1",
    name: "Rev. Fr. Alvaro Q. Bernardo",
    email: "chancellor@caceres.ph",
    initials: "AB",
    role: "Chancellor",
    parish: null,
    lastSeen: "Today, 8:14 AM",
    active: true,
  },
  {
    id: "U2",
    name: "Ms. Corazon R. Salvacion",
    email: "records@caceres.ph",
    initials: "CS",
    role: "Archdiocesan Staff",
    parish: null,
    lastSeen: "Today, 9:02 AM",
    active: true,
  },
  {
    id: "U3",
    name: "Mr. Renaldo M. Cañete",
    email: "finance@caceres.ph",
    initials: "RC",
    role: "Finance Officer",
    parish: null,
    lastSeen: "Yesterday, 4:30 PM",
    active: true,
  },
  {
    id: "U4",
    name: "Sec. Lourdes B. Casas",
    email: "matersalutis@caceres.ph",
    initials: "LC",
    role: "Parish Secretary",
    parish: "Mater Salutis",
    lastSeen: "Today, 10:45 AM",
    active: true,
  },
  {
    id: "U5",
    name: "Sr. Rosario C. Buenaflor",
    email: "admin.cathedral@caceres.ph",
    initials: "RB",
    role: "Parish Administrator",
    parish: "Cathedral",
    lastSeen: "Nov 21, 2:15 PM",
    active: true,
  },
  {
    id: "U6",
    name: "Dcn. Jorge M. Ramos",
    email: "deacon.msp@caceres.ph",
    initials: "JR",
    role: "Parish Secretary",
    parish: "Mater Salutis",
    lastSeen: "Nov 20, 11:30 AM",
    active: true,
  },
  {
    id: "U7",
    name: "Sec. Carina D. Molina",
    email: "stjoseph.pili@caceres.ph",
    initials: "CM",
    role: "Parish Secretary",
    parish: "St. Joseph Pili",
    lastSeen: "Nov 18, 3:00 PM",
    active: false,
  },
]

const NOTIFICATIONS = [
  {
    id: 7,
    unread: true,
    icon: "₱",
    urgency: "medium",
    title: "Finance Report Returned — San Nicolas Parish",
    body: "November 2026 liquidation report returned. Reported balance differs by ₱3,000 and the bank deposit slip is missing.",
    time: "45 minutes ago",
  },
  {
    id: 8,
    unread: true,
    icon: "₱",
    urgency: "low",
    title: "Remittance Received — Metropolitan Cathedral",
    body: "November diocesan share of ₱126,840.00 was verified by the Finance Office.",
    time: "1 hour ago",
  },
  {
    id: 1,
    unread: true,
    icon: "⚠️",
    urgency: "high",
    title: "Late Report — San Francisco Parish",
    body: "October 2026 report not submitted. Due date was November 5. Two reminders sent with no response. Escalation recommended.",
    time: "2 hours ago",
  },
  {
    id: 2,
    unread: true,
    icon: "↩",
    urgency: "medium",
    title: "Report Returned — San Nicolas Parish",
    body: "October report returned for correction. Sacrament total does not match entries. Awaiting resubmission from Fr. Benedict Torres.",
    time: "1 day ago",
  },
  {
    id: 3,
    unread: true,
    icon: "📋",
    urgency: "low",
    title: "New Report — Mater Salutis Parish",
    body: "Sec. Lourdes Casas submitted the November 2026 Monthly Sacramental Report. Total: 15 sacraments recorded.",
    time: "2 days ago",
  },
  {
    id: 4,
    unread: false,
    icon: "✅",
    urgency: "low",
    title: "Report Accepted — Peñafrancia Shrine",
    body: "November 2026 report reviewed and accepted. Total: 41 sacraments. No discrepancies found.",
    time: "3 days ago",
  },
  {
    id: 5,
    unread: false,
    icon: "👤",
    urgency: "low",
    title: "New User Account Created",
    body: "A Parish Secretary account has been provisioned for Holy Trinity Parish, Camaligan. Credentials sent via email.",
    time: "5 days ago",
  },
  {
    id: 6,
    unread: false,
    icon: "📅",
    urgency: "medium",
    title: "Report Deadline Approaching — Dec 5",
    body: "November 2026 monthly report deadline is December 5, 2026. Currently 6 of 10 parishes have submitted. 4 parishes still outstanding.",
    time: "1 week ago",
  },
]

const DIOCESAN_EVENTS = [
  {
    day: 5,
    date: "Sep 5, 2026",
    time: "9:00 AM",
    title: "Baptism Orientation",
    parish: "Mater Salutis Parish",
    type: "Formation",
  },
  {
    day: 8,
    date: "Sep 8, 2026",
    time: "6:00 PM",
    title: "Nativity of the Blessed Virgin Mary Mass",
    parish: "Metropolitan Cathedral",
    type: "Liturgy",
  },
  {
    day: 10,
    date: "Sep 10, 2026",
    time: "7:00 AM",
    title: "San Nicolas Parish Fiesta",
    parish: "San Nicolas Parish, Canaman",
    type: "Parish Feast",
  },
  {
    day: 12,
    date: "Sep 12, 2026",
    time: "7:00 AM",
    title: "Our Lady of Salvation Fiesta",
    parish: "Mater Salutis Parish",
    type: "Parish Feast",
  },
  {
    day: 13,
    date: "Sep 13, 2026",
    time: "1:30 PM",
    title: "Vicariate Confirmation Catechism",
    parish: "Christ the King Parish",
    type: "Formation",
  },
  {
    day: 19,
    date: "Sep 19, 2026",
    time: "4:00 PM",
    title: "Feast of Our Lady of Peñafrancia",
    parish: "Peñafrancia Shrine & Archdiocese",
    type: "Archdiocesan",
  },
  {
    day: 20,
    date: "Sep 20, 2026",
    time: "9:00 AM",
    title: "Mass for Parish Volunteers",
    parish: "Metropolitan Cathedral",
    type: "Liturgy",
  },
  {
    day: 26,
    date: "Sep 26, 2026",
    time: "8:00 AM",
    title: "Vicariate Pre-Cana Seminar",
    parish: "Mater Salutis Parish",
    type: "Formation",
  },
]

const STAT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]
const MONTHLY_SACRAMENTS = {
  baptism: [72, 76, 81, 79, 84, 86, 90, 92, 88, 82, 79, 87],
  matrimony: [12, 14, 15, 16, 18, 17, 19, 21, 20, 14, 13, 11],
  confirmation: [38, 42, 48, 55, 62, 75, 88, 94, 83, 45, 28, 27],
  burial: [25, 27, 29, 31, 28, 30, 32, 29, 27, 26, 28, 26],
}
const MONTHLY_REQUESTS = {
  received: [248, 265, 279, 301, 318, 336, 352, 371, 358, 342, 365, 328],
  completed: [221, 241, 254, 276, 288, 307, 321, 344, 329, 316, 338, 304],
}
const PARISH_STATISTICS = [
  {
    code: "CAC-000",
    name: "Metropolitan Cathedral",
    scheduled: 92,
    completed: 88,
    cancelled: 4,
    received: 86,
    requestCompleted: 80,
    pending: 6,
    days: 2.1,
  },
  {
    code: "CAC-001",
    name: "Mater Salutis Parish",
    scheduled: 38,
    completed: 35,
    cancelled: 3,
    received: 42,
    requestCompleted: 37,
    pending: 5,
    days: 2.8,
  },
  {
    code: "CAC-002",
    name: "Peñafrancia Shrine",
    scheduled: 55,
    completed: 52,
    cancelled: 3,
    received: 63,
    requestCompleted: 58,
    pending: 5,
    days: 2.4,
  },
  {
    code: "CAC-003",
    name: "Christ the King Parish",
    scheduled: 31,
    completed: 27,
    cancelled: 4,
    received: 35,
    requestCompleted: 27,
    pending: 8,
    days: 4.2,
  },
  {
    code: "CAC-004",
    name: "San Francisco Parish",
    scheduled: 24,
    completed: 20,
    cancelled: 4,
    received: 29,
    requestCompleted: 18,
    pending: 11,
    days: 6.8,
  },
  {
    code: "CAC-005",
    name: "Saint Joseph Parish",
    scheduled: 34,
    completed: 32,
    cancelled: 2,
    received: 31,
    requestCompleted: 28,
    pending: 3,
    days: 2.6,
  },
  {
    code: "CAC-006",
    name: "San Nicolas Parish",
    scheduled: 22,
    completed: 18,
    cancelled: 4,
    received: 26,
    requestCompleted: 15,
    pending: 11,
    days: 7.4,
  },
  {
    code: "CAC-007",
    name: "Santo Tomas Parish",
    scheduled: 28,
    completed: 26,
    cancelled: 2,
    received: 24,
    requestCompleted: 21,
    pending: 3,
    days: 3.1,
  },
  {
    code: "CAC-008",
    name: "Immaculate Conception",
    scheduled: 19,
    completed: 18,
    cancelled: 1,
    received: 18,
    requestCompleted: 16,
    pending: 2,
    days: 2.9,
  },
  {
    code: "CAC-009",
    name: "Holy Trinity Parish",
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    received: 0,
    requestCompleted: 0,
    pending: 0,
    days: 0,
    noData: true,
  },
]

// ─── DIOCESAN SEAL ────────────────────────────────────────────────────────────
export const DiocesanSeal = ({ size = 72 }: { size?: number }) => (
  <img
    src="/archdiocese-caceres-seal.png"
    alt="Archdiocese of Caceres coat of arms"
    width={size}
    height={size}
    className="object-contain"
  />
)

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const SC: Record<ReportStatus, {
  label: string
  dot: string
  pill: string
  text: string
  col: string
  colBg: string
}> = {
  submitted: {
    label: "Submitted",
    dot: "#15803D",
    pill: "#DCFCE7",
    text: "#14532D",
    col: "#1E5C3A",
    colBg: "#F0FBF4",
  },
  pending: {
    label: "Pending",
    dot: "#CA8A04",
    pill: "#FEF9C3",
    text: "#713F12",
    col: "#92400E",
    colBg: "#FFFBEB",
  },
  late: {
    label: "Late",
    dot: "#DC2626",
    pill: "#FEE2E2",
    text: "#7F1D1D",
    col: "#991B1B",
    colBg: "#FFF5F5",
  },
  returned: {
    label: "Returned",
    dot: "#2563EB",
    pill: "#DBEAFE",
    text: "#1E3A8A",
    col: "#1E3A8A",
    colBg: "#EFF6FF",
  },
}

const RecordColor: Record<RecordEntry["type"], {
  bg: string
  text: string
  icon: string
}> = {
  Baptism: { bg: "#DBEAFE", text: "#1E3A8A", icon: "💧" },
  Matrimony: { bg: "#FCE7F3", text: "#831843", icon: "💍" },
  Confirmation: { bg: "#EDE9FE", text: "#4C1D95", icon: "🕊️" },
  Burial: { bg: "#E5E7EB", text: "#1F2937", icon: "⛪" },
}

// ─── SMALL UTILITY ────────────────────────────────────────────────────────────
const AdminIcon = ({
  name,
  size = 16,
  className = "",
}: {
  name: string
  size?: number
  className?: string
}) => {
  const icons: Record<string, string> = {
    overview: "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z",
    church: "M12 2v5 M9 4h6 M5 11l7-4 7 4v10H5z M9 21v-6h6v6",
    clipboard:
      "M9 4H6a2 2 0 0 0-2 2v14h16V6a2 2 0 0 0-2-2h-3 M9 2h6v4H9z M8 11h8 M8 15h8",
    statistics: "M4 20V10h4v10z M10 20V4h4v16z M16 20v-7h4v7z",
    check: "M20 6L9 17l-5-5",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z",
    users:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
    calendar:
      "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18",
    settings:
      "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V20h-3v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7 14.7a1.7 1.7 0 0 0-1.55-1H5v-3h.09a1.7 1.7 0 0 0 1.55-1A1.7 1.7 0 0 0 6.3 7.82l-.06-.06 2.12-2.12.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1-1.55V4h3v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.55 1H21v3h-.09a1.7 1.7 0 0 0-1.51 1.7z",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {(icons[name] || "").split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : `M${d}`} />
      ))}
    </svg>
  )
}

const StatusPill = ({ s }: { s: ReportStatus }) => (
  <span
    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
    style={{ background: SC[s].pill, color: SC[s].text }}
  >
    <span
      className="w-1.5 h-1.5 rounded-full"
      style={{ background: SC[s].dot }}
    />
    {SC[s].label}
  </span>
)

const ParishCardAffordance = ({
  status,
  dark = false,
}: {
  status: ReportStatus
  dark?: boolean
}) => (
  <div
    className="flex items-center gap-2 flex-shrink-0"
    aria-label={`${SC[status].label}. Open parish details`}
  >
    <StatusPill s={status} />
    <span
      aria-hidden="true"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-base font-bold transition-all group-hover:translate-x-0.5"
      style={{
        background: dark ? "rgba(255,255,255,.1)" : "#EDE8DF",
        border: dark ? "1px solid rgba(255,255,255,.16)" : "1px solid #DDD0C4",
        color: dark ? "#F5D77A" : "#7B1C1C",
      }}
    >
      →
    </span>
  </div>
)

const SacramentSummary = ({
  parish,
  dark = false,
}: {
  parish: Parish
  dark?: boolean
}) => {
  const items = [
    { label: "Baptisms", value: parish.sacraments.baptisms, color: "#3B82F6" },
    {
      label: "Matrimony",
      value: parish.sacraments.matrimony,
      color: "#BE185D",
    },
    {
      label: "Confirmations",
      value: parish.sacraments.confirmations,
      color: "#7C3AED",
    },
    { label: "Burials", value: parish.sacraments.burials, color: "#6B7280" },
  ]

  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-1.5"
      aria-label="Year-to-date sacrament counts"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-1.5 whitespace-nowrap"
          title={`${item.label}: ${item.value}`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
            style={{ background: item.color }}
            aria-hidden="true"
          />
          <span
            className={`text-[11px] ${
              dark ? "text-white/55" : "text-gray-500"
            }`}
          >
            {item.label}
          </span>
          <strong
            className={`text-xs ${dark ? "text-white" : "text-gray-800"}`}
          >
            {item.value}
          </strong>
        </div>
      ))}
    </div>
  )
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────────────
const Confirm = ({
  title,
  body,
  yes,
  danger = false,
  onYes,
  onNo,
}: {
  title: string
  body: string
  yes: string
  danger?: boolean
  onYes(): void
  onNo(): void
}) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center px-4"
    style={{ background: "rgba(20,8,8,0.55)", backdropFilter: "blur(6px)" }}
  >
    <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white animate-scale-in">
      <div className="px-6 pt-6 pb-4 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
          style={{ background: danger ? "#FEE2E2" : "#FEF3C7" }}
        >
          {danger ? "⚠️" : "❓"}
        </div>
        <h3
          className="font-bold text-gray-900 mb-2 text-lg"
          style={{ fontFamily: "Fraunces, Georgia, serif" }}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
      </div>
      <div className="px-6 pb-5 flex gap-3">
        <button
          onClick={onNo}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-gray-50"
          style={{ borderColor: "#DDD0C4", color: "#6B5647" }}
        >
          Cancel
        </button>
        <button
          onClick={onYes}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{
            background: danger ? "#991B1B" : "#7B1C1C",
            boxShadow: "0 2px 8px rgba(123,28,28,0.3)",
          }}
        >
          {yes}
        </button>
      </div>
    </div>
  </div>
)

// ─── PARISH DETAIL PANEL ──────────────────────────────────────────────────────
const ParishPanel = ({
  parish,
  onClose,
  onStatistics,
}: {
  parish: Parish
  onClose(): void
  onStatistics(): void
}) => {
  const [ptab, setPtab] = useState<"info" | "reports" | "records">("info")
  const parishReports = REPORTS.filter((r) => r.parishCode === parish.code)
  const parishRecords = RECORDS.filter((r) =>
    r.parish
      .toLowerCase()
      .includes(parish.shortName.toLowerCase().split(" ")[0]),
  )
  const totalSacraments =
    parish.sacraments.baptisms +
    parish.sacraments.matrimony +
    parish.sacraments.confirmations +
    parish.sacraments.burials

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(12,5,5,0.5)", backdropFilter: "blur(5px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="h-full w-full max-w-[680px] flex flex-col overflow-hidden shadow-2xl"
        style={{
          background: "#EDE8DF",
          animation: "slideInRight 0.32s cubic-bezier(.22,.68,0,1.2) both",
        }}
      >
        {/* Panel header */}
        <div className="relative flex-shrink-0 h-44 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1548192746-dd526f154ed9?w=680&h=200&fit=crop&auto=format"
            alt={parish.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(28,8,8,0.2) 0%, rgba(28,8,8,0.85) 100%)",
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              backdropFilter: "blur(4px)",
            }}
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <span className="text-white/50 text-xs font-mono tracking-widest">
                  {parish.code} · {parish.category.toUpperCase()}
                </span>
                <h2
                  className="text-white text-2xl font-bold leading-tight"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  {parish.name}
                </h2>
                <p className="text-white/60 text-sm">
                  {parish.barangay}, {parish.municipality} · Est.{" "}
                  {parish.established}
                </p>
              </div>
              <StatusPill s={parish.reportStatus} />
            </div>
          </div>
        </div>

        {/* Sacrament totals strip */}
        <div
          className="flex-shrink-0 grid grid-cols-4 border-b"
          style={{ background: "#1C0808", borderColor: "#3B1010" }}
        >
          {[
            { label: "Baptisms", val: parish.sacraments.baptisms, icon: "💧" },
            {
              label: "Matrimony",
              val: parish.sacraments.matrimony,
              icon: "💍",
            },
            {
              label: "Confirmations",
              val: parish.sacraments.confirmations,
              icon: "🕊️",
            },
            { label: "Burials", val: parish.sacraments.burials, icon: "⛪" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-3 border-r last:border-r-0"
              style={{ borderColor: "#3B1010" }}
            >
              <div className="text-sm mb-0.5">{s.icon}</div>
              <div
                className="text-xl font-black text-white"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                {s.val}
              </div>
              <div className="text-white/40 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className="flex flex-shrink-0 border-b"
          style={{ background: "#F8F4EE", borderColor: "#DDD0C4" }}
        >
          {(["info", "reports", "records"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPtab(t)}
              className="flex-1 py-3.5 text-xs font-bold uppercase tracking-widest transition-all"
              style={{
                color: ptab === t ? "#7B1C1C" : "#9C8F84",
                borderBottom:
                  ptab === t
                    ? "2.5px solid #7B1C1C"
                    : "2.5px solid transparent",
              }}
            >
              {t === "info"
                ? "Parish Info"
                : t === "reports"
                  ? "Reports"
                  : "Records"}
            </button>
          ))}
        </div>

        <div
          className="flex-1 overflow-y-auto p-6"
          style={{ background: "#EDE8DF" }}
        >
          {ptab === "info" && (
            <div className="space-y-5 animate-fade-in">
              {/* Parishioner count hero */}
              <div
                className="rounded-2xl p-5 flex items-center gap-5"
                style={{ background: "#F8F4EE", border: "1px solid #DDD0C4" }}
              >
                <div>
                  <div
                    className="text-5xl font-black"
                    style={{
                      color: "#7B1C1C",
                      fontFamily: "Fraunces, Georgia, serif",
                    }}
                  >
                    {parish.parishioners.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 font-semibold mt-0.5">
                    Registered Parishioners
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {parish.households.toLocaleString()} households ·{" "}
                    {parish.vicariate} Vicariate
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div
                    className="text-2xl font-black"
                    style={{ color: "#C4971A", fontFamily: "Fraunces" }}
                  >
                    {totalSacraments}
                  </div>
                  <div className="text-xs text-gray-400">Sacraments YTD</div>
                </div>
              </div>

              <div
                className="rounded-2xl p-5 space-y-3"
                style={{ background: "#F8F4EE", border: "1px solid #DDD0C4" }}
              >
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Administrative Details
                </h4>
                {[
                  { k: "Parish Priest", v: parish.priest },
                  { k: "Vicariate", v: `${parish.vicariate} Vicariate` },
                  {
                    k: "Address",
                    v: `${parish.barangay}, ${parish.municipality}, ${parish.province}`,
                  },
                  { k: "Telephone", v: parish.phone },
                  { k: "Email", v: parish.email },
                  { k: "Feast Day", v: parish.feast },
                  { k: "Year Founded", v: String(parish.established) },
                ].map((f) => (
                  <div key={f.k} className="flex gap-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">
                      {f.k}
                    </span>
                    <span className="text-sm text-gray-800 font-medium leading-relaxed">
                      {f.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ptab === "reports" && (
            <div className="space-y-3 animate-fade-in">
              {parishReports.length > 0 ? (
                parishReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="rounded-2xl p-4"
                    style={{
                      background: "#F8F4EE",
                      border: `3px solid ${SC[rep.status].dot}22`,
                      borderLeftWidth: 4,
                      borderLeftColor: SC[rep.status].dot,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className="font-bold text-sm text-gray-800"
                          style={{ fontFamily: "Fraunces" }}
                        >
                          {rep.period}
                        </p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {rep.id}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Due {rep.dueDate}
                          {rep.submittedDate
                            ? ` · Submitted ${rep.submittedDate}`
                            : ""}
                        </p>
                      </div>
                      <StatusPill s={rep.status} />
                    </div>
                    {rep.total !== null && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        <span
                          className="text-xs px-2 py-1 rounded-lg font-semibold"
                          style={{ background: "#DBEAFE", color: "#1E3A8A" }}
                        >
                          💧 {rep.baptisms}
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-lg font-semibold"
                          style={{ background: "#FCE7F3", color: "#831843" }}
                        >
                          💍 {rep.matrimony}
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-lg font-semibold"
                          style={{ background: "#EDE9FE", color: "#4C1D95" }}
                        >
                          🕊️ {rep.confirmations}
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-lg font-semibold"
                          style={{ background: "#E5E7EB", color: "#1F2937" }}
                        >
                          ⛪ {rep.burials}
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-lg font-bold"
                          style={{ background: "#1C0808", color: "#C4971A" }}
                        >
                          Total: {rep.total}
                        </span>
                      </div>
                    )}
                    {rep.note && (
                      <p className="mt-2 text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
                        {rep.note}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm py-12">
                  No reports on record.
                </p>
              )}
            </div>
          )}

          {ptab === "records" && (
            <div className="space-y-2 animate-fade-in">
              {parishRecords.length > 0 ? (
                parishRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center gap-4 rounded-xl p-4"
                    style={{
                      background: "#F8F4EE",
                      border: "1px solid #DDD0C4",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: RecordColor[rec.type].bg }}
                    >
                      {RecordColor[rec.type].icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">
                        {rec.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {rec.type} · {rec.date}
                      </p>
                    </div>
                    <p className="text-xs font-mono text-gray-400">
                      {rec.bookNo}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm py-12">
                  No records linked yet.
                </p>
              )}
            </div>
          )}
        </div>

        <div
          className="flex-shrink-0 p-4 flex gap-3 border-t"
          style={{ background: "#F8F4EE", borderColor: "#DDD0C4" }}
        >
          <button
            onClick={onStatistics}
            className="px-5 py-3 rounded-xl text-sm font-bold"
            style={{ background: "#1C0808", color: "#C4971A" }}
          >
            Statistics
          </button>
          <button
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{
              background: "linear-gradient(135deg,#7B1C1C,#9B2C2C)",
              boxShadow: "0 2px 8px rgba(123,28,28,.25)",
            }}
          >
            📧 Contact Parish
          </button>
          <button
            className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-gray-100"
            style={{ borderColor: "#DDD0C4", color: "#6B5647" }}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  )
}

const ReturnFinancialModal = ({
  report,
  onClose,
  onReturn,
}: {
  report: FinancialReport
  onClose(): void
  onReturn(remarks: string): void
}) => {
  const [remarks, setRemarks] = useState("")
  const [error, setError] = useState(false)
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      style={{ background: "rgba(20,8,8,0.58)", backdropFilter: "blur(6px)" }}
    >
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-white animate-scale-in">
        <div
          className="px-6 py-4 flex items-start justify-between"
          style={{ background: "#1C0808" }}
        >
          <div>
            <p
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: "#C4971A" }}
            >
              {report.id}
            </p>
            <h3
              className="text-xl font-black text-white"
              style={{ fontFamily: "Fraunces" }}
            >
              Return for Correction
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-xl text-white/60 hover:text-white"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Explain the corrections required from {report.parishName}. Remarks
            are required and will be added to the report thread.
          </p>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Finance Officer Remarks
          </label>
          <textarea
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value)
              setError(false)
            }}
            rows={5}
            placeholder="Example: Please reconcile the reported net balance and attach the bank deposit slip."
            className="w-full rounded-xl p-3 text-sm resize-none"
            style={{
              border: `1.5px solid ${error ? "#DC2626" : "#DDD0C4"}`,
              background: "#F8F4EE",
            }}
          />
          {error && (
            <p className="text-xs text-red-700 mt-2">
              Remarks are required before returning this report.
            </p>
          )}
        </div>
        <div
          className="px-6 py-4 flex gap-3 border-t"
          style={{ borderColor: "#DDD0C4", background: "#F8F4EE" }}
        >
          <button
            onClick={onClose}
            className="flex-1 min-h-11 rounded-xl text-sm font-semibold border"
            style={{ borderColor: "#DDD0C4" }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!remarks.trim()) {
                setError(true)
                return
              }
              onReturn(remarks.trim())
            }}
            className="flex-1 min-h-11 rounded-xl text-sm font-bold text-white"
            style={{ background: "#991B1B" }}
          >
            Return Report
          </button>
        </div>
      </div>
    </div>
  )
}

const FinancialReportDetail = ({
  report,
  onBack,
  onAccept,
  onReturn,
  onRemittance,
}: {
  report: FinancialReport
  onBack(): void
  onAccept(): void
  onReturn(): void
  onRemittance(): void
}) => {
  const [preview, setPreview] = useState<string | null>(null)
  const collectionTotal = report.collections.reduce(
    (sum, item) => sum + item.amount,
    0,
  )
  const expenseTotal = report.expenses.reduce(
    (sum, item) => sum + item.amount,
    0,
  )
  const calculatedBalance = collectionTotal - expenseTotal
  const hasMismatch =
    report.netBalance !== null && calculatedBalance !== report.netBalance
  const peso = (value: number | null) =>
    value === null
      ? "—"
      : `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
  const documents = [
    "Signed Financial Liquidation Form.pdf",
    "Official Receipts — November.zip",
    "BPI Bank Deposit Slip.pdf",
  ]

  return (
    <div className="p-4 sm:p-8 animate-fade-in">
      <button
        onClick={onBack}
        className="min-h-11 text-sm font-bold mb-5 flex items-center gap-2"
        style={{ color: "#7B1C1C" }}
      >
        ← Back to Financial Board
      </button>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#F8F4EE", border: "1.5px solid #DDD0C4" }}
      >
        <div
          className="p-5 sm:p-7 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          style={{ background: "#1C0808" }}
        >
          <div>
            <p
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: "#C4971A" }}
            >
              {report.id} · {report.period}
            </p>
            <h1
              className="text-3xl font-black text-white mt-1"
              style={{ fontFamily: "Fraunces" }}
            >
              {report.parishName}
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Submitted by {report.submittedBy || "Awaiting parish submission"}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <StatusPill s={report.status} />
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: "rgba(196,151,26,.14)",
                color: "#D4AF37",
                border: "1px solid rgba(196,151,26,.3)",
              }}
            >
              Chancellor · Full Access
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-7 space-y-6">
          <section>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
              Summary Figures
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                ["Total Collections", peso(report.totalCollections)],
                ["Total Expenses", peso(report.totalExpenses)],
                ["Net Balance", peso(report.netBalance)],
                ["Amount Remitted", peso(report.amountRemitted)],
                ["Diocesan Share", `${report.diocesanShare}%`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl p-4 bg-white"
                  style={{ border: "1px solid #E7DED4" }}
                >
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                    {label}
                  </p>
                  <p
                    className="text-xl font-black mt-1 text-gray-800"
                    style={{ fontFamily: "Fraunces" }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {(hasMismatch || report.status === "returned") && (
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{
                background: "#DBEAFE",
                border: "1px solid #BFDBFE",
                color: "#1E3A8A",
              }}
            >
              <AdminIcon
                name="clipboard"
                size={18}
                className="mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-xs font-black uppercase tracking-widest">
                  Auto-validation flag
                </p>
                <p className="text-sm mt-1">
                  Collections minus expenses does not match the reported
                  balance. Calculated balance: {peso(calculatedBalance)};
                  reported: {peso(report.netBalance)}.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              {
                title: "Collections",
                rows: report.collections,
                total: collectionTotal,
              },
              { title: "Expenses", rows: report.expenses, total: expenseTotal },
            ].map((table) => (
              <section
                key={table.title}
                className="rounded-2xl overflow-hidden bg-white"
                style={{ border: "1px solid #DDD0C4" }}
              >
                <div
                  className="px-5 py-3 border-b"
                  style={{ background: "#EDE8DF", borderColor: "#DDD0C4" }}
                >
                  <h2
                    className="font-black text-gray-800"
                    style={{ fontFamily: "Fraunces" }}
                  >
                    {table.title}
                  </h2>
                </div>
                <div className="divide-y" style={{ borderColor: "#E7DED4" }}>
                  {table.rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between gap-4 px-5 py-3 text-sm"
                    >
                      <span className="text-gray-600">{row.label}</span>
                      <span className="font-semibold text-gray-800">
                        {peso(row.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between px-5 py-3 font-black text-sm">
                    <span>Total</span>
                    <span style={{ color: "#7B1C1C" }}>
                      {peso(table.total)}
                    </span>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <section>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
              Supporting Documents
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {documents.map((document, index) => (
                <button
                  key={document}
                  onClick={() => setPreview(document)}
                  className="min-h-20 text-left rounded-xl p-4 bg-white hover:-translate-y-0.5 transition-all"
                  style={{ border: "1px solid #DDD0C4" }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: "#EDE8DF", color: "#7B1C1C" }}
                    >
                      <AdminIcon name="clipboard" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        {document}
                      </p>
                      <p className="text-[10px] text-green-700 mt-1">
                        {index === 1 ? "12 files · Verified" : "PDF · Verified"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {preview && (
              <div
                className="mt-3 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{ background: "#1C0808", border: "1px solid #3B1010" }}
              >
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-white/40">
                    Document Preview
                  </p>
                  <p className="text-sm font-bold text-white mt-1">{preview}</p>
                  <p className="text-xs text-white/40 mt-1">
                    Preview generated securely · Page 1 of 2
                  </p>
                </div>
                <button
                  onClick={() => setPreview(null)}
                  className="min-h-11 px-4 rounded-xl text-xs font-bold"
                  style={{ background: "#C4971A", color: "#1C0808" }}
                >
                  Close Preview
                </button>
              </div>
            )}
          </section>

          <section
            className="rounded-2xl p-5 bg-white"
            style={{ border: "1px solid #DDD0C4" }}
          >
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">
              Remarks Thread
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{ background: "#7B1C1C" }}
                >
                  RC
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    Renaldo Cañete · Finance Officer
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Please confirm that the diocesan share is based on gross
                    collections before December 10.
                  </p>
                  <p className="text-[10px] font-mono text-gray-400 mt-1">
                    Dec 7 · 9:20 AM
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{ background: "#C4971A" }}
                >
                  LC
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    {report.submittedBy || "Parish Secretary"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Confirmed. The signed liquidation form and deposit reference
                    are attached for review.
                  </p>
                  <p className="text-[10px] font-mono text-gray-400 mt-1">
                    Dec 7 · 10:05 AM
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onAccept}
              disabled={report.status !== "submitted"}
              className="min-h-11 flex-1 rounded-xl text-sm font-bold text-white disabled:opacity-40"
              style={{ background: "#15803D" }}
            >
              Accept
            </button>
            <button
              onClick={onReturn}
              disabled={report.status !== "submitted"}
              className="min-h-11 flex-1 rounded-xl text-sm font-bold disabled:opacity-40"
              style={{ background: "#FEE2E2", color: "#7F1D1D" }}
            >
              Return for Correction
            </button>
            <button
              onClick={onRemittance}
              disabled={
                report.remittanceReceived || report.amountRemitted === null
              }
              className="min-h-11 flex-1 rounded-xl text-sm font-bold disabled:opacity-40"
              style={{ background: "#7B1C1C", color: "white" }}
            >
              {report.remittanceReceived
                ? "Remittance Received"
                : "Mark Remittance Received"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatisticsPage = ({
  initialParish,
  onParishChange,
}: {
  initialParish: string
  onParishChange(parish: string): void
}) => {
  const [startPeriod, setStartPeriod] = useState("January 2026")
  const [endPeriod, setEndPeriod] = useState("November 2026")
  const [sortKey, setSortKey] =
    useState<"name" | "scheduled" | "completed" | "cancelled" | "total">(
      "total",
    )
  const [sortAsc, setSortAsc] = useState(false)
  const [drillParish, setDrillParish] =
    useState<typeof PARISH_STATISTICS[number] | null>(null)
  const [printView, setPrintView] = useState(false)
  const [viewState, setViewState] = useState<"loading" | "ready" | "error">(
    "ready",
  )
  const [exportJob, setExportJob] = useState<{
    label: string
    action: "pdf" | "excel" | "print"
    progress: number
    status: "working" | "done"
  } | null>(null)

  useEffect(() => {
    setViewState("loading")
    const timer = window.setTimeout(
      () => setViewState(endPeriod === "Archived 2025" ? "error" : "ready"),
      350,
    )
    return () => window.clearTimeout(timer)
  }, [startPeriod, endPeriod, initialParish])

  useEffect(() => {
    if (!exportJob || exportJob.status !== "working") return

    const progressTimer = window.setInterval(() => {
      setExportJob((current) =>
        current && current.status === "working"
          ? { ...current, progress: Math.min(current.progress + 11, 92) }
          : current,
      )
    }, 100)
    const completionTimer = window.setTimeout(() => {
      window.clearInterval(progressTimer)
      setExportJob((current) =>
        current ? { ...current, progress: 100, status: "done" } : null,
      )
    }, 850)

    return () => {
      window.clearInterval(progressTimer)
      window.clearTimeout(completionTimer)
    }
  }, [exportJob?.action, exportJob?.status])

  useEffect(() => {
    if (!exportJob || exportJob.status !== "done") return
    const timer = window.setTimeout(
      () => {
        if (exportJob.action === "print") setPrintView(true)
        setExportJob(null)
      },
      exportJob.action === "print" ? 550 : 1600,
    )
    return () => window.clearTimeout(timer)
  }, [exportJob])

  const beginExport = (label: string, action: "pdf" | "excel" | "print") => {
    setExportJob({ label, action, progress: 6, status: "working" })
  }

  const updateStartPeriod = (value: string) => {
    setViewState("loading")
    setStartPeriod(value)
  }

  const updateEndPeriod = (value: string) => {
    setViewState("loading")
    setEndPeriod(value)
  }

  const updateParish = (value: string) => {
    setViewState("loading")
    onParishChange(value)
  }

  const isEmpty = endPeriod === "December 2026"
  const selectedRows = PARISH_STATISTICS.filter(
    (row) => initialParish === "All Parishes" || row.name === initialParish,
  )
  const sortedSacraments = [...selectedRows].sort((a, b) => {
    const av =
      sortKey === "name"
        ? a.name
        : sortKey === "total"
          ? a.scheduled + a.completed + a.cancelled
          : a[sortKey]
    const bv =
      sortKey === "name"
        ? b.name
        : sortKey === "total"
          ? b.scheduled + b.completed + b.cancelled
          : b[sortKey]
    return (
      (typeof av === "string"
        ? av.localeCompare(String(bv))
        : Number(av) - Number(bv)) * (sortAsc ? 1 : -1)
    )
  })
  const totalForMonth = 79 + 13 + 28 + 28
  const summary = [
    {
      label: "Total Sacraments",
      value: totalForMonth,
      change: "+4.8%",
      tone: "#7B1C1C",
    },
    {
      label: "Scheduled Sacraments",
      value: 343,
      change: "+6.2%",
      tone: "#C4971A",
    },
    { label: "Completed", value: 316, change: "+5.7%", tone: "#15803D" },
    {
      label: "Cancelled / Postponed",
      value: 27,
      change: "-8.1%",
      tone: "#DC2626",
    },
    { label: "Total Requests", value: 365, change: "+6.7%", tone: "#2563EB" },
    {
      label: "Avg. Processing Time",
      value: "3.4 days",
      change: "-0.6 day",
      tone: "#7C3AED",
    },
  ]
  const maxSacramentMonth = Math.max(
    ...STAT_MONTHS.map(
      (_, index) =>
        MONTHLY_SACRAMENTS.baptism[index] +
        MONTHLY_SACRAMENTS.matrimony[index] +
        MONTHLY_SACRAMENTS.confirmation[index] +
        MONTHLY_SACRAMENTS.burial[index],
    ),
  )
  const requestPoints = (values: number[]) =>
    values
      .map((value, index) => `${index * 72 + 20},${210 - (value / 400) * 180}`)
      .join(" ")
  const rankedParishes = [...PARISH_STATISTICS]
    .filter((row) => !row.noData)
    .sort((a, b) => b.completed - a.completed)

  const changeSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc((current) => !current)
    else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  const ChartLegend = () => (
    <div className="flex flex-wrap gap-3 text-[10px] font-semibold text-gray-500">
      {[
        ["Baptism", "#2563EB"],
        ["Matrimony", "#BE185D"],
        ["Confirmation", "#7C3AED"],
        ["Burial", "#374151"],
      ].map(([label, color]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ background: color }}
          />
          {label}
        </span>
      ))}
    </div>
  )

  const StackedChart = ({ compact = false }: { compact?: boolean }) => (
    <div>
      <div
        className={`flex items-end gap-2 sm:gap-3 ${
          compact ? "h-36" : "h-64"
        } border-b border-l px-2 pt-4`}
        style={{ borderColor: "#DDD0C4" }}
      >
        {STAT_MONTHS.map((month, index) => {
          const values = [
            { value: MONTHLY_SACRAMENTS.baptism[index], color: "#2563EB" },
            { value: MONTHLY_SACRAMENTS.matrimony[index], color: "#BE185D" },
            { value: MONTHLY_SACRAMENTS.confirmation[index], color: "#7C3AED" },
            { value: MONTHLY_SACRAMENTS.burial[index], color: "#374151" },
          ]
          const total = values.reduce((sum, item) => sum + item.value, 0)
          return (
            <div
              key={month}
              className="flex-1 h-full flex flex-col justify-end group relative"
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-400 opacity-0 group-hover:opacity-100">
                {total}
              </div>
              <div
                className="w-full flex flex-col-reverse rounded-t overflow-hidden"
                style={{ height: `${(total / maxSacramentMonth) * 90}%` }}
              >
                {values.map((item, valueIndex) => (
                  <div
                    key={valueIndex}
                    style={{
                      background: item.color,
                      height: `${(item.value / total) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex gap-2 sm:gap-3 px-2 mt-2">
        {STAT_MONTHS.map((month) => (
          <span
            key={month}
            className="flex-1 text-center text-[9px] font-mono text-gray-400"
          >
            {month}
          </span>
        ))}
      </div>
    </div>
  )

  if (printView) {
    return (
      <div className="statistics-print fixed inset-0 z-[150] overflow-y-auto bg-white">
        <div
          className="print-controls sticky top-0 px-5 py-3 flex justify-end gap-3"
          style={{ background: "#1C0808" }}
        >
          <button
            onClick={() => setPrintView(false)}
            className="min-h-11 px-5 rounded-xl text-sm font-bold bg-white text-gray-700"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="min-h-11 px-5 rounded-xl text-sm font-bold"
            style={{ background: "#C4971A", color: "#1C0808" }}
          >
            Print Report
          </button>
        </div>
        <div className="max-w-5xl mx-auto p-8 sm:p-12">
          <div
            className="flex items-center gap-5 pb-6 border-b-2"
            style={{ borderColor: "#7B1C1C" }}
          >
            <DiocesanSeal size={74} />
            <div>
              <p className="text-xs font-mono uppercase tracking-[.2em] text-gray-500">
                Archdiocese of Caceres · Naga City
              </p>
              <h1
                className="text-3xl font-black text-gray-900"
                style={{ fontFamily: "Fraunces" }}
              >
                Monthly Statistical Report
              </h1>
              <p className="text-sm text-gray-500">
                {startPeriod}–{endPeriod} · {initialParish}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 my-6">
            {summary.slice(0, 6).map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-4"
                style={{ background: "#F8F4EE", border: "1px solid #DDD0C4" }}
              >
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  {item.label}
                </p>
                <p
                  className="text-2xl font-black text-gray-800"
                  style={{ fontFamily: "Fraunces" }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <h2
            className="text-lg font-black mb-2"
            style={{ fontFamily: "Fraunces" }}
          >
            Sacramental Trend
          </h2>
          <StackedChart compact />
          <div className="mt-3">
            <ChartLegend />
          </div>
          <h2
            className="text-lg font-black mt-8 mb-3"
            style={{ fontFamily: "Fraunces" }}
          >
            Parish Summary
          </h2>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "#EDE8DF" }}>
                <th className="text-left p-2">Parish</th>
                <th>Scheduled</th>
                <th>Completed</th>
                <th>Cancelled</th>
                <th>Requests</th>
              </tr>
            </thead>
            <tbody>
              {PARISH_STATISTICS.map((row) => (
                <tr key={row.code} className="border-b">
                  <td className="p-2">{row.name}</td>
                  <td className="text-center">
                    {row.noData ? "No data" : row.scheduled}
                  </td>
                  <td className="text-center">
                    {row.noData ? "—" : row.completed}
                  </td>
                  <td className="text-center">
                    {row.noData ? "—" : row.cancelled}
                  </td>
                  <td className="text-center">
                    {row.noData ? "—" : row.received}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-20 ml-auto w-72 text-center border-t border-gray-700 pt-2">
            <p className="font-bold">Rev. Fr. Alvaro Q. Bernardo</p>
            <p className="text-xs text-gray-500">
              Chancellor · Archdiocese of Caceres
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8">
      {exportJob && (
        <div
          className="fixed top-20 right-4 sm:right-6 z-[200] w-[min(22rem,calc(100vw-2rem))] animate-slide-right"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            className="rounded-2xl p-4 shadow-2xl"
            style={{
              background: "#1C0808",
              border: "1px solid rgba(196,151,26,.55)",
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    exportJob.status === "done"
                      ? "rgba(34,197,94,.15)"
                      : "rgba(196,151,26,.16)",
                  color: exportJob.status === "done" ? "#86EFAC" : "#D4AF37",
                }}
              >
                <AdminIcon
                  name={exportJob.status === "done" ? "check" : "statistics"}
                  size={17}
                />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-white">
                      {exportJob.status === "done"
                        ? `${exportJob.label} ready`
                        : `Generating ${exportJob.label}`}
                    </p>
                    <p className="text-[11px] text-white/45 mt-0.5">
                      {exportJob.status === "done"
                        ? exportJob.action === "print"
                          ? "Opening print preview…"
                          : "Report generation complete."
                        : "Compiling filtered parish datasets…"}
                    </p>
                  </div>
                  <strong
                    className="text-xs font-mono"
                    style={{ color: "#D4AF37" }}
                  >
                    {exportJob.progress}%
                  </strong>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden mt-3"
                  style={{ background: "rgba(255,255,255,.12)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-100"
                    style={{
                      width: `${exportJob.progress}%`,
                      background:
                        exportJob.status === "done" ? "#22C55E" : "#C4971A",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 mb-6">
        <div>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
            Diocesan Analytics
          </p>
          <h1
            className="text-3xl sm:text-4xl font-black text-gray-900"
            style={{ fontFamily: "Fraunces" }}
          >
            Statistics
          </h1>
          <p className="text-gray-500 mt-1">
            Monthly sacraments and parishioner service requests
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => beginExport("PDF export", "pdf")}
            disabled={!!exportJob}
            className="min-h-11 px-4 rounded-xl text-xs font-bold text-white disabled:opacity-50 disabled:cursor-wait"
            style={{ background: "#7B1C1C" }}
          >
            Export PDF
          </button>
          <button
            onClick={() => beginExport("Excel workbook", "excel")}
            disabled={!!exportJob}
            className="min-h-11 px-4 rounded-xl text-xs font-bold border disabled:opacity-50 disabled:cursor-wait"
            style={{
              background: "#F8F4EE",
              borderColor: "#DDD0C4",
              color: "#6B5647",
            }}
          >
            Export Excel
          </button>
          <button
            onClick={() => beginExport("printable report", "print")}
            disabled={!!exportJob}
            className="min-h-11 px-4 rounded-xl text-xs font-bold border disabled:opacity-50 disabled:cursor-wait"
            style={{
              background: "#1C0808",
              borderColor: "#3B1010",
              color: "#C4971A",
            }}
          >
            Printable Report
          </button>
        </div>
      </div>

      <div
        className="rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-3"
        style={{ background: "#F8F4EE", border: "1.5px solid #DDD0C4" }}
      >
        <div className="grid grid-cols-2 gap-3 flex-1">
          <label className="text-xs font-bold text-gray-500">
            From
            <select
              value={startPeriod}
              onChange={(e) => updateStartPeriod(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl px-3 text-sm bg-white border border-[#DDD0C4]"
            >
              <option>January 2026</option>
              <option>June 2026</option>
              <option>November 2026</option>
            </select>
          </label>
          <label className="text-xs font-bold text-gray-500">
            To
            <select
              value={endPeriod}
              onChange={(e) => updateEndPeriod(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl px-3 text-sm bg-white border border-[#DDD0C4]"
            >
              <option>November 2026</option>
              <option>December 2026</option>
              <option>Archived 2025</option>
            </select>
          </label>
        </div>
        <label className="text-xs font-bold text-gray-500 flex-1">
          Parish
          <select
            value={initialParish}
            onChange={(e) => updateParish(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-xl px-3 text-sm bg-white border border-[#DDD0C4]"
          >
            <option>All Parishes</option>
            {PARISHES.map((parish) => (
              <option key={parish.id}>{parish.name}</option>
            ))}
          </select>
        </label>
      </div>

      {viewState === "loading" ? (
        <div
          className="space-y-5"
          role="status"
          aria-live="polite"
          aria-label="Updating statistics"
        >
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white border border-[#DDD0C4]">
            <span className="w-4 h-4 rounded-full border-2 border-[#E7DED4] border-t-[#7B1C1C] animate-spin" />
            <div>
              <p className="text-xs font-bold text-gray-700">
                Updating statistics
              </p>
              <p className="text-[11px] text-gray-400">
                Applying date range and parish filters…
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-28 rounded-2xl shimmer" />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 h-80 rounded-2xl shimmer" />
            <div className="h-80 rounded-2xl shimmer" />
          </div>
          <div
            className="rounded-2xl overflow-hidden bg-white"
            style={{ border: "1px solid #DDD0C4" }}
          >
            <div className="h-12 shimmer" />
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 rounded-lg shimmer"
                  style={{ opacity: 1 - index * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : viewState === "error" ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "#F8F4EE", border: "1.5px solid #FCA5A5" }}
        >
          <AdminIcon
            name="statistics"
            size={32}
            className="mx-auto text-red-700 mb-3"
          />
          <h2
            className="font-black text-xl text-gray-800"
            style={{ fontFamily: "Fraunces" }}
          >
            Archived statistics unavailable
          </h2>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            The 2025 archive could not be loaded. Try the current reporting year
            or retry.
          </p>
          <button
            onClick={() => {
              setEndPeriod("November 2026")
              setViewState("loading")
            }}
            className="min-h-11 px-5 rounded-xl text-sm font-bold text-white"
            style={{ background: "#7B1C1C" }}
          >
            Return to 2026
          </button>
        </div>
      ) : isEmpty ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "#F8F4EE", border: "1.5px dashed #DDD0C4" }}
        >
          <AdminIcon
            name="statistics"
            size={32}
            className="mx-auto text-gray-300 mb-3"
          />
          <h2
            className="font-black text-xl text-gray-700"
            style={{ fontFamily: "Fraunces" }}
          >
            No December data yet
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Statistics will appear after parishes submit their December monthly
            reports.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            {summary.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl p-4 bg-white"
                style={{ border: "1px solid #DDD0C4" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {item.label}
                </p>
                <p
                  className="text-2xl font-black mt-2"
                  style={{ color: item.tone, fontFamily: "Fraunces" }}
                >
                  {item.value}
                </p>
                <p
                  className={`text-xs font-semibold mt-1 ${
                    item.change.startsWith("-") &&
                    item.label !== "Cancelled / Postponed" &&
                    item.label !== "Avg. Processing Time"
                      ? "text-red-600"
                      : "text-green-700"
                  }`}
                >
                  {item.change} vs. October
                </p>
              </div>
            ))}
          </div>

          <section>
            <div className="mb-4">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
                Sacraments
              </p>
              <h2
                className="text-2xl font-black text-gray-800"
                style={{ fontFamily: "Fraunces" }}
              >
                Monthly Sacramental Activity
              </h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div
                className="xl:col-span-2 rounded-2xl p-5 bg-white"
                style={{ border: "1px solid #DDD0C4" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h3
                    className="font-black text-gray-800"
                    style={{ fontFamily: "Fraunces" }}
                  >
                    January–December 2026
                  </h3>
                  <ChartLegend />
                </div>
                <StackedChart />
              </div>
              <div
                className="rounded-2xl p-5 bg-white"
                style={{ border: "1px solid #DDD0C4" }}
              >
                <h3
                  className="font-black text-gray-800 mb-5"
                  style={{ fontFamily: "Fraunces" }}
                >
                  Scheduled vs. Completed
                </h3>
                {[
                  { label: "Scheduled", value: 343, color: "#C4971A" },
                  { label: "Completed", value: 316, color: "#15803D" },
                  { label: "Cancelled", value: 27, color: "#DC2626" },
                ].map((item) => (
                  <div key={item.label} className="mb-5">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-gray-600">
                        {item.label}
                      </span>
                      <strong style={{ fontFamily: "Fraunces" }}>
                        {item.value}
                      </strong>
                    </div>
                    <div
                      className="h-4 rounded-full"
                      style={{ background: "#EDE8DF" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.value / 343) * 100}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="mt-5 rounded-2xl overflow-x-auto bg-white"
              style={{ border: "1px solid #DDD0C4" }}
            >
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr style={{ background: "#1C0808", color: "white" }}>
                    {[
                      ["name", "Parish"],
                      ["scheduled", "Scheduled"],
                      ["completed", "Completed"],
                      ["cancelled", "Cancelled"],
                      ["total", "Total"],
                    ].map(([key, label]) => (
                      <th key={key} className="text-left px-4 py-3">
                        <button
                          onClick={() => changeSort(key as typeof sortKey)}
                          className="font-bold"
                        >
                          {label} {sortKey === key ? (sortAsc ? "↑" : "↓") : ""}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedSacraments.map((row) => (
                    <tr
                      key={row.code}
                      className="border-b last:border-b-0"
                      style={{ borderColor: "#E7DED4" }}
                    >
                      <td className="px-4 py-3 font-semibold">
                        {row.name}
                        {row.noData && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-500">
                            No data
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {row.noData ? "—" : row.scheduled}
                      </td>
                      <td className="px-4 py-3">
                        {row.noData ? "—" : row.completed}
                      </td>
                      <td className="px-4 py-3">
                        {row.noData ? "—" : row.cancelled}
                      </td>
                      <td className="px-4 py-3 font-black">
                        {row.noData
                          ? "—"
                          : row.scheduled + row.completed + row.cancelled}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
                Requests
              </p>
              <h2
                className="text-2xl font-black text-gray-800"
                style={{ fontFamily: "Fraunces" }}
              >
                Parishioner Service Requests
              </h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div
                className="xl:col-span-2 rounded-2xl p-5 bg-white overflow-x-auto"
                style={{ border: "1px solid #DDD0C4" }}
              >
                <div className="flex flex-wrap gap-4 mb-3 text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-0.5 bg-primary" />
                    Received
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-0.5 bg-green-700" />
                    Completed
                  </span>
                </div>
                <svg
                  viewBox="0 0 840 230"
                  className="w-full min-w-[620px] h-64"
                >
                  <line x1="20" y1="210" x2="820" y2="210" stroke="#DDD0C4" />
                  <polyline
                    points={requestPoints(MONTHLY_REQUESTS.received)}
                    fill="none"
                    stroke="#7B1C1C"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={requestPoints(MONTHLY_REQUESTS.completed)}
                    fill="none"
                    stroke="#15803D"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  {STAT_MONTHS.map((month, index) => (
                    <text
                      key={month}
                      x={index * 72 + 20}
                      y="226"
                      fontSize="10"
                      textAnchor="middle"
                      fill="#9CA3AF"
                    >
                      {month}
                    </text>
                  ))}
                </svg>
              </div>
              <div
                className="rounded-2xl p-5 bg-white"
                style={{ border: "1px solid #DDD0C4" }}
              >
                <h3
                  className="font-black text-gray-800 mb-4"
                  style={{ fontFamily: "Fraunces" }}
                >
                  Breakdown by Type
                </h3>
                {[
                  { label: "Baptismal Certificates", value: 94 },
                  { label: "Communion Certificates", value: 56 },
                  { label: "Confirmation Certificates", value: 72 },
                  { label: "Matrimony Certificates", value: 48 },
                  { label: "Sacrament Scheduling", value: 95 },
                ].map((item) => (
                  <div key={item.label} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.value / 95) * 100}%`,
                          background: "#7B1C1C",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="mt-5 rounded-2xl overflow-x-auto bg-white"
              style={{ border: "1px solid #DDD0C4" }}
            >
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr style={{ background: "#EDE8DF" }}>
                    <th className="text-left px-4 py-3">Parish</th>
                    <th className="text-left">Received</th>
                    <th className="text-left">Completed</th>
                    <th className="text-left">Pending</th>
                    <th className="text-left">Avg. Processing</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRows.map((row) => (
                    <tr
                      key={row.code}
                      className={`border-b last:border-b-0 ${
                        row.days >= 6 ? "bg-red-50" : ""
                      }`}
                      style={{ borderColor: "#E7DED4" }}
                    >
                      <td className="px-4 py-3 font-semibold">
                        {row.name}
                        {row.days >= 6 && (
                          <span className="ml-2 text-[10px] font-bold text-red-700">
                            Longest backlog
                          </span>
                        )}
                      </td>
                      <td>{row.noData ? "No data" : row.received}</td>
                      <td>{row.noData ? "—" : row.requestCompleted}</td>
                      <td>{row.noData ? "—" : row.pending}</td>
                      <td
                        className={
                          row.days >= 6 ? "font-bold text-red-700" : ""
                        }
                      >
                        {row.noData ? "—" : `${row.days} days`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
                Parish Comparison
              </p>
              <h2
                className="text-2xl font-black text-gray-800"
                style={{ fontFamily: "Fraunces" }}
              >
                Completed Sacraments Ranking
              </h2>
            </div>
            <div
              className="rounded-2xl p-5 bg-white"
              style={{ border: "1px solid #DDD0C4" }}
            >
              {rankedParishes.map((parish, index) => (
                <button
                  key={parish.code}
                  onClick={() => setDrillParish(parish)}
                  className="w-full min-h-11 grid grid-cols-[24px_minmax(130px,220px)_1fr_40px] items-center gap-3 text-left mb-2 last:mb-0 group"
                >
                  <span className="text-xs font-mono text-gray-400">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-gray-700 truncate group-hover:text-primary">
                    {parish.name}
                  </span>
                  <span
                    className="h-5 rounded-r-full transition-all"
                    style={{
                      width: `${(parish.completed / rankedParishes[0].completed) * 100}%`,
                      background: index < 3 ? "#7B1C1C" : "#C4971A",
                    }}
                  />
                  <strong className="text-sm text-gray-700">
                    {parish.completed}
                  </strong>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {drillParish && (
        <div
          className="fixed inset-0 z-[90] flex justify-end"
          style={{ background: "rgba(12,5,5,.5)", backdropFilter: "blur(5px)" }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setDrillParish(null)
          }}
        >
          <aside
            className="w-full sm:max-w-xl h-full overflow-y-auto shadow-2xl p-5 sm:p-7"
            style={{ background: "#EDE8DF" }}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
                  {drillParish.code} · 12-month drill-down
                </p>
                <h2
                  className="text-2xl font-black text-gray-900"
                  style={{ fontFamily: "Fraunces" }}
                >
                  {drillParish.name}
                </h2>
              </div>
              <button
                onClick={() => setDrillParish(null)}
                className="w-11 h-11 rounded-xl bg-white text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-xl p-4 bg-white border border-[#DDD0C4]">
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  Completed Sacraments
                </p>
                <p
                  className="text-3xl font-black text-primary"
                  style={{ fontFamily: "Fraunces" }}
                >
                  {drillParish.completed}
                </p>
              </div>
              <div className="rounded-xl p-4 bg-white border border-[#DDD0C4]">
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  Open Requests
                </p>
                <p
                  className="text-3xl font-black text-gold-dark"
                  style={{ fontFamily: "Fraunces" }}
                >
                  {drillParish.pending}
                </p>
              </div>
            </div>
            <div className="rounded-2xl p-5 bg-white border border-[#DDD0C4] mb-5">
              <h3
                className="font-black mb-4"
                style={{ fontFamily: "Fraunces" }}
              >
                Sacraments · 12 months
              </h3>
              <div className="h-44 flex items-end gap-2">
                {STAT_MONTHS.map((month, index) => (
                  <div
                    key={month}
                    className="flex-1 flex flex-col justify-end items-center gap-1"
                  >
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${28 + ((index * 13 + drillParish.completed) % 65)}%`,
                        background: "#7B1C1C",
                      }}
                    />
                    <span className="text-[8px] text-gray-400">{month}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-5 bg-white border border-[#DDD0C4]">
              <h3
                className="font-black mb-4"
                style={{ fontFamily: "Fraunces" }}
              >
                Requests · 12 months
              </h3>
              <svg viewBox="0 0 520 180" className="w-full h-52">
                <polyline
                  points={STAT_MONTHS.map(
                    (_, index) =>
                      `${index * 45 + 12},${155 - ((index * 9 + drillParish.received) % 100)}`,
                  ).join(" ")}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="4"
                />
                <polyline
                  points={STAT_MONTHS.map(
                    (_, index) =>
                      `${index * 45 + 12},${165 - ((index * 7 + drillParish.requestCompleted) % 90)}`,
                  ).join(" ")}
                  fill="none"
                  stroke="#15803D"
                  strokeWidth="4"
                />
              </svg>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-blue-600" />
                  Received
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-green-700" />
                  Completed
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AdminDashboard({ onLogout }: { onLogout(): void }) {
  const [tab, setTab] = useState<AdminTab>("overview")
  const [parishPanel, setParishPanel] = useState<Parish | null>(null)
  const [parishSearch, setParishSearch] = useState("")
  const [parishFilter, setParishFilter] = useState<ReportStatus | "all">("all")
  const [recordSearch, setRecordSearch] = useState("")
  const [recordType, setRecordType] = useState<"All" | RecordEntry["type"]>(
    "All",
  )
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)
  const [reports, setReports] = useState(REPORTS)
  const [financialReports, setFinancialReports] = useState(FINANCIAL_REPORTS)
  const [reportView, setReportView] = useState<"sacramental" | "financial">(
    "sacramental",
  )
  const [reportPeriod, setReportPeriod] = useState("November 2026")
  const [financialBoardState, setFinancialBoardState] =
    useState<"loading" | "ready" | "error">("ready")
  const [selectedFinancialReport, setSelectedFinancialReport] =
    useState<FinancialReport | null>(null)
  const [returnFinancialReport, setReturnFinancialReport] =
    useState<FinancialReport | null>(null)
  const [users, setUsers] = useState(USERS)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [overviewPanel, setOverviewPanel] =
    useState<"activity" | "calendar" | "notifications">("activity")
  const [confirm, setConfirm] = useState<null | {
    title: string
    body: string
    yes: string
    danger?: boolean
    action(): void
  }>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [userDrawer, setUserDrawer] = useState(false)
  const [statisticsParish, setStatisticsParish] = useState("All Parishes")

  const pop = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3200)
  }

  useEffect(() => {
    if (reportView !== "financial") return
    setFinancialBoardState("loading")
    const timer = window.setTimeout(() => {
      setFinancialBoardState(
        reportPeriod === "September 2026" ? "error" : "ready",
      )
    }, 650)
    return () => window.clearTimeout(timer)
  }, [reportPeriod, reportView])

  const filteredParishes = PARISHES.filter((p) => {
    const sq = parishSearch.toLowerCase()
    const matchS =
      !sq ||
      p.name.toLowerCase().includes(sq) ||
      p.municipality.toLowerCase().includes(sq) ||
      p.priest.toLowerCase().includes(sq)
    const matchF = parishFilter === "all" || p.reportStatus === parishFilter
    return matchS && matchF
  })

  const filteredRecords = RECORDS.filter((r) => {
    const sq = recordSearch.toLowerCase()
    const matchT = recordType === "All" || r.type === recordType
    const matchS =
      !sq ||
      r.name.toLowerCase().includes(sq) ||
      r.parish.toLowerCase().includes(sq)
    return matchT && matchS
  })

  const rStats = {
    submitted: reports.filter((r) => r.status === "submitted").length,
    pending: reports.filter((r) => r.status === "pending").length,
    late: reports.filter((r) => r.status === "late").length,
    returned: reports.filter((r) => r.status === "returned").length,
  }
  const financialStats = {
    submitted: financialReports.filter((r) => r.status === "submitted").length,
    pending: financialReports.filter((r) => r.status === "pending").length,
    late: financialReports.filter((r) => r.status === "late").length,
    returned: financialReports.filter((r) => r.status === "returned").length,
  }
  const expectedRemittances = financialReports.reduce(
    (sum, report) => sum + (report.amountRemitted || 0),
    0,
  )
  const receivedRemittances = financialReports
    .filter((report) => report.remittanceReceived)
    .reduce((sum, report) => sum + (report.amountRemitted || 0), 0)

  const totalParishioners = PARISHES.reduce((a, p) => a + p.parishioners, 0)
  const totalSacraments = reports
    .filter((r) => r.status === "submitted")
    .reduce((a, r) => a + (r.total || 0), 0)
  const unread = notifications.filter((n) => n.unread).length

  const NAV: { key: AdminTab; label: string; icon: string; alert?: boolean }[] = [
    { key: "overview", label: "Overview", icon: "overview" },
    {
      key: "parishes",
      label: "Parishes",
      icon: "church",
      alert: PARISHES.some((p) => p.reportStatus === "late"),
    },
    {
      key: "reports",
      label: "Reports",
      icon: "clipboard",
      alert: rStats.pending > 0 || rStats.late > 0,
    },
    { key: "statistics", label: "Statistics", icon: "statistics" },
    { key: "records", label: "Records", icon: "book" },
    { key: "users", label: "Users & Roles", icon: "users" },
    { key: "settings", label: "Settings", icon: "settings" },
  ]

  // ── REPORT ACTIONS ──
  const acceptReport = (id: string) =>
    setConfirm({
      title: "Accept Report",
      yes: "Accept",
      body: "This report will be marked as officially accepted and logged in the Archdiocesan registry.",
      action: () => {
        setReports(
          reports.map((r) =>
            r.id === id ? { ...r, status: "submitted" as const } : r,
          ),
        )
        pop("Report accepted ✓")
      },
    })
  const returnReport = (id: string) =>
    setConfirm({
      title: "Return for Correction",
      yes: "Return Report",
      danger: true,
      body: "The report will be sent back to the parish secretary for correction. They will need to resubmit.",
      action: () => {
        setReports(
          reports.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: "returned" as const,
                  note: "Returned by Archdiocesan admin for correction.",
                }
              : r,
          ),
        )
        pop("Report returned.")
      },
    })
  const sendReminder = (name: string) =>
    setConfirm({
      title: "Send Reminder",
      yes: "Send Now",
      body: `An email reminder will be sent to the designated contact at ${name} regarding their overdue or pending report submission.`,
      action: () => pop(`Reminder sent to ${name}. ✓`),
    })
  const acceptFinancial = (id: string) => {
    setFinancialReports((current) =>
      current.map((report) =>
        report.id === id ? { ...report, status: "submitted" as const } : report,
      ),
    )
    setSelectedFinancialReport((current) =>
      current?.id === id ? { ...current, status: "submitted" } : current,
    )
    pop("Financial report accepted.")
  }
  const markRemittance = (id: string) => {
    setFinancialReports((current) =>
      current.map((report) =>
        report.id === id ? { ...report, remittanceReceived: true } : report,
      ),
    )
    setSelectedFinancialReport((current) =>
      current?.id === id ? { ...current, remittanceReceived: true } : current,
    )
    pop("Remittance marked as received.")
  }
  const deactivateUser = (id: string) =>
    setConfirm({
      title: "Deactivate Account",
      yes: "Deactivate",
      danger: true,
      body: "This user will lose access to ACROSS immediately. They will be notified via email.",
      action: () => {
        setUsers(users.map((u) => (u.id === id ? { ...u, active: false } : u)))
        pop("User deactivated.")
      },
    })

  const kanbanCols: ReportStatus[] = [
    "submitted",
    "pending",
    "late",
    "returned",
  ]

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#EDE8DF",
        fontFamily: "'Source Sans 3', system-ui, sans-serif",
      }}
    >
      {/* ══════════════ HEADER ══════════════ */}
      <header
        className="flex-shrink-0 sticky top-0 z-40"
        style={{
          background: "#1C0808",
          boxShadow: "0 2px 16px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-center gap-6 px-6 py-3">
          {/* Identity */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <DiocesanSeal size={52} />
            <div
              className="text-white font-black text-2xl leading-tight tracking-tight"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              ACROSS
            </div>
          </div>

          {/* Gold divider */}
          <div
            className="w-px h-12 flex-shrink-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #C4971A, transparent)",
            }}
          />

          {/* Navigation — horizontal links */}
          <nav
            className="flex items-center gap-1 flex-1 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => setTab(n.key)}
                className="relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all"
                style={{
                  color: tab === n.key ? "#C4971A" : "rgba(255,255,255,0.55)",
                  background:
                    tab === n.key ? "rgba(196,151,26,0.12)" : "transparent",
                  border:
                    tab === n.key
                      ? "1px solid rgba(196,151,26,0.3)"
                      : "1px solid transparent",
                }}
              >
                <AdminIcon name={n.icon} size={15} />
                {n.label}
                {n.alert && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#EF4444" }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right utilities */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setTab("notifications")}
              title="Notifications"
              aria-label="Notifications"
              className="relative p-2 rounded-lg transition-colors"
              style={{
                color: "rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <AdminIcon name="bell" size={18} />
              {unread > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                  style={{ background: "#7B1C1C" }}
                >
                  {unread}
                </span>
              )}
            </button>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                style={{
                  background: "linear-gradient(135deg,#7B1C1C,#C4971A)",
                }}
              >
                AB
              </div>
              <div className="hidden sm:block">
                <div className="text-white text-xs font-semibold leading-tight">
                  Fr. Alvaro Bernardo
                </div>
                <div className="text-white/40 text-xs">Chancellor</div>
              </div>
            </div>
            <button
              onClick={() =>
                setConfirm({
                  title: "Sign Out",
                  yes: "Sign Out",
                  body: "You will be signed out of the ACROSS administrative portal.",
                  action: onLogout,
                })
              }
              className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors text-sm"
              title="Sign out"
              aria-label="Sign out"
            >
              <AdminIcon name="logout" size={17} />
            </button>
          </div>
        </div>

        {/* Section indicator strip */}
        <div
          className="h-0.5"
          style={{
            background: `linear-gradient(to right, #7B1C1C, #C4971A ${((NAV.findIndex((n) => n.key === tab) + 1) / NAV.length) * 100}%, transparent ${((NAV.findIndex((n) => n.key === tab) + 1) / NAV.length) * 100}%)`,
          }}
        />
      </header>

      {/* ══════════════ CONTENT ══════════════ */}
      <main className="flex-1 overflow-y-auto">
        <div key={tab} className="animate-fade-in">
          {/* ▓▓ OVERVIEW ▓▓ */}
          {tab === "overview" && (
            <div>
              {/* Diocese-wide KPI band */}
              <div
                className="px-4 sm:px-8 py-7"
                style={{
                  background: "#1C0808",
                  borderBottom: "1px solid #3B1010",
                }}
              >
                <p className="text-white/30 text-xs font-mono tracking-[0.2em] uppercase mb-5">
                  Diocese-wide · November 2026
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
                  {[
                    {
                      label: "Parishes",
                      val: PARISHES.length,
                      unit: "monitored",
                      icon: "church",
                    },
                    {
                      label: "Parishioners",
                      val: totalParishioners.toLocaleString(),
                      unit: "registered",
                      icon: "users",
                    },
                    {
                      label: "Sacraments",
                      val: totalSacraments,
                      unit: "from submissions",
                      icon: "book",
                    },
                    {
                      label: "Compliance",
                      val: `${rStats.submitted}/${reports.length}`,
                      unit: "reports submitted",
                      icon: "clipboard",
                    },
                    {
                      label: "Need Attention",
                      val: rStats.pending + rStats.late,
                      unit: `${rStats.late} late`,
                      icon: "bell",
                      urgent: true,
                    },
                    {
                      label: "Remittances",
                      val: `₱${(receivedRemittances / 1000).toFixed(0)}K`,
                      unit: `of ₱${(expectedRemittances / 1000).toFixed(0)}K expected`,
                      icon: "statistics",
                    },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <AdminIcon
                        name={metric.icon}
                        size={15}
                        className="text-white/25 mb-2"
                      />
                      <div
                        className="text-3xl sm:text-4xl font-black tracking-tighter leading-none"
                        style={{
                          color:
                            metric.urgent && rStats.pending + rStats.late > 0
                              ? "#EF4444"
                              : "#C4971A",
                          fontFamily: "Fraunces, Georgia, serif",
                        }}
                      >
                        {metric.val}
                      </div>
                      <div className="text-white/70 text-sm font-semibold mt-2">
                        {metric.label}
                      </div>
                      <div className="text-white/30 text-xs mt-0.5">
                        {metric.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-8 space-y-6">
                {/* Priority banner — the vital operational 20% */}
                <section
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "#FFF8F5",
                    border: "2px solid #B91C1C",
                    boxShadow: "0 8px 24px rgba(127,29,29,.1)",
                  }}
                  aria-labelledby="priority-heading"
                >
                  <div
                    className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{ background: "#2A0B0B" }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          background: "rgba(239,68,68,.15)",
                          color: "#FCA5A5",
                        }}
                      >
                        <AdminIcon name="bell" size={18} />
                      </span>
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-300">
                          Priority desk
                        </p>
                        <h2
                          id="priority-heading"
                          className="text-xl font-black text-white"
                          style={{ fontFamily: "Fraunces" }}
                        >
                          Requires Action Today
                        </h2>
                      </div>
                    </div>
                    <span
                      className="self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{ background: "#FEE2E2", color: "#7F1D1D" }}
                    >
                      {PARISHES.filter(
                        (parish) => parish.reportStatus === "late",
                      ).length +
                        financialReports.filter(
                          (report) => report.status === "returned",
                        ).length}{" "}
                      critical issues
                    </span>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-3 p-4 sm:p-5">
                    {PARISHES.filter(
                      (parish) => parish.reportStatus === "late",
                    ).map((parish) => (
                      <article
                        key={parish.id}
                        className="rounded-xl bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                        style={{ border: "1px solid #FCA5A5" }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "#FEE2E2", color: "#B91C1C" }}
                        >
                          <AdminIcon name="clipboard" size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-700">
                              Overdue report
                            </span>
                            <span className="text-[10px] text-red-500">
                              18 days late
                            </span>
                          </div>
                          <h3
                            className="font-black text-gray-900 mt-1"
                            style={{ fontFamily: "Fraunces" }}
                          >
                            {parish.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            October sacramental report has not been submitted.
                          </p>
                        </div>
                        <button
                          onClick={() => sendReminder(parish.name)}
                          className="min-h-11 px-4 rounded-xl text-xs font-bold text-white flex-shrink-0"
                          style={{ background: "#7B1C1C" }}
                        >
                          Send urgent reminder
                        </button>
                      </article>
                    ))}
                    {financialReports
                      .filter((report) => report.status === "returned")
                      .map((report) => (
                        <article
                          key={report.id}
                          className="rounded-xl bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                          style={{ border: "1px solid #F59E0B" }}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-black"
                            style={{ background: "#FEF3C7", color: "#92400E" }}
                          >
                            ₱
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                                Balance discrepancy
                              </span>
                              <span className="text-[10px] text-amber-600">
                                Returned for correction
                              </span>
                            </div>
                            <h3
                              className="font-black text-gray-900 mt-1"
                              style={{ fontFamily: "Fraunces" }}
                            >
                              {report.parishName}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                              {report.note}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setReportView("financial")
                              setSelectedFinancialReport(report)
                              setTab("reports")
                            }}
                            className="min-h-11 px-4 rounded-xl text-xs font-bold flex-shrink-0"
                            style={{
                              background: "#FEF3C7",
                              color: "#78350F",
                              border: "1px solid #F59E0B",
                            }}
                          >
                            Review discrepancy
                          </button>
                        </article>
                      ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Parish status remains scannable, but secondary to priorities */}
                  <section
                    className="xl:col-span-2 rounded-2xl p-5 sm:p-6"
                    style={{
                      background: "#F8F4EE",
                      border: "1px solid #DDD0C4",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
                          Network health
                        </p>
                        <h2
                          className="text-xl font-black text-gray-800"
                          style={{ fontFamily: "Fraunces" }}
                        >
                          Parish Status
                        </h2>
                      </div>
                      <button
                        onClick={() => setTab("parishes")}
                        className="text-sm font-bold hover:underline"
                        style={{ color: "#7B1C1C" }}
                      >
                        All parishes →
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {PARISHES.map((parish) => (
                        <button
                          key={parish.id}
                          onClick={() => setParishPanel(parish)}
                          className="relative rounded-xl p-3 text-left transition-all hover:-translate-y-0.5 overflow-hidden"
                          style={{
                            background: "white",
                            border: `1px solid ${SC[parish.reportStatus].dot}55`,
                          }}
                        >
                          <span
                            className="absolute inset-x-0 top-0 h-1"
                            style={{ background: SC[parish.reportStatus].dot }}
                          />
                          <span className="block text-[10px] font-mono text-gray-400 mt-1">
                            {parish.code}
                          </span>
                          <strong className="block text-xs text-gray-800 leading-tight mt-1 min-h-8">
                            {parish.shortName}
                          </strong>
                          <span
                            className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold"
                            style={{ color: SC[parish.reportStatus].dot }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: SC[parish.reportStatus].dot,
                              }}
                            />
                            {SC[parish.reportStatus].label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <div className="space-y-5">
                    <section
                      className="rounded-2xl p-5"
                      style={{
                        background: "#F8F4EE",
                        border: "1px solid #DDD0C4",
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
                            November 2026
                          </p>
                          <h2
                            className="font-black text-gray-800"
                            style={{ fontFamily: "Fraunces" }}
                          >
                            Compliance Snapshot
                          </h2>
                        </div>
                        <button
                          onClick={() => setTab("reports")}
                          className="text-xs font-bold"
                          style={{ color: "#7B1C1C" }}
                        >
                          Reports →
                        </button>
                      </div>
                      {[
                        {
                          label: "Sacramental reports",
                          count: rStats.submitted,
                          total: reports.length,
                          color: "#15803D",
                        },
                        {
                          label: "Financial reports",
                          count: financialStats.submitted,
                          total: financialReports.length,
                          color: "#C4971A",
                        },
                      ].map((item) => (
                        <div key={item.label} className="mb-4 last:mb-0">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-semibold text-gray-600">
                              {item.label}
                            </span>
                            <strong style={{ color: item.color }}>
                              {item.count}/{item.total}
                            </strong>
                          </div>
                          <div
                            className="h-2 rounded-full overflow-hidden"
                            style={{ background: "#E7DED4" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(item.count / item.total) * 100}%`,
                                background: item.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <div
                        className="mt-5 pt-4 border-t flex items-end justify-between gap-3"
                        style={{ borderColor: "#DDD0C4" }}
                      >
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Remittances received
                          </p>
                          <p
                            className="text-lg font-black text-gray-800"
                            style={{ fontFamily: "Fraunces" }}
                          >
                            ₱{receivedRemittances.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 text-right">
                          of ₱{expectedRemittances.toLocaleString()} expected
                        </p>
                      </div>
                    </section>

                    <button
                      onClick={() => {
                        setStatisticsParish("All Parishes")
                        setTab("statistics")
                      }}
                      className="w-full rounded-2xl p-5 text-left transition-all hover:-translate-y-0.5"
                      style={{
                        background: "#F8F4EE",
                        border: "1px solid #DDD0C4",
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2
                          className="font-black text-gray-800"
                          style={{ fontFamily: "Fraunces" }}
                        >
                          Sacraments YTD
                        </h2>
                        <span
                          className="text-xs font-bold"
                          style={{ color: "#7B1C1C" }}
                        >
                          Statistics →
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            label: "Baptisms",
                            val: PARISHES.reduce(
                              (sum, parish) => sum + parish.sacraments.baptisms,
                              0,
                            ),
                            color: "#2563EB",
                          },
                          {
                            label: "Matrimony",
                            val: PARISHES.reduce(
                              (sum, parish) =>
                                sum + parish.sacraments.matrimony,
                              0,
                            ),
                            color: "#BE185D",
                          },
                          {
                            label: "Confirmations",
                            val: PARISHES.reduce(
                              (sum, parish) =>
                                sum + parish.sacraments.confirmations,
                              0,
                            ),
                            color: "#7C3AED",
                          },
                          {
                            label: "Burials",
                            val: PARISHES.reduce(
                              (sum, parish) => sum + parish.sacraments.burials,
                              0,
                            ),
                            color: "#374151",
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="rounded-xl p-3 bg-white"
                            style={{ border: "1px solid #E7DED4" }}
                          >
                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                              {item.label}
                            </p>
                            <p
                              className="text-xl font-black mt-1"
                              style={{
                                color: item.color,
                                fontFamily: "Fraunces",
                              }}
                            >
                              {item.val}
                            </p>
                          </div>
                        ))}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Consolidated secondary feeds */}
                <section
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "#F8F4EE", border: "1px solid #DDD0C4" }}
                >
                  <div
                    className="px-5 sm:px-6 pt-5 border-b"
                    style={{ borderColor: "#DDD0C4" }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                      <div className="pb-4">
                        <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
                          Secondary operations
                        </p>
                        <h2
                          className="text-xl font-black text-gray-800"
                          style={{ fontFamily: "Fraunces" }}
                        >
                          Operations Desk
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Activity, dates, and updates—one feed at a time.
                        </p>
                      </div>
                      <div
                        className="flex gap-1 overflow-x-auto"
                        role="tablist"
                        aria-label="Operations desk views"
                      >
                        {([
                          {
                            key: "activity",
                            label: "Recent Activity",
                            count: 6,
                          },
                          {
                            key: "calendar",
                            label: "Calendar",
                            count: DIOCESAN_EVENTS.length,
                          },
                          {
                            key: "notifications",
                            label: "Notifications",
                            count: unread,
                          },
                        ] as const).map((panel) => (
                          <button
                            key={panel.key}
                            role="tab"
                            aria-selected={overviewPanel === panel.key}
                            onClick={() => setOverviewPanel(panel.key)}
                            className="min-h-11 px-4 rounded-t-xl text-xs font-bold whitespace-nowrap transition-colors"
                            style={{
                              background:
                                overviewPanel === panel.key
                                  ? "#1C0808"
                                  : "transparent",
                              color:
                                overviewPanel === panel.key
                                  ? "#C4971A"
                                  : "#6B5647",
                            }}
                          >
                            {panel.label}{" "}
                            <span className="ml-1 opacity-60">
                              {panel.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 min-h-[320px]">
                    {overviewPanel === "activity" && (
                      <div className="grid md:grid-cols-2 gap-3 animate-fade-in">
                        {[
                          {
                            dot: "#2563EB",
                            text: "Finance report returned — San Nicolas Parish · ₱3,000 balance discrepancy",
                            time: "45 min ago",
                          },
                          {
                            dot: "#15803D",
                            text: "Metropolitan Cathedral remittance received · ₱126,840",
                            time: "1 hour ago",
                          },
                          {
                            dot: "#15803D",
                            text: "Mater Salutis submitted November 2026 report · 15 sacraments",
                            time: "2 days ago",
                          },
                          {
                            dot: "#2563EB",
                            text: "San Nicolas Parish report returned — total count discrepancy",
                            time: "3 days ago",
                          },
                          {
                            dot: "#DC2626",
                            text: "San Francisco Parish October report overdue — 18 days late",
                            time: "4 days ago",
                          },
                          {
                            dot: "#15803D",
                            text: "Metropolitan Cathedral accepted · November report · 77 sacraments",
                            time: "5 days ago",
                          },
                        ].map((activity) => (
                          <div
                            key={activity.text}
                            className="flex items-start gap-3 rounded-xl bg-white p-4"
                            style={{ border: "1px solid #E7DED4" }}
                          >
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                              style={{ background: activity.dot }}
                            />
                            <div className="min-w-0">
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {activity.text}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-2 font-mono">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {overviewPanel === "calendar" && (
                      <div className="animate-fade-in">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3
                              className="font-black text-gray-800"
                              style={{ fontFamily: "Fraunces" }}
                            >
                              September 2026
                            </h3>
                            <p className="text-xs text-gray-500">
                              All parish and archdiocesan events
                            </p>
                          </div>
                          <span
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "#1C0808", color: "#C4971A" }}
                          >
                            <AdminIcon name="calendar" size={18} />
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          {DIOCESAN_EVENTS.map((event) => (
                            <div
                              key={`${event.date}-${event.title}`}
                              className="flex items-start gap-3 rounded-xl bg-white p-3"
                              style={{ border: "1px solid #E7DED4" }}
                            >
                              <div className="w-11 text-center flex-shrink-0">
                                <p className="text-[9px] font-bold uppercase text-gray-400">
                                  Sep
                                </p>
                                <p
                                  className="text-xl font-black leading-none"
                                  style={{
                                    color: "#7B1C1C",
                                    fontFamily: "Fraunces",
                                  }}
                                >
                                  {event.day}
                                </p>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-bold text-gray-800">
                                    {event.title}
                                  </p>
                                  <span
                                    className="text-[9px] font-bold uppercase tracking-wide whitespace-nowrap"
                                    style={{ color: "#9A7B1A" }}
                                  >
                                    {event.type}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-1">
                                  {event.time} · {event.parish}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {overviewPanel === "notifications" && (
                      <div className="animate-fade-in">
                        <div className="grid md:grid-cols-2 gap-3">
                          {notifications.slice(0, 6).map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() =>
                                setNotifications(
                                  notifications.map((item) =>
                                    item.id === notification.id
                                      ? { ...item, unread: false }
                                      : item,
                                  ),
                                )
                              }
                              className="w-full text-left rounded-xl bg-white p-4"
                              style={{
                                border: notification.unread
                                  ? "1px solid #FCA5A5"
                                  : "1px solid #E7DED4",
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <AdminIcon
                                  name={
                                    notification.urgency === "high"
                                      ? "clipboard"
                                      : "bell"
                                  }
                                  size={15}
                                  className={
                                    notification.unread
                                      ? "text-red-800 mt-0.5"
                                      : "text-gray-400 mt-0.5"
                                  }
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-gray-800">
                                    {notification.title}
                                  </p>
                                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                                    {notification.body}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-2">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setTab("notifications")}
                          className="min-h-11 w-full mt-4 rounded-xl text-xs font-bold"
                          style={{
                            border: "1px solid #DDD0C4",
                            color: "#7B1C1C",
                            background: "white",
                          }}
                        >
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ▓▓ PARISHES ▓▓ */}
          {tab === "parishes" && (
            <div className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
                <div>
                  <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
                    Diocese Directory
                  </p>
                  <h1
                    className="text-4xl font-black text-gray-900"
                    style={{ fontFamily: "Fraunces, Georgia, serif" }}
                  >
                    Parishes
                  </h1>
                  <p className="text-gray-500 mt-1">
                    {filteredParishes.length} of {PARISHES.length} showing
                  </p>
                </div>
              </div>

              {/* Search + filter */}
              <div className="flex flex-wrap gap-3 mb-8 items-center">
                <div className="relative flex-1 min-w-64">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    🔍
                  </span>
                  <input
                    value={parishSearch}
                    onChange={(e) => setParishSearch(e.target.value)}
                    placeholder="Search parish, municipality, priest…"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium"
                    style={{
                      background: "#F8F4EE",
                      border: "1.5px solid #DDD0C4",
                      color: "#1C0808",
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  {([
                    "all",
                    "submitted",
                    "pending",
                    "late",
                    "returned",
                  ] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setParishFilter(f)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                      style={{
                        background: parishFilter === f ? "#1C0808" : "#F8F4EE",
                        color: parishFilter === f ? "#C4971A" : "#6B5647",
                        border:
                          parishFilter === f
                            ? "1.5px solid #3B1010"
                            : "1.5px solid #DDD0C4",
                      }}
                    >
                      {f === "all" ? "All" : SC[f].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newspaper mosaic layout */}
              <div className="space-y-5">
                {/* Cathedral — Feature hero card */}
                {filteredParishes
                  .filter((p) => p.category === "cathedral")
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setParishPanel(p)}
                      className="w-full text-left rounded-3xl overflow-hidden transition-all hover:-translate-y-1 group"
                      style={{
                        background: "#1C0808",
                        border: "2px solid #3B1010",
                        boxShadow: "0 8px 32px rgba(28,8,8,0.3)",
                      }}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-36 sm:h-auto relative overflow-hidden flex-shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1445905595283-21f8ae8a33d2?w=400&h=300&fit=crop&auto=format"
                            alt={p.name}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity"
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(to right, transparent, #1C0808)",
                            }}
                          />
                        </div>
                        <div className="flex-1 p-7">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-white/30 text-xs font-mono tracking-widest">
                                {p.code} · CATHEDRAL
                              </span>
                              <h3
                                className="text-white text-2xl font-black mt-1 mb-1 group-hover:text-yellow-200 transition-colors"
                                style={{ fontFamily: "Fraunces" }}
                              >
                                {p.name}
                              </h3>
                              <p className="text-white/50 text-sm">
                                {p.barangay}, {p.municipality} · {p.priest}
                              </p>
                            </div>
                            <ParishCardAffordance
                              status={p.reportStatus}
                              dark
                            />
                          </div>
                          <div className="flex flex-col lg:flex-row lg:items-end gap-5 lg:gap-8 mt-5">
                            <div>
                              <div
                                className="text-3xl font-black text-yellow-400"
                                style={{ fontFamily: "Fraunces" }}
                              >
                                {p.parishioners.toLocaleString()}
                              </div>
                              <div className="text-white/40 text-xs mt-0.5">
                                parishioners
                              </div>
                            </div>
                            <div>
                              <div
                                className="text-lg font-black"
                                style={{
                                  color: "#C4971A",
                                  fontFamily: "Fraunces",
                                }}
                              >
                                Est. {p.established}
                              </div>
                              <div className="text-white/40 text-xs mt-0.5">
                                founded
                              </div>
                            </div>
                            <div className="lg:ml-auto">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
                                Sacraments YTD
                              </div>
                              <SacramentSummary parish={p} dark />
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}

                {/* Shrine row */}
                {filteredParishes
                  .filter((p) => p.category === "shrine")
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setParishPanel(p)}
                      className="w-full text-left rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 group"
                      style={{
                        background: "#F8F4EE",
                        border: `3px solid ${SC[p.reportStatus].dot}33`,
                        borderLeftWidth: 6,
                        borderLeftColor: SC[p.reportStatus].dot,
                      }}
                    >
                      <div className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-1">
                            <div className="text-xs font-mono text-gray-400 mb-0.5">
                              {p.code} · SHRINE
                            </div>
                            <h3
                              className="text-xl font-black text-gray-900 group-hover:text-[#7B1C1C] transition-colors"
                              style={{ fontFamily: "Fraunces" }}
                            >
                              {p.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {p.barangay}, {p.municipality} · {p.priest}
                            </p>
                          </div>
                          <ParishCardAffordance status={p.reportStatus} />
                        </div>
                        <div
                          className="mt-4 pt-4 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8 border-t"
                          style={{ borderColor: "#DDD0C4" }}
                        >
                          <div>
                            <div
                              className="text-2xl font-black"
                              style={{
                                color: "#7B1C1C",
                                fontFamily: "Fraunces",
                              }}
                            >
                              {p.parishioners.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              parishioners
                            </div>
                          </div>
                          <div className="sm:ml-auto">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                              Sacraments YTD
                            </div>
                            <SacramentSummary parish={p} />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}

                {/* Regular parishes grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredParishes
                    .filter((p) => p.category === "parish")
                    .map((p) => (
                      <div
                        key={p.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setParishPanel(p)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            setParishPanel(p)
                          }
                        }}
                        className="text-left rounded-2xl p-5 transition-all hover:-translate-y-0.5 group cursor-pointer"
                        style={{
                          background: "#F8F4EE",
                          border: "1.5px solid #DDD0C4",
                          borderTop: `4px solid ${SC[p.reportStatus].dot}`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className="text-xs font-mono text-gray-400">
                            {p.code}
                          </span>
                          <ParishCardAffordance status={p.reportStatus} />
                        </div>
                        <h3
                          className="font-black text-gray-800 text-base group-hover:text-[#7B1C1C] transition-colors leading-snug mb-1"
                          style={{ fontFamily: "Fraunces" }}
                        >
                          {p.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">
                          {p.barangay}, {p.municipality}
                        </p>
                        <p className="text-xs text-gray-400 truncate mb-4">
                          {p.priest}
                        </p>
                        <div
                          className="flex items-end justify-between border-t pt-3 mb-3"
                          style={{ borderColor: "#DDD0C4" }}
                        >
                          <div>
                            <div
                              className="text-xl font-black"
                              style={{
                                color: "#7B1C1C",
                                fontFamily: "Fraunces",
                              }}
                            >
                              {p.parishioners.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              parishioners
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                          Sacraments YTD
                        </div>
                        <SacramentSummary parish={p} />
                        {(p.reportStatus === "pending" ||
                          p.reportStatus === "late") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              sendReminder(p.name)
                            }}
                            className="w-full mt-3 py-2 rounded-xl text-xs font-bold transition-colors"
                            style={{
                              background: SC[p.reportStatus].pill,
                              color: SC[p.reportStatus].text,
                            }}
                          >
                            Send Reminder
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ▓▓ REPORTS — KANBAN ▓▓ */}
          {tab === "reports" &&
            (selectedFinancialReport ? (
              <FinancialReportDetail
                report={selectedFinancialReport}
                onBack={() => setSelectedFinancialReport(null)}
                onAccept={() => acceptFinancial(selectedFinancialReport.id)}
                onReturn={() =>
                  setReturnFinancialReport(selectedFinancialReport)
                }
                onRemittance={() => markRemittance(selectedFinancialReport.id)}
              />
            ) : (
              <div className="p-4 sm:p-8">
                <div className="mb-6">
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                    <div>
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
                        Archdiocesan Monitoring
                      </p>
                      <h1
                        className="text-3xl sm:text-4xl font-black text-gray-900"
                        style={{ fontFamily: "Fraunces, Georgia, serif" }}
                      >
                        Reports Board
                      </h1>
                      <p className="text-gray-500 mt-1">
                        {reportView === "sacramental"
                          ? "Monthly sacramental reporting"
                          : "Parish financial liquidation and remittance monitoring"}{" "}
                        — {reportPeriod}
                      </p>
                    </div>
                    <span
                      className="self-start lg:self-auto px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{
                        background: "#1C0808",
                        color: "#C4971A",
                        border: "1px solid #3B1010",
                      }}
                    >
                      Chancellor · Full Access
                    </span>
                  </div>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center">
                    <div
                      className="inline-flex p-1 rounded-xl self-start"
                      style={{
                        background: "#F8F4EE",
                        border: "1.5px solid #DDD0C4",
                      }}
                    >
                      {(["sacramental", "financial"] as const).map((view) => (
                        <button
                          key={view}
                          onClick={() => {
                            setReportView(view)
                            setSelectedFinancialReport(null)
                          }}
                          className="min-h-11 px-4 rounded-lg text-xs font-black transition-all"
                          style={{
                            background:
                              reportView === view ? "#1C0808" : "transparent",
                            color: reportView === view ? "#C4971A" : "#6B5647",
                          }}
                        >
                          {view === "sacramental"
                            ? "Sacramental"
                            : "Financial Liquidation"}
                        </button>
                      ))}
                    </div>
                    <select
                      value={reportPeriod}
                      onChange={(e) => setReportPeriod(e.target.value)}
                      className="min-h-11 px-4 rounded-xl text-sm font-semibold"
                      style={{
                        background: "#F8F4EE",
                        border: "1.5px solid #DDD0C4",
                        color: "#6B5647",
                      }}
                    >
                      <option>November 2026</option>
                      <option>October 2026</option>
                      <option>September 2026</option>
                    </select>
                    {reportView === "financial" && (
                      <p className="text-xs text-gray-400 sm:ml-auto">
                        Finance Officer: review · Archdiocesan Staff: view only
                        · Chancellor: full access
                      </p>
                    )}
                  </div>
                </div>

                {reportView === "sacramental" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
                    {kanbanCols.map((colStatus) => {
                      const abbreviatedPeriod = reportPeriod
                        .replace("November", "Nov")
                        .replace("October", "Oct")
                        .replace("September", "Sep")
                      const colReports = reports.filter(
                        (r) =>
                          r.status === colStatus &&
                          r.period === abbreviatedPeriod,
                      )
                      const cfg = SC[colStatus]
                      return (
                        <div
                          key={colStatus}
                          className="rounded-2xl overflow-hidden"
                          style={{
                            background: cfg.colBg,
                            border: `1.5px solid ${cfg.dot}33`,
                          }}
                        >
                          <div
                            className="px-4 py-3.5 flex items-center gap-2 border-b"
                            style={{
                              background: cfg.dot,
                              borderColor: `${cfg.dot}33`,
                            }}
                          >
                            <span className="text-white text-sm font-black uppercase tracking-wider flex-1">
                              {cfg.label}
                            </span>
                            <span
                              className="text-white/90 text-xl font-black"
                              style={{ fontFamily: "Fraunces" }}
                            >
                              {colReports.length}
                            </span>
                          </div>
                          <div className="p-3 space-y-3">
                            {colReports.map((rep) => (
                              <div
                                key={rep.id}
                                className="rounded-xl p-4 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                style={{ border: `1px solid ${cfg.dot}22` }}
                              >
                                <div className="mb-2">
                                  <p
                                    className="font-black text-sm text-gray-800 leading-tight"
                                    style={{ fontFamily: "Fraunces" }}
                                  >
                                    {rep.parishName}
                                  </p>
                                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                                    {rep.id}
                                  </p>
                                </div>
                                <div className="text-xs text-gray-500 mb-3">
                                  <span className="font-semibold">Period:</span>{" "}
                                  {rep.period}
                                  <br />
                                  <span className="font-semibold">Due:</span>{" "}
                                  {rep.dueDate}
                                </div>
                                {rep.total !== null && (
                                  <div className="grid grid-cols-2 gap-1 mb-3">
                                    {[
                                      ["💧", rep.baptisms],
                                      ["💍", rep.matrimony],
                                      ["🕊️", rep.confirmations],
                                      ["⛪", rep.burials],
                                    ].map(([icon, val], i) => (
                                      <div
                                        key={i}
                                        className="text-xs flex items-center gap-1 rounded-lg px-2 py-1"
                                        style={{ background: "#F8F4EE" }}
                                      >
                                        <span>{icon}</span>
                                        <span className="font-semibold">
                                          {val}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {rep.total !== null && (
                                  <div
                                    className="text-center rounded-lg py-1.5 mb-3"
                                    style={{ background: "#1C0808" }}
                                  >
                                    <span
                                      className="text-xs font-bold"
                                      style={{ color: "#C4971A" }}
                                    >
                                      Total:{" "}
                                    </span>
                                    <span
                                      className="text-sm font-black text-white"
                                      style={{ fontFamily: "Fraunces" }}
                                    >
                                      {rep.total}
                                    </span>
                                  </div>
                                )}
                                {rep.submittedDate && (
                                  <p className="text-xs text-green-600 font-semibold mb-2">
                                    ✓ {rep.submittedDate}
                                  </p>
                                )}
                                {rep.submittedBy && (
                                  <p className="text-xs text-gray-400 mb-3 truncate">
                                    By: {rep.submittedBy}
                                  </p>
                                )}
                                {rep.note && (
                                  <p
                                    className="text-xs rounded-lg p-2 mb-3"
                                    style={{
                                      background: "#DBEAFE",
                                      color: "#1E3A8A",
                                    }}
                                  >
                                    {rep.note}
                                  </p>
                                )}
                                <div className="flex flex-col gap-1.5">
                                  {colStatus === "submitted" &&
                                    rep.total !== null && (
                                      <>
                                        <button
                                          onClick={() => acceptReport(rep.id)}
                                          className="min-h-11 w-full rounded-lg text-xs font-bold text-white"
                                          style={{ background: "#15803D" }}
                                        >
                                          ✓ Accept Report
                                        </button>
                                        <button
                                          onClick={() => returnReport(rep.id)}
                                          className="min-h-11 w-full rounded-lg text-xs font-bold"
                                          style={{
                                            background: "#FEE2E2",
                                            color: "#7F1D1D",
                                          }}
                                        >
                                          ↩ Return
                                        </button>
                                      </>
                                    )}
                                  {(colStatus === "pending" ||
                                    colStatus === "late") && (
                                    <button
                                      onClick={() =>
                                        sendReminder(rep.parishName)
                                      }
                                      className="min-h-11 w-full rounded-lg text-xs font-bold"
                                      style={{
                                        background: cfg.pill,
                                        color: cfg.text,
                                      }}
                                    >
                                      📧 Send Reminder
                                    </button>
                                  )}
                                  {colStatus === "returned" && (
                                    <p className="text-xs text-center text-gray-400 py-1">
                                      Awaiting resubmission
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {colReports.length === 0 && (
                              <div className="rounded-xl p-6 text-center bg-white/60">
                                <p className="text-xs text-gray-400">
                                  No reports
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : financialBoardState === "loading" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {kanbanCols.map((status) => (
                      <div key={status} className="h-72 rounded-2xl shimmer" />
                    ))}
                  </div>
                ) : financialBoardState === "error" ? (
                  <div
                    className="rounded-2xl p-10 text-center"
                    style={{
                      background: "#F8F4EE",
                      border: "1.5px solid #FCA5A5",
                    }}
                  >
                    <AdminIcon
                      name="clipboard"
                      size={30}
                      className="mx-auto text-red-700 mb-3"
                    />
                    <h2
                      className="font-black text-gray-800"
                      style={{ fontFamily: "Fraunces" }}
                    >
                      Financial reports could not be loaded
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                      The September archive is temporarily unavailable.
                    </p>
                    <button
                      onClick={() => {
                        setFinancialBoardState("loading")
                        window.setTimeout(
                          () => setFinancialBoardState("ready"),
                          700,
                        )
                      }}
                      className="min-h-11 px-5 rounded-xl text-sm font-bold text-white"
                      style={{ background: "#7B1C1C" }}
                    >
                      Retry Archive
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
                    {kanbanCols.map((colStatus) => {
                      const cfg = SC[colStatus]
                      const colReports = financialReports.filter(
                        (report) =>
                          report.status === colStatus &&
                          report.period === reportPeriod,
                      )
                      return (
                        <div
                          key={colStatus}
                          className="rounded-2xl overflow-hidden"
                          style={{
                            background: cfg.colBg,
                            border: `1.5px solid ${cfg.dot}33`,
                          }}
                        >
                          <div
                            className="px-4 py-3.5 flex items-center gap-2 border-b"
                            style={{
                              background: cfg.dot,
                              borderColor: `${cfg.dot}33`,
                            }}
                          >
                            <span className="text-white text-sm font-black uppercase tracking-wider flex-1">
                              {cfg.label}
                            </span>
                            <span
                              className="text-white/90 text-xl font-black"
                              style={{ fontFamily: "Fraunces" }}
                            >
                              {colReports.length}
                            </span>
                          </div>
                          <div className="p-3 space-y-3">
                            {colReports.map((report) => (
                              <div
                                key={report.id}
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                  setSelectedFinancialReport(report)
                                }
                                className="rounded-xl p-4 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                                style={{ border: `1px solid ${cfg.dot}22` }}
                              >
                                <p
                                  className="font-black text-sm text-gray-800 leading-tight"
                                  style={{ fontFamily: "Fraunces" }}
                                >
                                  {report.parishName}
                                </p>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">
                                  {report.id}
                                </p>
                                <div className="text-xs text-gray-500 mt-3 space-y-1">
                                  <p>
                                    <strong>Period:</strong> {report.period}
                                  </p>
                                  <p>
                                    <strong>Due:</strong> {report.dueDate}
                                  </p>
                                </div>
                                {report.totalCollections !== null && (
                                  <div
                                    className="mt-3 space-y-1.5 rounded-lg p-2.5"
                                    style={{ background: "#F8F4EE" }}
                                  >
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-500">
                                        Collections
                                      </span>
                                      <strong>
                                        ₱
                                        {report.totalCollections.toLocaleString()}
                                      </strong>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-500">
                                        Expenses
                                      </span>
                                      <strong>
                                        ₱
                                        {report.totalExpenses?.toLocaleString()}
                                      </strong>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-500">
                                        Remitted
                                      </span>
                                      <strong style={{ color: "#7B1C1C" }}>
                                        ₱
                                        {report.amountRemitted?.toLocaleString()}
                                      </strong>
                                    </div>
                                  </div>
                                )}
                                {report.submittedDate && (
                                  <p className="text-xs text-green-700 font-semibold mt-3">
                                    Submitted {report.submittedDate}
                                  </p>
                                )}
                                {report.submittedBy && (
                                  <p className="text-xs text-gray-400 mt-1 truncate">
                                    By: {report.submittedBy}
                                  </p>
                                )}
                                {report.note && (
                                  <p
                                    className="text-xs rounded-lg p-2 mt-3"
                                    style={{
                                      background: "#DBEAFE",
                                      color: "#1E3A8A",
                                    }}
                                  >
                                    {report.note}
                                  </p>
                                )}
                                <div className="mt-3 flex flex-col gap-1.5">
                                  {colStatus === "submitted" && (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          acceptFinancial(report.id)
                                        }}
                                        className="min-h-11 rounded-lg text-xs font-bold text-white"
                                        style={{ background: "#15803D" }}
                                      >
                                        Accept Report
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setReturnFinancialReport(report)
                                        }}
                                        className="min-h-11 rounded-lg text-xs font-bold"
                                        style={{
                                          background: "#FEE2E2",
                                          color: "#7F1D1D",
                                        }}
                                      >
                                        Return
                                      </button>
                                    </>
                                  )}
                                  {(colStatus === "pending" ||
                                    colStatus === "late") && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        sendReminder(report.parishName)
                                      }}
                                      className="min-h-11 rounded-lg text-xs font-bold"
                                      style={{
                                        background: cfg.pill,
                                        color: cfg.text,
                                      }}
                                    >
                                      Send Reminder
                                    </button>
                                  )}
                                  {colStatus === "returned" && (
                                    <p className="text-xs text-center text-gray-400 py-1">
                                      Awaiting corrected submission
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {colReports.length === 0 && (
                              <div className="rounded-xl p-6 text-center bg-white/60">
                                <p className="text-xs text-gray-400">
                                  No financial reports for this period
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}

          {tab === "statistics" && (
            <StatisticsPage
              initialParish={statisticsParish}
              onParishChange={setStatisticsParish}
            />
          )}

          {/* ▓▓ RECORDS — REGISTRY LEDGER ▓▓ */}
          {tab === "records" && (
            <div className="p-8">
              <div className="mb-8">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
                  Central Registry
                </p>
                <h1
                  className="text-4xl font-black text-gray-900"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  Sacramental Records
                </h1>
                <p className="text-gray-500 mt-1">
                  Centralized registry of sacramental transactions — Diocese of
                  Caceres
                </p>
              </div>

              {/* YTD totals */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Baptisms",
                    val: PARISHES.reduce(
                      (a, p) => a + p.sacraments.baptisms,
                      0,
                    ),
                    color: "#2563EB",
                    icon: "💧",
                  },
                  {
                    label: "Matrimony",
                    val: PARISHES.reduce(
                      (a, p) => a + p.sacraments.matrimony,
                      0,
                    ),
                    color: "#BE185D",
                    icon: "💍",
                  },
                  {
                    label: "Confirmations",
                    val: PARISHES.reduce(
                      (a, p) => a + p.sacraments.confirmations,
                      0,
                    ),
                    color: "#7C3AED",
                    icon: "🕊️",
                  },
                  {
                    label: "Burials",
                    val: PARISHES.reduce((a, p) => a + p.sacraments.burials, 0),
                    color: "#374151",
                    icon: "⛪",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-5 text-center"
                    style={{
                      background: "#F8F4EE",
                      border: "1.5px solid #DDD0C4",
                    }}
                  >
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <div
                      className="text-4xl font-black"
                      style={{ color: s.color, fontFamily: "Fraunces" }}
                    >
                      {s.val}
                    </div>
                    <div className="text-xs text-gray-500 font-semibold mt-1">
                      {s.label} YTD
                    </div>
                  </div>
                ))}
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative flex-1 min-w-56">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    🔍
                  </span>
                  <input
                    value={recordSearch}
                    onChange={(e) => setRecordSearch(e.target.value)}
                    placeholder="Search name or parish…"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    style={{
                      background: "#F8F4EE",
                      border: "1.5px solid #DDD0C4",
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  {([
                    "All",
                    "Baptism",
                    "Matrimony",
                    "Confirmation",
                    "Burial",
                  ] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setRecordType(t)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                      style={{
                        background: recordType === t ? "#1C0808" : "#F8F4EE",
                        color: recordType === t ? "#C4971A" : "#6B5647",
                        border: `1.5px solid ${
                          recordType === t ? "#3B1010" : "#DDD0C4"
                        }`,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Registry ledger entries */}
              <div className="space-y-2">
                {filteredRecords.map((rec, i) => {
                  const rc = RecordColor[rec.type]
                  const isOpen = expandedRecord === rec.id
                  return (
                    <div
                      key={rec.id}
                      className="rounded-2xl overflow-hidden transition-all animate-fade-in"
                      style={{
                        background: "#F8F4EE",
                        border: "1.5px solid #DDD0C4",
                        animationDelay: `${i * 0.04}s`,
                      }}
                    >
                      <button
                        className="w-full flex items-center gap-5 px-6 py-4 text-left group hover:bg-white transition-colors"
                        onClick={() =>
                          setExpandedRecord(isOpen ? null : rec.id)
                        }
                      >
                        {/* Type circle with date */}
                        <div className="flex-shrink-0 flex flex-col items-center gap-1">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                            style={{ background: rc.bg }}
                          >
                            {rc.icon}
                          </div>
                          <span className="text-xs font-mono text-gray-400">
                            {rec.dateShort}
                          </span>
                        </div>

                        {/* Vertical divider */}
                        <div
                          className="w-px h-10 flex-shrink-0"
                          style={{ background: "#DDD0C4" }}
                        />

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-black text-gray-800 text-base group-hover:text-[#7B1C1C] transition-colors truncate"
                            style={{ fontFamily: "Fraunces" }}
                          >
                            {rec.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {rec.parish} · {rec.officiant}
                          </p>
                        </div>

                        {/* Type badge */}
                        <span
                          className="flex-shrink-0 hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                          style={{ background: rc.bg, color: rc.text }}
                        >
                          {rec.type}
                        </span>

                        {/* Registry ref */}
                        <span className="flex-shrink-0 text-xs font-mono text-gray-400 hidden lg:block">
                          {rec.bookNo}
                        </span>

                        {/* Expand icon */}
                        <span
                          className="flex-shrink-0 text-gray-300 transition-transform text-lg group-hover:text-gray-500"
                          style={{
                            transform: isOpen ? "rotate(180deg)" : "none",
                          }}
                        >
                          ▾
                        </span>
                      </button>

                      {/* Expanded drawer */}
                      {isOpen && (
                        <div
                          className="px-6 pb-5 border-t animate-fade-in"
                          style={{
                            borderColor: "#DDD0C4",
                            background: "#FDFAF7",
                          }}
                        >
                          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                              { k: "Type", v: rec.type },
                              { k: "Date", v: rec.date },
                              { k: "Parish", v: rec.parish },
                              { k: "Officiant", v: rec.officiant },
                              { k: "Book Number", v: rec.bookNo },
                              { k: "Page", v: rec.pageNo },
                              { k: "Entry", v: rec.entryNo },
                              { k: "Record ID", v: rec.id },
                            ].map((f) => (
                              <div
                                key={f.k}
                                className="rounded-xl p-3"
                                style={{
                                  background: "#F0EBE2",
                                  border: "1px solid #DDD0C4",
                                }}
                              >
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">
                                  {f.k}
                                </p>
                                <p
                                  className="text-sm font-bold text-gray-800"
                                  style={{ fontFamily: "DM Mono, monospace" }}
                                >
                                  {f.v}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-3 mt-4">
                            <button
                              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                              style={{ background: "#7B1C1C" }}
                            >
                              Print Certificate
                            </button>
                            <button
                              className="px-5 py-2.5 rounded-xl text-xs font-bold border transition-colors hover:bg-gray-100"
                              style={{
                                borderColor: "#DDD0C4",
                                color: "#6B5647",
                              }}
                            >
                              Edit Entry
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ▓▓ USERS — PERSONNEL GRID ▓▓ */}
          {tab === "users" && (
            <div className="p-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
                    System Administration
                  </p>
                  <h1
                    className="text-4xl font-black text-gray-900"
                    style={{ fontFamily: "Fraunces, Georgia, serif" }}
                  >
                    Users & Roles
                  </h1>
                  <p className="text-gray-500 mt-1">
                    {users.length} accounts ·{" "}
                    {users.filter((u) => u.active).length} active
                  </p>
                </div>
                <button
                  onClick={() => setUserDrawer(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg,#7B1C1C,#9B2C2C)",
                    boxShadow: "0 3px 10px rgba(123,28,28,0.3)",
                  }}
                >
                  + Add User
                </button>
              </div>

              {/* Role counts */}
              <div className="flex gap-3 flex-wrap mb-8">
                {Array.from(new Set(USERS.map((u) => u.role))).map((role) => {
                  const count = users.filter((u) => u.role === role).length
                  return (
                    <div
                      key={role}
                      className="rounded-xl px-4 py-2 flex items-center gap-2"
                      style={{
                        background: "#F8F4EE",
                        border: "1.5px solid #DDD0C4",
                      }}
                    >
                      <span
                        className="text-xl font-black"
                        style={{ color: "#7B1C1C", fontFamily: "Fraunces" }}
                      >
                        {count}
                      </span>
                      <span className="text-xs font-semibold text-gray-600">
                        {role}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Personnel card grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {users.map((u, i) => (
                  <div
                    key={u.id}
                    className="rounded-2xl overflow-hidden animate-fade-in"
                    style={{
                      background: "#F8F4EE",
                      border: "1.5px solid #DDD0C4",
                      opacity: u.active ? 1 : 0.65,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  >
                    {/* Card top strip */}
                    <div
                      className="h-16 relative"
                      style={{
                        background: u.active
                          ? "linear-gradient(135deg,#1C0808,#3B1010)"
                          : "#DDD0C4",
                      }}
                    >
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                        <div
                          className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-black text-white shadow-lg"
                          style={{
                            background: u.active
                              ? "linear-gradient(135deg,#7B1C1C,#C4971A)"
                              : "#9C8F84",
                            borderColor: "#F8F4EE",
                            fontFamily: "Fraunces",
                          }}
                        >
                          {u.initials}
                        </div>
                      </div>
                    </div>

                    <div className="pt-10 pb-5 px-5 text-center">
                      <h3
                        className="font-black text-gray-800 text-sm leading-tight mb-1"
                        style={{ fontFamily: "Fraunces" }}
                      >
                        {u.name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-3 truncate">
                        {u.email}
                      </p>

                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-3"
                        style={{
                          background: "#EDE8DF",
                          color: "#7B1C1C",
                          border: "1px solid #DDD0C4",
                        }}
                      >
                        {u.role}
                      </span>

                      {u.parish && (
                        <p className="text-xs text-gray-500 mb-1">
                          📍 {u.parish}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 font-mono mb-4">
                        Last: {u.lastSeen}
                      </p>

                      <div className="flex gap-2">
                        <button
                          className="flex-1 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-gray-100"
                          style={{ borderColor: "#DDD0C4", color: "#6B5647" }}
                        >
                          Edit
                        </button>
                        {u.active && u.role !== "Chancellor" && (
                          <button
                            onClick={() => deactivateUser(u.id)}
                            className="flex-1 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-red-50"
                            style={{
                              color: "#7F1D1D",
                              border: "1px solid #FECACA",
                            }}
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add user drawer */}
              {userDrawer && (
                <div
                  className="fixed inset-0 z-50 flex justify-end"
                  style={{
                    background: "rgba(12,5,5,0.5)",
                    backdropFilter: "blur(5px)",
                  }}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setUserDrawer(false)
                  }}
                >
                  <div
                    className="h-full w-full max-w-md flex flex-col bg-white shadow-2xl"
                    style={{
                      animation: "slideInRight 0.3s ease-out both",
                      borderLeft: "1px solid #DDD0C4",
                    }}
                  >
                    <div
                      className="px-6 py-5 border-b flex items-center justify-between"
                      style={{ background: "#1C0808", borderColor: "#3B1010" }}
                    >
                      <div>
                        <h2
                          className="text-white font-black text-lg"
                          style={{ fontFamily: "Fraunces" }}
                        >
                          Add New User
                        </h2>
                        <p className="text-white/40 text-xs">
                          Provision an ACROSS system account
                        </p>
                      </div>
                      <button
                        onClick={() => setUserDrawer(false)}
                        className="text-white/40 hover:text-white text-xl transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <div
                      className="flex-1 overflow-y-auto p-6 space-y-4"
                      style={{ background: "#EDE8DF" }}
                    >
                      {[
                        { l: "Full Name", p: "e.g., Rev. Fr. Juan dela Cruz" },
                        { l: "Email Address", p: "user@caceres.ph" },
                        { l: "Contact Number", p: "(054) 472-XXXX" },
                      ].map((f) => (
                        <div key={f.l}>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                            {f.l}
                          </label>
                          <input
                            type="text"
                            placeholder={f.p}
                            className="w-full px-4 py-3 rounded-xl text-sm bg-white"
                            style={{ border: "1.5px solid #DDD0C4" }}
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                          Role
                        </label>
                        <select
                          className="w-full px-4 py-3 rounded-xl text-sm bg-white"
                          style={{ border: "1.5px solid #DDD0C4" }}
                        >
                          <option>Parish Secretary</option>
                          <option>Parish Administrator</option>
                          <option>Archdiocesan Staff</option>
                          <option>Finance Officer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                          Assigned Parish
                        </label>
                        <select
                          className="w-full px-4 py-3 rounded-xl text-sm bg-white"
                          style={{ border: "1.5px solid #DDD0C4" }}
                        >
                          <option value="">— Archdiocesan (no parish) —</option>
                          {PARISHES.map((p) => (
                            <option key={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div
                        className="rounded-xl p-4 text-sm"
                        style={{
                          background: "#FEF3C7",
                          border: "1px solid #FDE68A",
                          color: "#78350F",
                        }}
                      >
                        ⚠️ A temporary password will be auto-generated and sent
                        to the user's email address.
                      </div>
                    </div>
                    <div
                      className="p-5 border-t flex gap-3 bg-white"
                      style={{ borderColor: "#DDD0C4" }}
                    >
                      <button
                        onClick={() => setUserDrawer(false)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
                        style={{ borderColor: "#DDD0C4", color: "#6B5647" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setUserDrawer(false)
                          pop("Account created and invitation sent. ✓")
                        }}
                        className="flex-1 py-2.5 rounded-xl text-sm font-black text-white transition-all"
                        style={{
                          background: "linear-gradient(135deg,#7B1C1C,#9B2C2C)",
                        }}
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ▓▓ NOTIFICATIONS ▓▓ */}
          {tab === "notifications" && (
            <div className="max-w-3xl mx-auto p-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
                    System Alerts
                  </p>
                  <h1
                    className="text-4xl font-black text-gray-900"
                    style={{ fontFamily: "Fraunces, Georgia, serif" }}
                  >
                    Notifications
                  </h1>
                  <p className="text-gray-500 mt-1">{unread} unread</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications(
                      notifications.map((n) => ({ ...n, unread: false })),
                    )
                  }
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors hover:bg-gray-100"
                  style={{ borderColor: "#DDD0C4", color: "#7B1C1C" }}
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-3">
                {notifications.map((n, i) => (
                  <button
                    key={n.id}
                    onClick={() =>
                      setNotifications(
                        notifications.map((x) =>
                          x.id === n.id ? { ...x, unread: false } : x,
                        ),
                      )
                    }
                    className="w-full text-left rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 animate-fade-in"
                    style={{
                      background: "#F8F4EE",
                      border: `1.5px solid #DDD0C4`,
                      borderLeftWidth: 5,
                      borderLeftColor: n.unread
                        ? n.urgency === "high"
                          ? "#DC2626"
                          : n.urgency === "medium"
                            ? "#CA8A04"
                            : "#DDD0C4"
                        : "#DDD0C4",
                      animationDelay: `${i * 0.05}s`,
                    }}
                  >
                    <div className="px-6 py-4 flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: "#EDE8DF" }}
                      >
                        {n.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p
                            className="font-black text-sm text-gray-800"
                            style={{ fontFamily: "Fraunces" }}
                          >
                            {n.title}
                          </p>
                          {n.unread && (
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: "#7B1C1C" }}
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          {n.body}
                        </p>
                        <p className="text-xs text-gray-400 font-mono mt-2">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ▓▓ SETTINGS ▓▓ */}
          {tab === "settings" && (
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-8">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
                  Configuration
                </p>
                <h1
                  className="text-4xl font-black text-gray-900"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  System Settings
                </h1>
                <p className="text-gray-500 mt-1">
                  ACROSS Diocese-wide configuration — Archdiocese of Caceres
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  {
                    title: "Report Submission",
                    items: [
                      {
                        l: "Monthly report due date",
                        t: "select" as const,
                        v: "5th of following month",
                      },
                      {
                        l: "Auto-reminders for pending parishes",
                        t: "toggle" as const,
                        v: true,
                      },
                      {
                        l: "Days before deadline to remind",
                        t: "number" as const,
                        v: "3",
                      },
                      {
                        l: "Flag as LATE after due date passes",
                        t: "toggle" as const,
                        v: true,
                      },
                      {
                        l: "Financial report due date",
                        t: "select" as const,
                        v: "10th of following month",
                      },
                      {
                        l: "Auto-reminders for financial reports",
                        t: "toggle" as const,
                        v: true,
                      },
                      {
                        l: "Flag financial report as LATE after due date",
                        t: "toggle" as const,
                        v: true,
                      },
                    ],
                  },
                  {
                    title: "Notifications",
                    items: [
                      {
                        l: "Email alerts for new submissions",
                        t: "toggle" as const,
                        v: true,
                      },
                      {
                        l: "Email alerts for late submissions",
                        t: "toggle" as const,
                        v: true,
                      },
                      {
                        l: "Weekly diocese-wide digest",
                        t: "toggle" as const,
                        v: false,
                      },
                      {
                        l: "SMS alerts for overdue reports",
                        t: "toggle" as const,
                        v: false,
                      },
                    ],
                  },
                  {
                    title: "Registry & Records",
                    items: [
                      {
                        l: "Allow staff to add records directly",
                        t: "toggle" as const,
                        v: true,
                      },
                      {
                        l: "Require admin approval for deletions",
                        t: "toggle" as const,
                        v: true,
                      },
                      {
                        l: "Archive records older than (years)",
                        t: "number" as const,
                        v: "50",
                      },
                    ],
                  },
                  {
                    title: "Security",
                    items: [
                      {
                        l: "2-factor auth for admin accounts",
                        t: "toggle" as const,
                        v: true,
                      },
                      {
                        l: "Session timeout (minutes)",
                        t: "number" as const,
                        v: "60",
                      },
                      {
                        l: "Max login attempts before lock",
                        t: "number" as const,
                        v: "5",
                      },
                      {
                        l: "Force password reset every 90 days",
                        t: "toggle" as const,
                        v: false,
                      },
                    ],
                  },
                ].map((section) => (
                  <div
                    key={section.title}
                    className="rounded-2xl p-6"
                    style={{
                      background: "#F8F4EE",
                      border: "1.5px solid #DDD0C4",
                    }}
                  >
                    <h3
                      className="font-black text-gray-800 text-lg mb-5"
                      style={{ fontFamily: "Fraunces" }}
                    >
                      {section.title}
                    </h3>
                    <div className="space-y-4">
                      {section.items.map((item) => (
                        <div
                          key={item.l}
                          className="flex items-center justify-between gap-4"
                        >
                          <p className="text-sm text-gray-700 flex-1">
                            {item.l}
                          </p>
                          {item.t === "toggle" ? (
                            <button
                              className="w-11 h-6 rounded-full relative flex-shrink-0 transition-colors"
                              style={{
                                background: item.v ? "#7B1C1C" : "#DDD0C4",
                              }}
                            >
                              <div
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                  item.v ? "left-5" : "left-0.5"
                                }`}
                              />
                            </button>
                          ) : item.t === "select" ? (
                            <select
                              className="text-xs px-3 py-1.5 rounded-lg border"
                              style={{
                                borderColor: "#DDD0C4",
                                background: "#EDE8DF",
                              }}
                            >
                              <option>{item.v}</option>
                            </select>
                          ) : (
                            <input
                              type="number"
                              defaultValue={String(item.v)}
                              className="w-16 text-xs px-2 py-1.5 rounded-lg border text-center"
                              style={{ borderColor: "#DDD0C4" }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border hover:bg-gray-100 transition-colors"
                  style={{ borderColor: "#DDD0C4", color: "#6B5647" }}
                >
                  Reset
                </button>
                <button
                  onClick={() => pop("Settings saved. ✓")}
                  className="px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg,#7B1C1C,#9B2C2C)",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── PARISH PANEL ── */}
      {parishPanel && (
        <ParishPanel
          parish={parishPanel}
          onClose={() => setParishPanel(null)}
          onStatistics={() => {
            setStatisticsParish(parishPanel.name)
            setParishPanel(null)
            setTab("statistics")
          }}
        />
      )}

      {returnFinancialReport && (
        <ReturnFinancialModal
          report={returnFinancialReport}
          onClose={() => setReturnFinancialReport(null)}
          onReturn={(remarks) => {
            setFinancialReports((current) =>
              current.map((report) =>
                report.id === returnFinancialReport.id
                  ? { ...report, status: "returned" as const, note: remarks }
                  : report,
              ),
            )
            setSelectedFinancialReport((current) =>
              current?.id === returnFinancialReport.id
                ? { ...current, status: "returned", note: remarks }
                : current,
            )
            setReturnFinancialReport(null)
            pop("Financial report returned for correction.")
          }}
        />
      )}

      {/* ── CONFIRM DIALOG ── */}
      {confirm && (
        <Confirm
          title={confirm.title}
          body={confirm.body}
          yes={confirm.yes}
          danger={confirm.danger}
          onYes={() => {
            confirm.action()
            setConfirm(null)
          }}
          onNo={() => setConfirm(null)}
        />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-slide-right">
          <div
            className="px-6 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl flex items-center gap-3 whitespace-nowrap"
            style={{
              background: "#1C0808",
              border: "1px solid rgba(196,151,26,0.4)",
            }}
          >
            <span style={{ color: "#C4971A" }}>✦</span>
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
