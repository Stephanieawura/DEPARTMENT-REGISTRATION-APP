import { useState } from "react";
import {
  Home,
  BookOpen,
  Upload,
  CheckCircle,
  User,
  LogOut,
  Bell,
  ChevronRight,
  FileText,
  Eye,
  X,
  Check,
  Clock,
  AlertCircle,
  Search,
  RefreshCw,
  Shield,
  GraduationCap,
  Users,
  Lock,
  Smartphone,
  HelpCircle,
  ChevronDown,
  Mail,
  Phone,
  MessageSquare,
  Info,
  Trash2,
  ClipboardList,
} from "lucide-react";

type Screen =
  | "splash"
  | "login"
  | "studentHome"
  | "studentCourses"
  | "studentRegistration"
  | "studentProfile"
  | "courseDetails"
  | "notifications"
  | "privacy"
  | "helpSupport"
  | "adminDashboard"
  | "adminReview";

type StudentTab = "home" | "courses" | "registration" | "profile";
type RegistrationSubTab = "upload" | "status";
type VerificationStatus = "Pending" | "Approved" | "Rejected";

interface Course {
  code: string;
  title: string;
  credits: number;
  lecturer: string;
  description?: string;
  prerequisites?: string;
  schedule?: string;
  venue?: string;
  enrolled?: number;
  capacity?: number;
}

interface Submission {
  id: string;
  name: string;
  studentId: string;
  program: string;
  level: string;
  submittedAt: string;
  status: VerificationStatus;
  courses: number;
}

// ────────────────────────────────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────────────────────────────────
const SAMPLE_COURSES: Course[] = [
  {
    code: "DCIT 301",
    title: "Software Engineering",
    credits: 3,
    lecturer: "Dr. K. Acheampong",
    description: "Introduction to software development methodologies, project management, testing strategies, and best practices in modern software engineering.",
    prerequisites: "DCIT 201, DCIT 203",
    schedule: "Mon & Wed, 10:00am - 11:30am",
    venue: "DCSIT Lab 3",
    enrolled: 87,
    capacity: 120,
  },
  {
    code: "DCIT 303",
    title: "Computer Networks",
    credits: 3,
    lecturer: "Dr. A. Mensah",
    description: "Study of computer network architectures, protocols, and technologies. Topics include TCP/IP, routing, network security, and wireless communications.",
    prerequisites: "DCIT 201",
    schedule: "Tue & Thu, 8:00am - 9:30am",
    venue: "DCSIT LT 1",
    enrolled: 92,
    capacity: 100,
  },
  {
    code: "DCIT 305",
    title: "Database Management Systems",
    credits: 3,
    lecturer: "Prof. E. Bediako",
    description: "Comprehensive coverage of database design, normalization, SQL, transactions, and NoSQL databases. Includes practical projects using MySQL and MongoDB.",
    prerequisites: "DCIT 203",
    schedule: "Mon & Wed, 2:00pm - 3:30pm",
    venue: "DCSIT Lab 2",
    enrolled: 78,
    capacity: 100,
  },
  {
    code: "DCIT 307",
    title: "Operating Systems",
    credits: 3,
    lecturer: "Dr. S. Asante",
    description: "Exploration of operating system concepts including process management, memory management, file systems, and concurrency control.",
    prerequisites: "DCIT 202",
    schedule: "Tue & Thu, 10:00am - 11:30am",
    venue: "DCSIT LT 2",
    enrolled: 95,
    capacity: 120,
  },
  {
    code: "DCIT 309",
    title: "Artificial Intelligence",
    credits: 3,
    lecturer: "Dr. R. Boateng",
    description: "Introduction to AI concepts, machine learning algorithms, neural networks, and practical applications. Hands-on projects using Python and TensorFlow.",
    prerequisites: "DCIT 203, MATH 223",
    schedule: "Wed & Fri, 12:00pm - 1:30pm",
    venue: "DCSIT Lab 4",
    enrolled: 65,
    capacity: 80,
  },
  {
    code: "DCIT 311",
    title: "Web Technologies",
    credits: 3,
    lecturer: "Dr. P. Adusei",
    description: "Modern web development using HTML5, CSS3, JavaScript, React, and backend technologies. Covers responsive design and RESTful API development.",
    prerequisites: "DCIT 201",
    schedule: "Mon & Thu, 4:00pm - 5:30pm",
    venue: "DCSIT Lab 1",
    enrolled: 110,
    capacity: 120,
  },
];

const SAMPLE_SUBMISSIONS: Submission[] = [
  {
    id: "S001",
    name: "Kwame Asante",
    studentId: "10897354",
    program: "BSc Computer Science",
    level: "Level 300",
    submittedAt: "2024-01-15 09:32",
    status: "Pending",
    courses: 6,
  },
  {
    id: "S002",
    name: "Abena Mensah",
    studentId: "10897212",
    program: "BSc IT",
    level: "Level 200",
    submittedAt: "2024-01-15 08:14",
    status: "Approved",
    courses: 5,
  },
  {
    id: "S003",
    name: "Kofi Darko",
    studentId: "10897089",
    program: "BSc Computer Science",
    level: "Level 400",
    submittedAt: "2024-01-14 16:50",
    status: "Rejected",
    courses: 4,
  },
  {
    id: "S004",
    name: "Ama Owusu",
    studentId: "10897441",
    program: "BSc IT",
    level: "Level 300",
    submittedAt: "2024-01-14 14:22",
    status: "Pending",
    courses: 6,
  },
  {
    id: "S005",
    name: "Yaw Boateng",
    studentId: "10897502",
    program: "BSc Computer Science",
    level: "Level 100",
    submittedAt: "2024-01-14 11:05",
    status: "Approved",
    courses: 6,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Shared atoms
// ────────────────────────────────────────────────────────────────────────────
function PrimaryButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 bg-[#BA8F4A] text-white font-semibold rounded-2xl text-sm hover:bg-[#a67d3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryDestructiveButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 bg-white text-red-600 font-semibold rounded-2xl text-sm border-2 border-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: VerificationStatus }) {
  const map: Record<VerificationStatus, { bg: string; text: string; icon: React.ReactNode }> = {
    Pending: {
      bg: "bg-amber-50 text-amber-700 border border-amber-200",
      text: "Pending",
      icon: <Clock size={12} className="mr-1" />,
    },
    Approved: {
      bg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      text: "Approved",
      icon: <Check size={12} className="mr-1" />,
    },
    Rejected: {
      bg: "bg-red-50 text-red-700 border border-red-200",
      text: "Rejected",
      icon: <X size={12} className="mr-1" />,
    },
  };
  const { bg, text, icon } = map[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg}`}>
      {icon}
      {text}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// UG Logo mark (SVG crest placeholder)
// ────────────────────────────────────────────────────────────────────────────
function UGCrest({ size = 48, dark = false }: { size?: number; dark?: boolean }) {
  const fill = dark ? "#153D70" : "#ffffff";
  const gold = "#BA8F4A";
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill={dark ? "#F8F9FA" : "#153D70"} stroke={gold} strokeWidth="3" />
      <GraduationCap size={size * 0.45} x={size * 0.275} y={size * 0.275} color={fill} />
      <text x="40" y="68" textAnchor="middle" fontSize="9" fontWeight="700" fill={gold} fontFamily="Inter, sans-serif">
        UG
      </text>
      <path d="M20 52 Q40 42 60 52" stroke={gold} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Phone frame wrapper
// ────────────────────────────────────────────────────────────────────────────
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d2845] via-[#153D70] to-[#1a4d8f] flex items-center justify-center p-4">
      <div className="relative w-[390px] h-[844px] bg-white rounded-[48px] shadow-2xl overflow-hidden border-4 border-[#1a1a2e] flex flex-col">
        {/* Status bar */}
        <div className="h-10 bg-[#153D70] flex items-center justify-between px-8 shrink-0">
          <span className="text-white text-xs font-medium">9:41</span>
          <div className="flex gap-1 items-center">
            <div className="flex gap-0.5 items-end">
              <div className="w-1 h-2 bg-white rounded-sm opacity-60" />
              <div className="w-1 h-2.5 bg-white rounded-sm opacity-80" />
              <div className="w-1 h-3 bg-white rounded-sm" />
            </div>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="white" className="ml-0.5">
              <rect x="0" y="3" width="14" height="7" rx="2" stroke="white" strokeWidth="1.2" fill="none" />
              <rect x="14.5" y="4.5" width="1.5" height="4" rx="0.75" fill="white" />
              <rect x="1" y="4" width="10" height="5" rx="1" fill="white" />
            </svg>
          </div>
        </div>
        {/* Screen content */}
        <div className="flex-1 overflow-hidden flex flex-col">{children}</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Splash screen
// ────────────────────────────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex-1 bg-[#153D70] flex flex-col items-center justify-center gap-6 px-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[#BA8F4A] flex items-center justify-center">
          <GraduationCap size={44} color="#BA8F4A" />
        </div>
        <div className="text-center">
          <p className="text-[#BA8F4A] text-xs font-semibold tracking-[0.2em] uppercase mb-1">University of Ghana</p>
          <h1 className="text-white text-2xl font-bold leading-tight">CS Department</h1>
          <h1 className="text-white text-2xl font-bold leading-tight">Registration App</h1>
        </div>
      </div>
      <div className="w-full mt-4 space-y-3">
        <button
          onClick={onDone}
          className="w-full py-3.5 bg-[#BA8F4A] text-white font-semibold rounded-2xl text-base hover:bg-[#a67d3f] transition-colors"
        >
          Get Started
        </button>
      </div>
      <p className="text-white/40 text-xs mt-4 text-center">
        College of Basic & Applied Science
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Login screen
// ────────────────────────────────────────────────────────────────────────────
function LoginScreen({
  onStudentLogin,
  onAdminLogin,
}: {
  onStudentLogin: () => void;
  onAdminLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sentEmail, setSentEmail] = useState("");

  const handleSendOTP = () => {
    if (!email || !idNumber) {
      alert("Please enter both email and ID number");
      return;
    }
    // Mock OTP sending
    setSentEmail(email);
    setOtpSent(true);
    // In production, this would call an API to send OTP to the email
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter the 6-digit OTP");
      return;
    }
    // Mock OTP verification (in production, verify with backend)
    if (otp === "123456") {
      isAdmin ? onAdminLogin() : onStudentLogin();
    } else {
      alert("Invalid OTP. Try '123456' for demo purposes.");
    }
  };

  const handleResendOTP = () => {
    // Mock resending OTP
    alert(`OTP resent to ${sentEmail}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA]">
      <div className="bg-[#153D70] pt-4 pb-10 px-6 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-[#BA8F4A] flex items-center justify-center mb-3">
          <GraduationCap size={36} color="#BA8F4A" />
        </div>
        <p className="text-[#BA8F4A] text-xs font-semibold tracking-widest uppercase">University of Ghana</p>
        <h2 className="text-white text-lg font-bold mt-0.5">CS Dept. Registration</h2>
      </div>

      <div className="flex-1 px-6 -mt-6">
        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
          {!otpSent ? (
            <>
              <div className="flex rounded-xl overflow-hidden border border-[rgba(21,61,112,0.12)] mb-2">
                {["Student", "Admin"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setIsAdmin(role === "Admin")}
                    className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                      (role === "Admin") === isAdmin
                        ? "bg-[#153D70] text-white"
                        : "bg-white text-[#153D70]"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#153D70] uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder={isAdmin ? "staff@ug.edu.gh" : "student@st.ug.edu.gh"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8F9FA] rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 border border-transparent focus:border-[#153D70] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#153D70] uppercase tracking-wider">
                  {isAdmin ? "Staff ID Number" : "Student ID Number"}
                </label>
                <input
                  type="text"
                  placeholder={isAdmin ? "e.g. STAFF-001" : "e.g. 10897354"}
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8F9FA] rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 border border-transparent focus:border-[#153D70] focus:outline-none transition-colors"
                />
              </div>

              <PrimaryButton onClick={handleSendOTP} className="mt-1">
                Send OTP
              </PrimaryButton>

              <p className="text-center text-xs text-gray-400 pt-1">
                Need help?{" "}
                <span className="text-[#153D70] font-semibold">Contact Admin</span>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => setOtpSent(false)}
                className="flex items-center gap-2 text-[#153D70] text-sm font-semibold -mt-2"
              >
                <ChevronDown size={16} className="rotate-90" />
                Back
              </button>

              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full bg-[#BA8F4A]/10 flex items-center justify-center mx-auto mb-3">
                  <Mail size={28} color="#BA8F4A" />
                </div>
                <h3 className="text-[#153D70] font-bold text-base mb-1">Verify Your Email</h3>
                <p className="text-xs text-gray-500">
                  We've sent a 6-digit code to
                  <br />
                  <span className="font-semibold text-[#153D70]">{sentEmail}</span>
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#153D70] uppercase tracking-wider">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="w-full px-4 py-3 bg-[#F8F9FA] rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 border border-transparent focus:border-[#153D70] focus:outline-none transition-colors text-center tracking-[0.5em] font-semibold text-lg"
                />
              </div>

              <PrimaryButton onClick={handleVerifyOTP} className="mt-1">
                Verify & Sign In
              </PrimaryButton>

              <p className="text-center text-xs text-gray-400 pt-1">
                Didn't receive code?{" "}
                <button
                  onClick={handleResendOTP}
                  className="text-[#153D70] font-semibold"
                >
                  Resend OTP
                </button>
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2">
                <p className="text-xs text-amber-800 text-center">
                  <span className="font-semibold">Demo Mode:</span> Use code <span className="font-mono font-bold">123456</span>
                </p>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Department of Computer Science · UG
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Student — Top header
// ────────────────────────────────────────────────────────────────────────────
function StudentHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-[#153D70] px-5 py-4 shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">{title}</h2>
          {subtitle && <p className="text-white/60 text-xs mt-0.5">{subtitle}</p>}
        </div>
        <button className="relative p-2 rounded-xl bg-white/10">
          <Bell size={18} color="white" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#BA8F4A] rounded-full border border-[#153D70]" />
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Student — Bottom tab bar
// ────────────────────────────────────────────────────────────────────────────
function StudentTabBar({
  active,
  onChange,
}: {
  active: StudentTab;
  onChange: (t: StudentTab) => void;
}) {
  const tabs: { id: StudentTab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "courses", label: "Courses", icon: <BookOpen size={20} /> },
    { id: "registration", label: "Registration", icon: <ClipboardList size={20} /> },
    { id: "profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <div className="bg-white border-t border-[rgba(21,61,112,0.1)] shrink-0">
      <div className="flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors"
          >
            <span className={active === t.id ? "text-[#153D70]" : "text-gray-400"}>{t.icon}</span>
            <span
              className={`text-[10px] font-semibold ${
                active === t.id ? "text-[#153D70]" : "text-gray-400"
              }`}
            >
              {t.label}
            </span>
            {active === t.id && (
              <span className="w-4 h-0.5 bg-[#BA8F4A] rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Student — Home tab
// ────────────────────────────────────────────────────────────────────────────
function StudentHomeTab({ onTabChange }: { onTabChange: (t: StudentTab) => void }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
      <StudentHeader title="Good morning, Stephanie" subtitle="BSc Information Technology · Level 300" />

      <div className="px-4 py-4 space-y-4">
        {/* Status overview card */}
        <div className="bg-[#153D70] rounded-2xl p-4 text-white">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">Registration Status</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock size={16} color="#BA8F4A" />
                <span className="text-[#BA8F4A] font-semibold text-sm">Pending Verification</span>
              </div>
            </div>
            <span className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded-lg">Sem 2 · 2023/24</span>
          </div>
          <div className="flex gap-3 mt-1">
            <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">6</p>
              <p className="text-white/60 text-xs mt-0.5">Courses Synced</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">18</p>
              <p className="text-white/60 text-xs mt-0.5">Total Credits</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">1</p>
              <p className="text-white/60 text-xs mt-0.5">Doc Uploaded</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Sync Courses", desc: "Fetch from MISWeb", icon: <RefreshCw size={20} color="#153D70" />, tab: "courses" as StudentTab },
              { label: "Upload Slip", desc: "Proof of Registration", icon: <Upload size={20} color="#BA8F4A" />, tab: "registration" as StudentTab },
              { label: "Check Status", desc: "View clearance", icon: <CheckCircle size={20} color="#153D70" />, tab: "registration" as StudentTab },
              { label: "My Profile", desc: "View details", icon: <User size={20} color="#153D70" />, tab: "profile" as StudentTab },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => onTabChange(a.tab)}
                className="bg-white rounded-2xl p-4 flex flex-col items-start gap-2 text-left shadow-sm hover:shadow-md transition-shadow border border-[rgba(21,61,112,0.06)]"
              >
                <div className="w-10 h-10 bg-[#F8F9FA] rounded-xl flex items-center justify-center">
                  {a.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e]">{a.label}</p>
                  <p className="text-xs text-gray-400">{a.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Activity</p>
          <div className="bg-white rounded-2xl divide-y divide-[rgba(21,61,112,0.06)] border border-[rgba(21,61,112,0.06)]">
            {[
              { label: "Courses synced from MISWeb", time: "Today 9:32am", icon: <RefreshCw size={14} color="#153D70" />, color: "bg-blue-50" },
              { label: "Proof of Registration uploaded", time: "Today 9:35am", icon: <Upload size={14} color="#BA8F4A" />, color: "bg-amber-50" },
              { label: "Verification submitted", time: "Today 9:36am", icon: <FileText size={14} color="#153D70" />, color: "bg-blue-50" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#1a1a2e] leading-tight">{item.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{item.time}</p>
                </div>
                <ChevronRight size={14} color="#d1d5db" className="shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Student — Courses tab
// ────────────────────────────────────────────────────────────────────────────
function StudentCoursesTab({ onCourseClick }: { onCourseClick: (course: Course) => void }) {
  const [synced, setSynced] = useState(true);
  const [syncing, setSyncing] = useState(false);

  function handleSync() {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
    }, 1500);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      <StudentHeader title="My Courses" subtitle="Semester 2 · 2023/2024" />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Sync banner */}
        <div className="bg-white rounded-2xl p-4 border border-[rgba(21,61,112,0.06)] flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <RefreshCw size={18} color="#153D70" className={syncing ? "animate-spin" : ""} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1a1a2e]">MISWeb Sync</p>
            <p className="text-xs text-gray-400">{synced ? "Last synced: Today 9:32am" : "Not yet synced"}</p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-3 py-2 bg-[#BA8F4A] text-white text-xs font-semibold rounded-xl hover:bg-[#a67d3f] transition-colors disabled:opacity-70 shrink-0"
          >
            {syncing ? "Syncing…" : "Sync Now"}
          </button>
        </div>

        {synced && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered Courses</p>
              <span className="text-xs text-[#153D70] font-semibold bg-blue-50 px-2 py-0.5 rounded-lg">
                {SAMPLE_COURSES.length} courses · 18 credits
              </span>
            </div>

            <div className="space-y-2">
              {SAMPLE_COURSES.map((c, i) => (
                <button
                  key={i}
                  onClick={() => onCourseClick(c)}
                  className="w-full bg-white rounded-2xl p-4 border border-[rgba(21,61,112,0.06)] flex items-center gap-3 hover:shadow-md transition-shadow text-left"
                >
                  <div className="w-10 h-10 bg-[#153D70] rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-bold">
                      {c.code.split(" ")[1]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1a1a2e] leading-tight">{c.title}</p>
                    <p className="text-xs text-[#153D70] font-medium mt-0.5">{c.code}</p>
                    <p className="text-xs text-gray-400 mt-1">{c.lecturer}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-[#153D70] bg-blue-50 px-2 py-0.5 rounded-lg">
                      {c.credits} cr
                    </span>
                    <ChevronRight size={16} color="#9ca3af" />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Course Details Screen
// ────────────────────────────────────────────────────────────────────────────
function CourseDetailsScreen({
  course,
  onBack,
  isRegistered = true,
}: {
  course: Course;
  onBack: () => void;
  isRegistered?: boolean;
}) {
  const [registered, setRegistered] = useState(isRegistered);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = () => {
    setRegistered(true);
  };

  const handleUnregister = () => {
    setShowConfirm(true);
  };

  const confirmUnregister = () => {
    setRegistered(false);
    setShowConfirm(false);
  };

  const enrollmentPercentage = course.enrolled && course.capacity
    ? Math.round((course.enrolled / course.capacity) * 100)
    : 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-[#153D70] px-5 py-4 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-3 hover:opacity-80 transition-opacity"
        >
          <ChevronDown size={20} className="rotate-90" />
          <span className="text-sm font-semibold">Back to Courses</span>
        </button>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-lg leading-tight">{course.title}</h2>
            <p className="text-white/60 text-xs mt-1">{course.code}</p>
          </div>
          <div className="shrink-0">
            <span className="inline-block px-3 py-1.5 bg-[#BA8F4A] text-white text-xs font-bold rounded-xl">
              {course.credits} Credits
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-32">
        {/* Registration Status */}
        {registered && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle size={20} color="#059669" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-900">Registered</p>
              <p className="text-xs text-emerald-700">You are enrolled in this course</p>
            </div>
          </div>
        )}

        {/* Course Info */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-[#1a1a2e] leading-relaxed">
              {course.description || "No description available."}
            </p>
          </div>

          <div className="pt-3 border-t border-[rgba(21,61,112,0.06)]">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Course Details</p>
            <div className="space-y-3">
              {[
                { label: "Lecturer", value: course.lecturer, icon: <User size={16} color="#153D70" /> },
                { label: "Schedule", value: course.schedule || "TBA", icon: <Clock size={16} color="#153D70" /> },
                { label: "Venue", value: course.venue || "TBA", icon: <Home size={16} color="#153D70" /> },
                { label: "Prerequisites", value: course.prerequisites || "None", icon: <BookOpen size={16} color="#153D70" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F8F9FA] rounded-lg flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                    <p className="text-sm font-semibold text-[#1a1a2e] mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enrollment Stats */}
        {course.enrolled !== undefined && course.capacity !== undefined && (
          <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Enrollment</p>
              <span className="text-xs font-semibold text-[#153D70]">
                {course.enrolled} / {course.capacity}
              </span>
            </div>
            <div className="w-full h-2 bg-[#F8F9FA] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#153D70] transition-all"
                style={{ width: `${enrollmentPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {course.capacity - course.enrolled} {course.capacity - course.enrolled === 1 ? 'seat' : 'seats'} available
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[rgba(21,61,112,0.1)] p-4 space-y-3">
        {!registered ? (
          <PrimaryButton onClick={handleRegister}>
            Register for Course
          </PrimaryButton>
        ) : (
          <SecondaryDestructiveButton onClick={handleUnregister}>
            Cancel Registration
          </SecondaryDestructiveButton>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={28} color="#dc2626" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">Cancel Registration?</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Are you sure you want to unregister from <span className="font-semibold text-[#153D70]">{course.code}</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={confirmUnregister}
                className="w-full py-3 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Registration
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3 bg-[#F8F9FA] text-[#1a1a2e] font-semibold rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Keep Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Student — Upload tab
// ────────────────────────────────────────────────────────────────────────────
function StudentUploadTab() {
  const [uploaded, setUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleUpload() {
    setUploaded(true);
  }

  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 1000);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      <StudentHeader title="Upload Documents" subtitle="Proof of Registration" />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
          <AlertCircle size={16} color="#1d4ed8" className="shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Download your Proof of Registration from the UG MISWeb portal and upload the PDF here for departmental clearance verification.
          </p>
        </div>

        {/* Upload area */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] overflow-hidden">
          <div className="px-4 pt-4 pb-2 border-b border-[rgba(21,61,112,0.06)]">
            <p className="text-sm font-semibold text-[#1a1a2e]">Proof of Registration</p>
            <p className="text-xs text-gray-400">PDF format · Max 5MB</p>
          </div>
          <div className="p-4">
            {!uploaded ? (
              <button
                onClick={handleUpload}
                className="w-full border-2 border-dashed border-[rgba(21,61,112,0.2)] rounded-2xl py-8 flex flex-col items-center gap-2 hover:border-[#153D70] hover:bg-blue-50/50 transition-colors"
              >
                <div className="w-12 h-12 bg-[#F8F9FA] rounded-2xl flex items-center justify-center">
                  <Upload size={24} color="#153D70" />
                </div>
                <p className="text-sm font-semibold text-[#153D70]">Tap to upload PDF</p>
                <p className="text-xs text-gray-400">or drag and drop</p>
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-xl p-3">
                <div className="w-10 h-10 bg-[#153D70] rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={18} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a1a2e] truncate">proof_of_registration_s2.pdf</p>
                  <p className="text-xs text-gray-400">2.4 MB · Just now</p>
                </div>
                <button onClick={() => setUploaded(false)}>
                  <X size={16} color="#9ca3af" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Departmental form */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 space-y-3">
          <p className="text-sm font-semibold text-[#1a1a2e]">Departmental Registration Form</p>
          {[
            { label: "Full Name", value: "Stephanie Awrabena Dunyo" },
            { label: "Student ID", value: "10897354" },
            { label: "Programme", value: "BSc Information Technology" },
            { label: "Level", value: "Level 300" },
            { label: "Academic Year", value: "2023/2024" },
            { label: "Semester", value: "Semester 2" },
          ].map((f) => (
            <div key={f.label} className="space-y-0.5">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {f.label}
              </label>
              <input
                readOnly
                value={f.value}
                className="w-full px-3 py-2.5 bg-[#F8F9FA] rounded-xl text-sm text-[#1a1a2e] border border-transparent focus:outline-none"
              />
            </div>
          ))}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!uploaded || submitting}
          className="w-full py-4 bg-[#BA8F4A] text-white font-semibold rounded-2xl text-sm hover:bg-[#a67d3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit for Verification"}
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Student — Status tab
// ────────────────────────────────────────────────────────────────────────────
function StudentStatusTab() {
  const status: VerificationStatus = "Pending";
  const statusConfig = {
    Pending: {
      icon: <Clock size={32} color="#d97706" />,
      bg: "bg-amber-50",
      border: "border-amber-200",
      headline: "Verification Pending",
      message: "Your submission is under review by the department. This usually takes 1–2 working days.",
      color: "text-amber-700",
    },
    Approved: {
      icon: <Check size={32} color="#059669" />,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      headline: "Clearance Approved",
      message: "Your departmental clearance has been approved. You are fully registered.",
      color: "text-emerald-700",
    },
    Rejected: {
      icon: <X size={32} color="#dc2626" />,
      bg: "bg-red-50",
      border: "border-red-200",
      headline: "Submission Rejected",
      message: "Your submission was rejected. Please review the feedback and resubmit.",
      color: "text-red-700",
    },
  };

  const cfg = statusConfig[status];

  const timeline = [
    { label: "Account Created", done: true, time: "Jan 14, 9:00am" },
    { label: "Courses Synced", done: true, time: "Jan 15, 9:32am" },
    { label: "Document Uploaded", done: true, time: "Jan 15, 9:35am" },
    { label: "Submitted for Verification", done: true, time: "Jan 15, 9:36am" },
    { label: "Under Review", done: false, time: "In progress" },
    { label: "Clearance Decision", done: false, time: "Awaiting" },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      <StudentHeader title="Clearance Status" subtitle="Track your verification progress" />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Status card */}
        <div className={`${cfg.bg} border ${cfg.border} rounded-2xl p-5 flex flex-col items-center gap-3 text-center`}>
          <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm`}>
            {cfg.icon}
          </div>
          <div>
            <h3 className={`font-bold text-base ${cfg.color}`}>{cfg.headline}</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{cfg.message}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Submission details */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 space-y-3">
          <p className="text-sm font-semibold text-[#1a1a2e]">Submission Details</p>
          {[
            { label: "Reference No.", value: "DEP-2024-10897354-S2" },
            { label: "Submitted", value: "Jan 15, 2024 at 9:36am" },
            { label: "Courses", value: "6 courses · 18 credits" },
            { label: "Document", value: "proof_of_registration_s2.pdf" },
          ].map((d) => (
            <div key={d.label} className="flex justify-between items-center py-1 border-b border-[rgba(21,61,112,0.04)] last:border-0">
              <span className="text-xs text-gray-400 font-medium">{d.label}</span>
              <span className="text-xs font-semibold text-[#1a1a2e]">{d.value}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4">
          <p className="text-sm font-semibold text-[#1a1a2e] mb-4">Progress Timeline</p>
          <div className="space-y-0">
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-3 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      step.done ? "bg-[#153D70]" : "bg-[#F8F9FA] border-2 border-gray-200"
                    }`}
                  >
                    {step.done && <Check size={12} color="white" />}
                  </div>
                  {i < timeline.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 min-h-[20px] ${step.done ? "bg-[#153D70]" : "bg-gray-200"}`}
                    />
                  )}
                </div>
                <div className="pb-4 flex-1">
                  <p className={`text-xs font-semibold ${step.done ? "text-[#1a1a2e]" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Student — Registration tab (combined Upload & Status)
// ────────────────────────────────────────────────────────────────────────────
function StudentRegistrationTab() {
  const [activeSubTab, setActiveSubTab] = useState<RegistrationSubTab>("upload");
  const [uploaded, setUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleUpload() {
    setUploaded(true);
  }

  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 1000);
  }

  const status: VerificationStatus = "Pending";
  const statusConfig = {
    Pending: {
      icon: <Clock size={32} color="#d97706" />,
      bg: "bg-amber-50",
      border: "border-amber-200",
      headline: "Verification Pending",
      message: "Your submission is under review by the department. This usually takes 1–2 working days.",
      color: "text-amber-700",
    },
    Approved: {
      icon: <Check size={32} color="#059669" />,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      headline: "Clearance Approved",
      message: "Your departmental clearance has been approved. You are fully registered.",
      color: "text-emerald-700",
    },
    Rejected: {
      icon: <X size={32} color="#dc2626" />,
      bg: "bg-red-50",
      border: "border-red-200",
      headline: "Submission Rejected",
      message: "Your submission was rejected. Please review the feedback and resubmit.",
      color: "text-red-700",
    },
  };

  const cfg = statusConfig[status];

  const timeline = [
    { label: "Account Created", done: true, time: "Jan 14, 9:00am" },
    { label: "Courses Synced", done: true, time: "Jan 15, 9:32am" },
    { label: "Document Uploaded", done: true, time: "Jan 15, 9:35am" },
    { label: "Submitted for Verification", done: true, time: "Jan 15, 9:36am" },
    { label: "Under Review", done: false, time: "In progress" },
    { label: "Clearance Decision", done: false, time: "Awaiting" },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      <StudentHeader
        title="Registration"
        subtitle={activeSubTab === "upload" ? "Upload documents" : "Track status"}
      />

      {/* Sub-tabs */}
      <div className="bg-white border-b border-[rgba(21,61,112,0.1)] shrink-0 px-4">
        <div className="flex gap-1">
          {[
            { id: "upload" as RegistrationSubTab, label: "Upload", icon: <Upload size={16} /> },
            { id: "status" as RegistrationSubTab, label: "Status", icon: <CheckCircle size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-colors relative ${
                activeSubTab === tab.id
                  ? "text-[#153D70]"
                  : "text-gray-400"
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeSubTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#153D70]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeSubTab === "upload" ? (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
            <AlertCircle size={16} color="#1d4ed8" className="shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Download your Proof of Registration from the UG MISWeb portal and upload the PDF here for departmental clearance verification.
            </p>
          </div>

          {/* Upload area */}
          <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] overflow-hidden">
            <div className="px-4 pt-4 pb-2 border-b border-[rgba(21,61,112,0.06)]">
              <p className="text-sm font-semibold text-[#1a1a2e]">Proof of Registration</p>
              <p className="text-xs text-gray-400">PDF format · Max 5MB</p>
            </div>
            <div className="p-4">
              {!uploaded ? (
                <button
                  onClick={handleUpload}
                  className="w-full border-2 border-dashed border-[rgba(21,61,112,0.2)] rounded-2xl py-8 flex flex-col items-center gap-2 hover:border-[#153D70] hover:bg-blue-50/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#F8F9FA] rounded-2xl flex items-center justify-center">
                    <Upload size={24} color="#153D70" />
                  </div>
                  <p className="text-sm font-semibold text-[#153D70]">Tap to upload PDF</p>
                  <p className="text-xs text-gray-400">or drag and drop</p>
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-xl p-3">
                  <div className="w-10 h-10 bg-[#153D70] rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={18} color="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1a1a2e] truncate">proof_of_registration_s2.pdf</p>
                    <p className="text-xs text-gray-400">2.4 MB · Just now</p>
                  </div>
                  <button onClick={() => setUploaded(false)}>
                    <X size={16} color="#9ca3af" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Departmental form */}
          <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 space-y-3">
            <p className="text-sm font-semibold text-[#1a1a2e]">Departmental Registration Form</p>
            {[
              { label: "Full Name", value: "Stephanie Awrabena Dunyo" },
              { label: "Student ID", value: "10897354" },
              { label: "Programme", value: "BSc Information Technology" },
              { label: "Level", value: "Level 300" },
              { label: "Academic Year", value: "2023/2024" },
              { label: "Semester", value: "Semester 2" },
            ].map((f) => (
              <div key={f.label} className="space-y-0.5">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {f.label}
                </label>
                <input
                  readOnly
                  value={f.value}
                  className="w-full px-3 py-2.5 bg-[#F8F9FA] rounded-xl text-sm text-[#1a1a2e] border border-transparent focus:outline-none"
                />
              </div>
            ))}
          </div>

          {/* Submit button */}
          <PrimaryButton onClick={handleSubmit} disabled={!uploaded || submitting}>
            {submitting ? "Submitting…" : "Submit for Verification"}
          </PrimaryButton>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Status card */}
          <div className={`${cfg.bg} border ${cfg.border} rounded-2xl p-5 flex flex-col items-center gap-3 text-center`}>
            <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm`}>
              {cfg.icon}
            </div>
            <div>
              <h3 className={`font-bold text-base ${cfg.color}`}>{cfg.headline}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{cfg.message}</p>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Submission details */}
          <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 space-y-3">
            <p className="text-sm font-semibold text-[#1a1a2e]">Submission Details</p>
            {[
              { label: "Reference No.", value: "DEP-2024-10897354-S2" },
              { label: "Submitted", value: "Jan 15, 2024 at 9:36am" },
              { label: "Courses", value: "6 courses · 18 credits" },
              { label: "Document", value: "proof_of_registration_s2.pdf" },
            ].map((d) => (
              <div key={d.label} className="flex justify-between items-center py-1 border-b border-[rgba(21,61,112,0.04)] last:border-0">
                <span className="text-xs text-gray-400 font-medium">{d.label}</span>
                <span className="text-xs font-semibold text-[#1a1a2e]">{d.value}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4">
            <p className="text-sm font-semibold text-[#1a1a2e] mb-4">Progress Timeline</p>
            <div className="space-y-0">
              {timeline.map((step, i) => (
                <div key={i} className="flex gap-3 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        step.done ? "bg-[#153D70]" : "bg-[#F8F9FA] border-2 border-gray-200"
                      }`}
                    >
                      {step.done && <Check size={12} color="white" />}
                    </div>
                    {i < timeline.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 min-h-[20px] ${step.done ? "bg-[#153D70]" : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                  <div className="pb-4 flex-1">
                    <p className={`text-xs font-semibold ${step.done ? "text-[#1a1a2e]" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Student — Profile tab
// ────────────────────────────────────────────────────────────────────────────
function StudentProfileTab({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void;
  onNavigate: (s: Screen) => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      {/* Hero header */}
      <div className="bg-[#153D70] pt-5 pb-14 px-5 text-center relative">
        <div className="w-20 h-20 rounded-full bg-[#BA8F4A] mx-auto flex items-center justify-center mb-3 ring-4 ring-white/20">
          <span className="text-white text-2xl font-bold">SA</span>
        </div>
        <h2 className="text-white font-bold text-base">Stephanie Awrabena Dunyo</h2>
        <p className="text-white/60 text-xs mt-0.5">BSc Information Technology · Level 300</p>
        <span className="mt-2 inline-flex items-center gap-1 bg-emerald-400/20 text-emerald-300 text-[10px] font-semibold px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          Active Student
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 -mt-8 space-y-4 pb-6">
        {/* Info card */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Student Information</p>
          {[
            { label: "Student ID", value: "10897354" },
            { label: "Email", value: "s.dunyo@st.ug.edu.gh" },
            { label: "Department", value: "Computer Science" },
            { label: "College", value: "Basic & Applied Science" },
            { label: "Academic Year", value: "2023 / 2024" },
          ].map((f) => (
            <div key={f.label} className="flex justify-between items-center py-2 border-b border-[rgba(21,61,112,0.04)] last:border-0">
              <span className="text-xs text-gray-400 font-medium">{f.label}</span>
              <span className="text-xs font-semibold text-[#1a1a2e] text-right max-w-[56%]">{f.value}</span>
            </div>
          ))}
        </div>

        {/* Settings list */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] divide-y divide-[rgba(21,61,112,0.04)] shadow-sm overflow-hidden">
          {[
            {
              icon: <Bell size={16} color="#153D70" />,
              label: "Notifications",
              sub: "Manage alerts & updates",
              badge: "3",
              screen: "notifications" as Screen,
            },
            {
              icon: <Shield size={16} color="#153D70" />,
              label: "Privacy & Security",
              sub: "Password, 2FA, sessions",
              badge: null,
              screen: "privacy" as Screen,
            },
            {
              icon: <HelpCircle size={16} color="#153D70" />,
              label: "Help & Support",
              sub: "FAQs, contact admin",
              badge: null,
              screen: "helpSupport" as Screen,
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#F8F9FA] transition-colors"
            >
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1a1a2e]">{item.label}</p>
                <p className="text-[11px] text-gray-400">{item.sub}</p>
              </div>
              {item.badge && (
                <span className="w-5 h-5 rounded-full bg-[#BA8F4A] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {item.badge}
                </span>
              )}
              <ChevronRight size={14} color="#9ca3af" className="shrink-0" />
            </button>
          ))}
        </div>

        {/* App version */}
        <p className="text-center text-[11px] text-gray-400">
          CS Dept. Registration App · v1.0.0
        </p>

        {/* Sign out */}
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-3.5 bg-red-50 text-red-600 font-semibold rounded-2xl text-sm border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        ) : (
          <div className="bg-white rounded-2xl border border-red-100 p-4 space-y-3">
            <p className="text-sm font-semibold text-[#1a1a2e] text-center">Sign out of your account?</p>
            <p className="text-xs text-gray-400 text-center">You will need to log in again to access your registration details.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-[#F8F9FA] text-[#1a1a2e] font-semibold rounded-xl text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-screen back header (reused by Notifications, Privacy, Help)
// ────────────────────────────────────────────────────────────────────────────
function SubHeader({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack: () => void }) {
  return (
    <div className="bg-[#153D70] px-5 pt-4 pb-4 shrink-0 flex items-center gap-3">
      <button onClick={onBack} className="p-2 rounded-xl bg-white/10 shrink-0">
        <ChevronRight size={18} color="white" className="rotate-180" />
      </button>
      <div>
        <h2 className="text-white font-bold text-base leading-tight">{title}</h2>
        {subtitle && <p className="text-white/60 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Notifications screen
// ────────────────────────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  {
    id: 1,
    type: "status",
    title: "Submission Received",
    body: "Your departmental registration submission has been received and is under review.",
    time: "Today · 9:36am",
    read: false,
    icon: <FileText size={16} color="#153D70" />,
    iconBg: "bg-blue-50",
  },
  {
    id: 2,
    type: "sync",
    title: "Courses Synced Successfully",
    body: "6 courses have been synced from MISWeb for Semester 2, 2023/2024.",
    time: "Today · 9:32am",
    read: false,
    icon: <RefreshCw size={16} color="#BA8F4A" />,
    iconBg: "bg-amber-50",
  },
  {
    id: 3,
    type: "reminder",
    title: "Document Upload Reminder",
    body: "You have not yet uploaded your Proof of Registration. Please do so before the deadline.",
    time: "Yesterday · 8:00am",
    read: true,
    icon: <Bell size={16} color="#153D70" />,
    iconBg: "bg-blue-50",
  },
  {
    id: 4,
    type: "system",
    title: "Welcome to CS Dept. App",
    body: "Your account has been created. Complete your profile and sync your courses to get started.",
    time: "Jan 14 · 9:00am",
    read: true,
    icon: <Info size={16} color="#6b7280" />,
    iconBg: "bg-gray-100",
  },
];

function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState(NOTIFICATIONS);
  const unreadCount = items.filter((n) => !n.read).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  const today = items.filter((n) => n.time.startsWith("Today"));
  const yesterday = items.filter((n) => n.time.startsWith("Yesterday"));
  const older = items.filter((n) => !n.time.startsWith("Today") && !n.time.startsWith("Yesterday"));

  function NotifGroup({ label, group }: { label: string; group: typeof items }) {
    if (!group.length) return null;
    return (
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">{label}</p>
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] divide-y divide-[rgba(21,61,112,0.04)] overflow-hidden shadow-sm">
          {group.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors ${
                n.read ? "bg-white" : "bg-blue-50/40"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl ${n.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm leading-tight ${n.read ? "font-medium text-[#1a1a2e]" : "font-bold text-[#1a1a2e]"}`}>
                    {n.title}
                  </p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-[#BA8F4A] shrink-0" />}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-[10px] text-gray-300 mt-1.5 font-medium">{n.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      <SubHeader title="Notifications" subtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"} onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{items.length} notifications</span>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs font-semibold text-[#153D70]">
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification toggle preferences */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Alert Preferences</p>
          {[
            { label: "Verification updates", sub: "When your status changes", on: true },
            { label: "Course sync alerts", sub: "MISWeb sync results", on: true },
            { label: "Deadline reminders", sub: "Upload & submission deadlines", on: false },
          ].map((pref, i) => (
            <ToggleRow key={i} label={pref.label} sub={pref.sub} defaultOn={pref.on} />
          ))}
        </div>

        <NotifGroup label="Today" group={today} />
        <NotifGroup label="Yesterday" group={yesterday} />
        <NotifGroup label="Earlier" group={older} />
      </div>
    </div>
  );
}

function ToggleRow({ label, sub, defaultOn }: { label: string; sub: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[rgba(21,61,112,0.04)] last:border-0">
      <div>
        <p className="text-sm font-medium text-[#1a1a2e]">{label}</p>
        <p className="text-[11px] text-gray-400">{sub}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${on ? "bg-[#153D70]" : "bg-gray-200"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Privacy & Security screen
// ────────────────────────────────────────────────────────────────────────────
function PrivacySecurityScreen({ onBack }: { onBack: () => void }) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowChangePassword(false);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    }, 1800);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      <SubHeader title="Privacy & Security" subtitle="Keep your account safe" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Password section */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] overflow-hidden shadow-sm">
          <div className="px-4 pt-4 pb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</p>
          </div>
          {!showChangePassword ? (
            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#F8F9FA] transition-colors border-t border-[rgba(21,61,112,0.04)]"
            >
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Lock size={16} color="#153D70" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1a1a2e]">Change Password</p>
                <p className="text-[11px] text-gray-400">Last changed: Never</p>
              </div>
              <ChevronRight size={14} color="#9ca3af" />
            </button>
          ) : (
            <div className="px-4 pb-4 pt-2 space-y-3 border-t border-[rgba(21,61,112,0.04)]">
              {[
                { label: "Current Password", val: currentPw, set: setCurrentPw },
                { label: "New Password", val: newPw, set: setNewPw },
                { label: "Confirm New Password", val: confirmPw, set: setConfirmPw },
              ].map((f) => (
                <div key={f.label} className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{f.label}</label>
                  <input
                    type="password"
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 bg-[#F8F9FA] rounded-xl text-sm text-[#1a1a2e] border border-transparent focus:border-[#153D70] focus:outline-none"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 py-2.5 bg-[#F8F9FA] text-[#1a1a2e] text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!currentPw || !newPw || !confirmPw}
                  className="flex-1 py-2.5 bg-[#BA8F4A] text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors"
                >
                  {saved ? "Saved ✓" : "Update"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor & Biometric */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Authentication</p>
          <ToggleRow label="Two-Factor Authentication" sub="Verify login via email code" defaultOn={false} />
          <ToggleRow label="Biometric Login" sub="Use fingerprint or Face ID" defaultOn={true} />
          <ToggleRow label="Remember this device" sub="Stay logged in for 30 days" defaultOn={true} />
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Data & Privacy</p>
          <ToggleRow label="Share usage analytics" sub="Help improve the app anonymously" defaultOn={false} />
          <div className="pt-3">
            <button className="w-full flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <FileText size={14} color="#153D70" />
                <span className="text-sm font-medium text-[#153D70]">Privacy Policy</span>
              </div>
              <ChevronRight size={13} color="#9ca3af" />
            </button>
            <button className="w-full flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <FileText size={14} color="#153D70" />
                <span className="text-sm font-medium text-[#153D70]">Terms of Use</span>
              </div>
              <ChevronRight size={13} color="#9ca3af" />
            </button>
          </div>
        </div>

        {/* Active sessions */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Active Sessions</p>
          {[
            { device: "iPhone 14 Pro", location: "Accra, Ghana", time: "Now · Current", current: true },
            { device: "Chrome · Windows", location: "Accra, Ghana", time: "Jan 13 · 2:15pm", current: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[rgba(21,61,112,0.04)] last:border-0">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Smartphone size={15} color="#153D70" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#1a1a2e]">{s.device}</p>
                <p className="text-[11px] text-gray-400">{s.location} · {s.time}</p>
              </div>
              {s.current ? (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
              ) : (
                <button className="text-[10px] font-bold text-red-500">Revoke</button>
              )}
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
          <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3">Danger Zone</p>
          <button className="w-full flex items-center gap-3 py-2">
            <Trash2 size={15} color="#dc2626" />
            <span className="text-sm font-semibold text-red-600">Delete My Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Help & Support screen
// ────────────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "How do I sync my courses from MISWeb?",
    a: "Go to the Courses tab and tap 'Sync Now'. The app will fetch your officially registered courses from the UG MISWeb portal automatically.",
  },
  {
    q: "What document do I need to upload?",
    a: "You need to upload your Proof of Registration (PDF) downloaded directly from the UG MISWeb portal. Scanned or photographed copies are not accepted.",
  },
  {
    q: "How long does verification take?",
    a: "Departmental clearance verification typically takes 1–2 working days after submission. You will receive a notification once a decision is made.",
  },
  {
    q: "My submission was rejected. What do I do?",
    a: "Check the remarks left by admin on your Status page, correct the issue (e.g. re-download your Proof of Registration), and resubmit on the Upload tab.",
  },
  {
    q: "Can I change my registered courses in this app?",
    a: "No. Course changes must be done through the official UG MISWeb portal. Once updated there, sync again in this app to reflect the changes.",
  },
  {
    q: "Who do I contact if I have a problem?",
    a: "Contact the Department of Computer Science office directly via email or phone. Details are listed in the Contact section below.",
  },
];

function HelpSupportScreen({ onBack }: { onBack: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      <SubHeader title="Help & Support" subtitle="We're here to help" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Quick contact buttons */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <Mail size={18} color="#153D70" />, label: "Email Us", sub: "cs@ug.edu.gh" },
            { icon: <Phone size={18} color="#BA8F4A" />, label: "Call Us", sub: "+233 30 213 ···" },
            { icon: <MessageSquare size={18} color="#153D70" />, label: "Live Chat", sub: "Office hours" },
          ].map((c) => (
            <button
              key={c.label}
              className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 border border-[rgba(21,61,112,0.06)] shadow-sm text-center"
            >
              <div className="w-10 h-10 bg-[#F8F9FA] rounded-xl flex items-center justify-center">{c.icon}</div>
              <p className="text-xs font-semibold text-[#1a1a2e]">{c.label}</p>
              <p className="text-[10px] text-gray-400">{c.sub}</p>
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] overflow-hidden shadow-sm">
          <div className="px-4 pt-4 pb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Frequently Asked Questions</p>
          </div>
          <div className="divide-y divide-[rgba(21,61,112,0.04)]">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start gap-3 px-4 py-3.5 text-left"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#153D70] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm font-medium text-[#1a1a2e] leading-snug">{faq.q}</p>
                  <ChevronDown
                    size={16}
                    color="#9ca3af"
                    className={`shrink-0 mt-0.5 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 -mt-1">
                    <p className="text-xs text-gray-500 leading-relaxed pl-8">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Send a message */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Send a Message</p>
          {sent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <Check size={20} color="#059669" className="mx-auto mb-1" />
              <p className="text-sm font-semibold text-emerald-700">Message sent!</p>
              <p className="text-xs text-gray-400 mt-0.5">We will get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question…"
                className="w-full px-3 py-2.5 bg-[#F8F9FA] rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 border border-transparent focus:border-[#153D70] focus:outline-none resize-none mb-3"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="w-full py-3 bg-[#BA8F4A] text-white font-semibold rounded-xl text-sm hover:bg-[#a67d3f] transition-colors disabled:opacity-50"
              >
                Send Message
              </button>
            </>
          )}
        </div>

        {/* App info */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">App Information</p>
          {[
            { label: "App Version", value: "v1.0.0" },
            { label: "Platform", value: "React Native · iOS & Android" },
            { label: "Institution", value: "University of Ghana" },
            { label: "Department", value: "Computer Science" },
          ].map((d) => (
            <div key={d.label} className="flex justify-between items-center py-1.5 border-b border-[rgba(21,61,112,0.04)] last:border-0">
              <span className="text-xs text-gray-400 font-medium">{d.label}</span>
              <span className="text-xs font-semibold text-[#1a1a2e]">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Admin — shared header
// ────────────────────────────────────────────────────────────────────────────
type AdminTab = "overview" | "submissions" | "students" | "settings";

const TREND_DATA = [
  { day: "Mon", count: 8 },
  { day: "Tue", count: 12 },
  { day: "Wed", count: 6 },
  { day: "Thu", count: 15 },
  { day: "Fri", count: 20 },
  { day: "Sat", count: 4 },
  { day: "Sun", count: 2 },
];

const ALL_STUDENTS = [
  ...SAMPLE_SUBMISSIONS,
  { id: "S006", name: "Efua Ansah", studentId: "10897601", program: "BSc Computer Science", level: "Level 200", submittedAt: "2024-01-13 10:20", status: "Approved" as VerificationStatus, courses: 5 },
  { id: "S007", name: "Nana Opoku", studentId: "10897710", program: "BSc IT", level: "Level 400", submittedAt: "2024-01-13 09:11", status: "Pending" as VerificationStatus, courses: 6 },
  { id: "S008", name: "Akua Boadu", studentId: "10897822", program: "BSc Computer Science", level: "Level 100", submittedAt: "2024-01-12 15:45", status: "Rejected" as VerificationStatus, courses: 4 },
];

function AdminTopBar({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="bg-[#153D70] px-5 pt-4 pb-4 shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#BA8F4A] text-[10px] font-bold tracking-widest uppercase">University of Ghana · CS Dept</p>
          <h2 className="text-white font-bold text-lg mt-0.5">Admin Portal</h2>
        </div>
        <div className="flex gap-2">
          <button className="relative p-2.5 rounded-xl bg-white/10">
            <Bell size={17} color="white" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#BA8F4A] rounded-full border border-[#153D70]" />
          </button>
          <button onClick={onLogout} className="p-2.5 rounded-xl bg-white/10">
            <LogOut size={17} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminTabBar({ active, onChange }: { active: AdminTab; onChange: (t: AdminTab) => void }) {
  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Dashboard", icon: <Home size={19} /> },
    { id: "submissions", label: "Submissions", icon: <FileText size={19} /> },
    { id: "students", label: "Students", icon: <Users size={19} /> },
    { id: "settings", label: "Settings", icon: <Shield size={19} /> },
  ];
  return (
    <div className="bg-white border-t border-[rgba(21,61,112,0.1)] shrink-0">
      <div className="flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5"
          >
            <span className={active === t.id ? "text-[#153D70]" : "text-gray-400"}>{t.icon}</span>
            <span className={`text-[9px] font-bold ${active === t.id ? "text-[#153D70]" : "text-gray-400"}`}>
              {t.label}
            </span>
            {active === t.id && <span className="w-4 h-0.5 bg-[#BA8F4A] rounded-full" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Overview (Dashboard) ───────────────────────────────────────────
function AdminOverviewTab() {
  const counts = {
    total: ALL_STUDENTS.length,
    pending: ALL_STUDENTS.filter((s) => s.status === "Pending").length,
    approved: ALL_STUDENTS.filter((s) => s.status === "Approved").length,
    rejected: ALL_STUDENTS.filter((s) => s.status === "Rejected").length,
  };
  const maxCount = Math.max(...TREND_DATA.map((d) => d.count));

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA] px-4 py-4 space-y-4">
      {/* Welcome banner */}
      <div className="bg-[#153D70] rounded-2xl p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/60 text-xs font-medium">Welcome back,</p>
            <p className="text-white font-bold text-base mt-0.5">Mr. K. Acheampong</p>
            <p className="text-white/50 text-xs">CS Dept. Administrator</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#BA8F4A] flex items-center justify-center">
            <span className="text-white font-bold text-base">KA</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex gap-1 items-center">
          <Clock size={12} color="#BA8F4A" />
          <span className="text-white/50 text-[11px]">Semester 2, 2023/2024 · Jan 15, 2024</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total Students", value: counts.total, color: "text-[#153D70]", bg: "bg-blue-50", sub: "Registered this semester" },
          { label: "Pending Review", value: counts.pending, color: "text-amber-600", bg: "bg-amber-50", sub: "Awaiting verification" },
          { label: "Approved", value: counts.approved, color: "text-emerald-600", bg: "bg-emerald-50", sub: "Clearance granted" },
          { label: "Rejected", value: counts.rejected, color: "text-red-600", bg: "bg-red-50", sub: "Need resubmission" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-[rgba(21,61,112,0.06)]`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-[#1a1a2e] mt-1">{s.label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Weekly submission trend bar chart */}
      <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-[#1a1a2e]">Weekly Submissions</p>
          <span className="text-[10px] font-semibold text-[#153D70] bg-blue-50 px-2 py-0.5 rounded-lg">
            This week
          </span>
        </div>
        <div className="flex items-end gap-2 h-24">
          {TREND_DATA.map((d) => {
            const heightPct = (d.count / maxCount) * 100;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-gray-400 font-medium">{d.count}</span>
                <div className="w-full flex items-end" style={{ height: "64px" }}>
                  <div
                    className="w-full rounded-t-lg bg-[#153D70] transition-all"
                    style={{ height: `${heightPct}%`, opacity: d.day === "Fri" ? 1 : 0.5 }}
                  />
                </div>
                <span className="text-[9px] text-gray-400 font-medium">{d.day}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-[rgba(21,61,112,0.04)] flex justify-between text-[11px]">
          <span className="text-gray-400">Total this week: <span className="font-bold text-[#153D70]">67</span></span>
          <span className="text-emerald-600 font-semibold">↑ 22% vs last week</span>
        </div>
      </div>

      {/* Status distribution */}
      <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
        <p className="text-sm font-bold text-[#1a1a2e] mb-3">Status Distribution</p>
        <div className="space-y-2.5">
          {[
            { label: "Approved", count: counts.approved, total: counts.total, color: "bg-emerald-500" },
            { label: "Pending", count: counts.pending, total: counts.total, color: "bg-amber-400" },
            { label: "Rejected", count: counts.rejected, total: counts.total, color: "bg-red-500" },
          ].map((row) => {
            const pct = counts.total ? Math.round((row.count / counts.total) * 100) : 0;
            return (
              <div key={row.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#1a1a2e]">{row.label}</span>
                  <span className="font-bold text-gray-500">{row.count} ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`${row.color} h-2.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
        <p className="text-sm font-bold text-[#1a1a2e] mb-3">Recent Submissions</p>
        <div className="space-y-3">
          {ALL_STUDENTS.slice(0, 4).map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#153D70] flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">
                  {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1a1a2e] truncate">{s.name}</p>
                <p className="text-[10px] text-gray-400">{s.submittedAt}</p>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Submissions tab ─────────────────────────────────────────────────
function AdminSubmissionsTab({ onReview }: { onReview: (s: Submission) => void }) {
  const [filter, setFilter] = useState<"All" | VerificationStatus>("All");
  const [search, setSearch] = useState("");

  const counts = {
    All: SAMPLE_SUBMISSIONS.length,
    Pending: SAMPLE_SUBMISSIONS.filter((s) => s.status === "Pending").length,
    Approved: SAMPLE_SUBMISSIONS.filter((s) => s.status === "Approved").length,
    Rejected: SAMPLE_SUBMISSIONS.filter((s) => s.status === "Rejected").length,
  };

  const filtered = SAMPLE_SUBMISSIONS.filter((s) => {
    const matchFilter = filter === "All" || s.status === filter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      {/* mini stats */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className="flex gap-2">
          {[
            { label: "Total", val: counts.All, color: "bg-blue-50 text-[#153D70]" },
            { label: "Pending", val: counts.Pending, color: "bg-amber-50 text-amber-700" },
            { label: "Approved", val: counts.Approved, color: "bg-emerald-50 text-emerald-700" },
            { label: "Rejected", val: counts.Rejected, color: "bg-red-50 text-red-600" },
          ].map((s) => (
            <div key={s.label} className={`flex-1 ${s.color} rounded-xl py-2 text-center border border-white`}>
              <p className="font-bold text-base">{s.val}</p>
              <p className="text-[9px] font-semibold opacity-70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or student ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 border border-[rgba(21,61,112,0.1)] focus:border-[#153D70] focus:outline-none"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2">
          {(["All", "Pending", "Approved", "Rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === f ? "bg-[#153D70] text-white" : "bg-white text-gray-500 border border-[rgba(21,61,112,0.1)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onReview(sub)}
              className="w-full bg-white rounded-2xl p-4 border border-[rgba(21,61,112,0.06)] text-left flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 bg-[#153D70] rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-bold">
                  {sub.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-[#1a1a2e] truncate">{sub.name}</p>
                  <StatusBadge status={sub.status} />
                </div>
                <p className="text-xs text-[#153D70] font-medium mt-0.5">{sub.studentId} · {sub.level}</p>
                <p className="text-xs text-gray-400 mt-1">{sub.submittedAt} · {sub.courses} courses</p>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No submissions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Students tab ────────────────────────────────────────────────────
function AdminStudentsTab() {
  const [search, setSearch] = useState("");
  const filtered = ALL_STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.includes(search) ||
    s.program.toLowerCase().includes(search.toLowerCase())
  );

  const levels = ["Level 100", "Level 200", "Level 300", "Level 400"];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      <div className="px-4 pt-4 pb-2 shrink-0 space-y-3">
        <div className="relative">
          <Search size={14} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 border border-[rgba(21,61,112,0.1)] focus:border-[#153D70] focus:outline-none"
          />
        </div>
        {/* Level breakdown mini-row */}
        <div className="flex gap-1.5">
          {levels.map((lv) => {
            const n = ALL_STUDENTS.filter((s) => s.level === lv).length;
            return (
              <div key={lv} className="flex-1 bg-white rounded-xl py-2 text-center border border-[rgba(21,61,112,0.06)]">
                <p className="text-sm font-bold text-[#153D70]">{n}</p>
                <p className="text-[9px] text-gray-400 font-semibold">{lv.replace("Level ", "Lvl ")}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl p-4 border border-[rgba(21,61,112,0.06)] flex items-center gap-3 shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-[#153D70] flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">
                {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a1a2e] truncate">{s.name}</p>
              <p className="text-[11px] text-[#153D70] font-medium mt-0.5">{s.studentId} · {s.level}</p>
              <p className="text-[11px] text-gray-400 truncate">{s.program}</p>
            </div>
            <StatusBadge status={s.status} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No students found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Admin Settings tab ────────────────────────────────────────────────────
function AdminSettingsTab({ onLogout }: { onLogout: () => void }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA] px-4 py-4 space-y-4">
      {/* Admin profile card */}
      <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-5 flex flex-col items-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#153D70] flex items-center justify-center mb-3 ring-4 ring-blue-50">
          <span className="text-white text-2xl font-bold">KA</span>
        </div>
        <p className="font-bold text-[#1a1a2e]">Dr. K. Acheampong</p>
        <p className="text-xs text-[#153D70] font-semibold mt-0.5">Department Administrator</p>
        <p className="text-[11px] text-gray-400 mt-0.5">k.acheampong@ug.edu.gh</p>
        <span className="mt-2 inline-flex items-center gap-1.5 bg-[#153D70] text-white text-[10px] font-bold px-3 py-1 rounded-full">
          <Shield size={10} />
          ADMIN ACCESS
        </span>
      </div>

      {/* Admin info */}
      <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Account Details</p>
        {[
          { label: "Staff ID", value: "STAFF-001" },
          { label: "Department", value: "Computer Science" },
          { label: "College", value: "Basic & Applied Science" },
          { label: "Access Level", value: "Full Admin" },
          { label: "Last Login", value: "Today · 8:00am" },
        ].map((f) => (
          <div key={f.label} className="flex justify-between items-center py-2 border-b border-[rgba(21,61,112,0.04)] last:border-0">
            <span className="text-xs text-gray-400 font-medium">{f.label}</span>
            <span className="text-xs font-semibold text-[#1a1a2e]">{f.value}</span>
          </div>
        ))}
      </div>

      {/* System settings */}
      <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">System Settings</p>
        <ToggleRow label="Email notifications" sub="Receive alerts for new submissions" defaultOn={true} />
        <ToggleRow label="Auto-deadline reminders" sub="Remind students 3 days before cutoff" defaultOn={true} />
        <ToggleRow label="Bulk approval mode" sub="Approve multiple submissions at once" defaultOn={false} />
      </div>

      {/* Semester info */}
      <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4 shadow-sm">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Current Semester</p>
        {[
          { label: "Semester", value: "Semester 2" },
          { label: "Academic Year", value: "2023 / 2024" },
          { label: "Submission Deadline", value: "Jan 31, 2024" },
          { label: "Verification Cutoff", value: "Feb 7, 2024" },
        ].map((f) => (
          <div key={f.label} className="flex justify-between items-center py-2 border-b border-[rgba(21,61,112,0.04)] last:border-0">
            <span className="text-xs text-gray-400 font-medium">{f.label}</span>
            <span className="text-xs font-semibold text-[#1a1a2e]">{f.value}</span>
          </div>
        ))}
      </div>

      {/* Sign out */}
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full py-3.5 bg-red-50 text-red-600 font-semibold rounded-2xl text-sm border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      ) : (
        <div className="bg-white rounded-2xl border border-red-100 p-4 space-y-3">
          <p className="text-sm font-semibold text-[#1a1a2e] text-center">Sign out of Admin Portal?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 bg-[#F8F9FA] text-[#1a1a2e] font-semibold rounded-xl text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onLogout}
              className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-1.5"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-[11px] text-gray-400 pb-2">CS Dept. Registration App · v1.0.0 · Admin Build</p>
    </div>
  );
}

// ─── Admin Dashboard shell ─────────────────────────────────────────────────
function AdminDashboard({
  onReview,
  onLogout,
}: {
  onReview: (s: Submission) => void;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<AdminTab>("overview");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      <AdminTopBar onLogout={onLogout} />

      {/* Tab label strip */}
      <div className="bg-[#153D70] px-5 pb-3 shrink-0">
        <p className="text-white/50 text-xs font-medium capitalize">
          {tab === "overview" ? "Analytics & Overview" :
           tab === "submissions" ? "All Submissions" :
           tab === "students" ? "Student Directory" : "System Settings"}
        </p>
      </div>

      {tab === "overview" && <AdminOverviewTab />}
      {tab === "submissions" && <AdminSubmissionsTab onReview={onReview} />}
      {tab === "students" && <AdminStudentsTab />}
      {tab === "settings" && <AdminSettingsTab onLogout={onLogout} />}

      <AdminTabBar active={tab} onChange={setTab} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Admin — Review submission
// ────────────────────────────────────────────────────────────────────────────
function AdminReviewScreen({
  submission,
  onBack,
}: {
  submission: Submission;
  onBack: () => void;
}) {
  const [status, setStatus] = useState<VerificationStatus>(submission.status);
  const [saving, setSaving] = useState(false);

  function handleDecision(decision: "Approved" | "Rejected") {
    setSaving(true);
    setTimeout(() => {
      setStatus(decision);
      setSaving(false);
    }, 800);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      <div className="bg-[#153D70] px-5 pt-4 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-white/10">
            <ChevronRight size={18} color="white" className="rotate-180" />
          </button>
          <div>
            <h2 className="text-white font-bold text-base">Review Submission</h2>
            <p className="text-white/60 text-xs">ID: DEP-2024-{submission.studentId}-S2</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Status banner */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[rgba(21,61,112,0.06)]">
          <div>
            <p className="text-xs text-gray-400 font-medium">Current Status</p>
            <div className="mt-1"><StatusBadge status={status} /></div>
          </div>
          <p className="text-xs text-gray-400">{submission.submittedAt}</p>
        </div>

        {/* Student info */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#153D70] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base">
                {submission.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="font-bold text-[#1a1a2e] text-sm">{submission.name}</p>
              <p className="text-xs text-[#153D70] font-medium">{submission.studentId}</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: "Programme", value: submission.program },
              { label: "Level", value: submission.level },
              { label: "Courses Registered", value: `${submission.courses} courses` },
            ].map((d) => (
              <div key={d.label} className="flex justify-between items-center py-1 border-b border-[rgba(21,61,112,0.04)] last:border-0">
                <span className="text-xs text-gray-400 font-medium">{d.label}</span>
                <span className="text-xs font-semibold text-[#1a1a2e]">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Document preview */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4">
          <p className="text-sm font-semibold text-[#1a1a2e] mb-3">Uploaded Document</p>
          <div className="bg-[#F8F9FA] rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#153D70] rounded-xl flex items-center justify-center shrink-0">
              <FileText size={18} color="white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#1a1a2e]">proof_of_registration_s2.pdf</p>
              <p className="text-[10px] text-gray-400 mt-0.5">2.4 MB · Uploaded {submission.submittedAt}</p>
            </div>
            <button className="p-2 rounded-lg bg-[#153D70]/10">
              <Eye size={14} color="#153D70" />
            </button>
          </div>
        </div>

        {/* Courses list */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4">
          <p className="text-sm font-semibold text-[#1a1a2e] mb-3">Synced Courses</p>
          <div className="space-y-2">
            {SAMPLE_COURSES.slice(0, submission.courses).map((c, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[rgba(21,61,112,0.04)] last:border-0">
                <Check size={12} color="#059669" className="shrink-0" />
                <span className="text-xs font-medium text-[#153D70]">{c.code}</span>
                <span className="text-xs text-gray-500 truncate flex-1">{c.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Remarks */}
        <div className="bg-white rounded-2xl border border-[rgba(21,61,112,0.06)] p-4">
          <p className="text-sm font-semibold text-[#1a1a2e] mb-2">Remarks (optional)</p>
          <textarea
            rows={3}
            placeholder="Add notes for the student…"
            className="w-full px-3 py-2.5 bg-[#F8F9FA] rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 border border-transparent focus:border-[#153D70] focus:outline-none resize-none"
          />
        </div>

        {/* Action buttons */}
        {status === "Pending" && (
          <div className="flex gap-3 pb-2">
            <button
              onClick={() => handleDecision("Rejected")}
              disabled={saving}
              className="flex-1 py-3.5 bg-red-50 text-red-600 font-semibold rounded-2xl text-sm border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <X size={16} />
              Reject
            </button>
            <button
              onClick={() => handleDecision("Approved")}
              disabled={saving}
              className="flex-1 py-3.5 bg-[#BA8F4A] text-white font-semibold rounded-2xl text-sm hover:bg-[#a67d3f] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check size={16} />
              {saving ? "Saving…" : "Approve"}
            </button>
          </div>
        )}
        {status !== "Pending" && (
          <div className={`rounded-2xl p-4 text-center ${status === "Approved" ? "bg-emerald-50" : "bg-red-50"}`}>
            <p className={`text-sm font-semibold ${status === "Approved" ? "text-emerald-700" : "text-red-600"}`}>
              Submission {status}
            </p>
            <p className="text-xs text-gray-500 mt-1">Decision recorded and student notified.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Root app
// ────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [studentTab, setStudentTab] = useState<StudentTab>("home");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Screens that sit "above" the student tab shell (no tab bar)
  const subScreens: Screen[] = ["notifications", "privacy", "helpSupport", "courseDetails"];
  const isSubScreen = subScreens.includes(screen);

  // Student tab shell screens
  const studentTabScreens: Screen[] = [
    "studentHome", "studentCourses", "studentRegistration", "studentProfile",
  ];
  const isStudentTabScreen = studentTabScreens.includes(screen) || isSubScreen;

  function renderInner() {
    switch (screen) {
      case "splash":
        return <SplashScreen onDone={() => setScreen("login")} />;

      case "login":
        return (
          <LoginScreen
            onStudentLogin={() => { setStudentTab("home"); setScreen("studentHome"); }}
            onAdminLogin={() => setScreen("adminDashboard")}
          />
        );

      case "notifications":
        return <NotificationsScreen onBack={() => setScreen("studentProfile")} />;

      case "privacy":
        return <PrivacySecurityScreen onBack={() => setScreen("studentProfile")} />;

      case "helpSupport":
        return <HelpSupportScreen onBack={() => setScreen("studentProfile")} />;

      case "courseDetails":
        return selectedCourse ? (
          <CourseDetailsScreen
            course={selectedCourse}
            onBack={() => {
              setScreen("studentCourses");
              setStudentTab("courses");
            }}
          />
        ) : null;

      case "studentHome":
      case "studentCourses":
      case "studentRegistration":
      case "studentProfile":
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            {studentTab === "home" && <StudentHomeTab onTabChange={(t) => setStudentTab(t)} />}
            {studentTab === "courses" && (
              <StudentCoursesTab
                onCourseClick={(course) => {
                  setSelectedCourse(course);
                  setScreen("courseDetails");
                }}
              />
            )}
            {studentTab === "registration" && <StudentRegistrationTab />}
            {studentTab === "profile" && (
              <StudentProfileTab
                onLogout={() => setScreen("login")}
                onNavigate={(s) => setScreen(s)}
              />
            )}
            <StudentTabBar
              active={studentTab}
              onChange={(t) => {
                setStudentTab(t);
                setScreen(`student${t.charAt(0).toUpperCase() + t.slice(1)}` as Screen);
              }}
            />
          </div>
        );

      case "adminDashboard":
        return (
          <AdminDashboard
            onReview={(s) => { setSelectedSubmission(s); setScreen("adminReview"); }}
            onLogout={() => setScreen("login")}
          />
        );

      case "adminReview":
        return selectedSubmission ? (
          <AdminReviewScreen
            submission={selectedSubmission}
            onBack={() => setScreen("adminDashboard")}
          />
        ) : null;

      default:
        return null;
    }
  }

  return <PhoneFrame>{renderInner()}</PhoneFrame>;
}
