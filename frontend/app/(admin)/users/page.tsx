"use client"
import { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  Mail,
  Phone,
  ArrowLeft,
  Calendar,
  Clock,
  AlertTriangle,
  TrendingUp,
  Brain,
  Heart,
  Moon,
  Utensils,
  GraduationCap,
  Users,
  ChevronRight,
  BookOpen,
  Activity,
  Star
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  contact?: string;
}

interface PHQ {
  id: string;
  studentId: string;
  score: number;
  organizationId: string;
  takenOn: string;
}

interface SessionBooking {
  id: string;
  studentId: string;
  sessionType: string;
  reason: string;
  mode: string;
  urgency: string;
  preferredDate: string;
  preferredTime: string;
  additionalNotes: string;
  status: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

interface JournalTrend {
  date: string;
  mood_disturbance: number;
  sleep_disruption: number;
  appetite_issues: number;
  academic_disengagement: number;
  social_withdrawal: number;
}

interface JournalSummary {
  parameter: string;
  avg: number;
}

interface StudentDetail {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    emergencyContact: string | null;
    emergencyContactPerson: string | null;
    phqs: PHQ[];
    gads: any[];
    pss: any[];
    sessionBookings: SessionBooking[];
  };
  journalReport: {
    trend: JournalTrend[];
    summary: JournalSummary[];
  };
}

const StudentManagementSystem = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Mock data for demonstration
  const mockUsers: User[] = [
    { id: "dcdbbb35-f484-4e06-9733-1050b5899028", name: "student_IEM", email: "studentiem@gmail.com", role: "student", contact: "+91 9876543210" },
    { id: "2", name: "John Doe", email: "john.doe@example.com", role: "student", contact: "+91 9876543211" },
    { id: "3", name: "Jane Smith", email: "jane.smith@example.com", role: "student", contact: "+91 9876543212" },
  ];

  const mockStudentDetail: StudentDetail = {
    "user": {
      "id": "dcdbbb35-f484-4e06-9733-1050b5899028",
      "name": "student_IEM",
      "email": "studentiem@gmail.com",
      "role": "student",
      "emergencyContact": null,
      "emergencyContactPerson": null,
      "phqs": [
        {
          "id": "95979328-89ce-4e65-8654-693ec30655a9",
          "studentId": "dcdbbb35-f484-4e06-9733-1050b5899028",
          "score": 13,
          "organizationId": "dc3aa021-214a-46bb-8d9a-7f96b6f90112",
          "takenOn": "2025-09-12T15:38:41.395Z"
        }
      ],
      "gads": [],
      "pss": [],
      "sessionBookings": [
        {
          "id": "498abf2b-cd61-463f-a19b-37653b83500a",
          "studentId": "dcdbbb35-f484-4e06-9733-1050b5899028",
          "sessionType": "career-guidance",
          "reason": "fds",
          "mode": "physical",
          "urgency": "priority",
          "preferredDate": "2025-10-02",
          "preferredTime": "14:00:00",
          "additionalNotes": "fsdfs",
          "status": "pending",
          "organizationId": "dc3aa021-214a-46bb-8d9a-7f96b6f90112",
          "createdAt": "2025-09-12T22:26:50.030Z",
          "updatedAt": "2025-09-12T22:26:50.030Z"
        }
      ]
    },
    "journalReport": {
      "trend": [
        {
          "date": "2025-09-10",
          "mood_disturbance": 2.5,
          "sleep_disruption": 4,
          "appetite_issues": 4,
          "academic_disengagement": 3,
          "social_withdrawal": 6
        },
        {
          "date": "2025-09-11",
          "mood_disturbance": 2.5,
          "sleep_disruption": 4,
          "appetite_issues": 4,
          "academic_disengagement": 3,
          "social_withdrawal": 6
        }
      ],
      "summary": [
        {
          "parameter": "Mood Disturbance",
          "avg": 2.5
        },
        {
          "parameter": "Sleep Disruption",
          "avg": 4
        },
        {
          "parameter": "Appetite Issues",
          "avg": 4
        },
        {
          "parameter": "Academic Disengagement",
          "avg": 3
        },
        {
          "parameter": "Social Withdrawal",
          "avg": 6
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    setUsers(mockUsers);
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string): string => {
    if (!name) return "";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase();
  };

  const handleUserClick = async (userId: string) => {
    setIsLoadingDetail(true);
    // Simulate API call
    setTimeout(() => {
      if (userId === "dcdbbb35-f484-4e06-9733-1050b5899028") {
        setSelectedStudent(mockStudentDetail);
      }
      setIsLoadingDetail(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'priority': return 'text-red-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPHQSeverity = (score: number) => {
    if (score <= 4) return { level: 'Minimal', color: 'text-green-600', bg: 'bg-green-100' };
    if (score <= 9) return { level: 'Mild', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score <= 14) return { level: 'Moderate', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (score <= 19) return { level: 'Moderately Severe', color: 'text-red-600', bg: 'bg-red-100' };
    return { level: 'Severe', color: 'text-red-800', bg: 'bg-red-200' };
  };

  const getParameterIcon = (parameter: string) => {
    switch (parameter.toLowerCase()) {
      case 'mood disturbance': return <Heart className="h-4 w-4" />;
      case 'sleep disruption': return <Moon className="h-4 w-4" />;
      case 'appetite issues': return <Utensils className="h-4 w-4" />;
      case 'academic disengagement': return <GraduationCap className="h-4 w-4" />;
      case 'social withdrawal': return <Users className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  // Prepare radar chart data
  const radarData = selectedStudent?.journalReport.summary.map(item => ({
    parameter: item.parameter.replace(' ', '\n'),
    value: item.avg,
    fullMark: 10
  })) || [];

  if (selectedStudent) {
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedStudent(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Student Profile
              </h2>
              <p className="text-slate-600 mt-1">Detailed view of {selectedStudent.user.name}'s information and progress</p>
            </div>
          </div>
        </div>

        {isLoadingDetail ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Loading student details...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                    <span className="text-white font-bold text-xl">{getInitials(selectedStudent.user.name)}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedStudent.user.name}</h3>
                  <p className="text-slate-600">{selectedStudent.user.email}</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mt-2 capitalize">
                    {selectedStudent.user.role}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="h-4 w-4 mr-3" />
                    <span>{selectedStudent.user.email}</span>
                  </div>
                  
                  {selectedStudent.user.emergencyContact && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Phone className="h-4 w-4 mr-3" />
                      <span>{selectedStudent.user.emergencyContact}</span>
                    </div>
                  )}
                  
                  {selectedStudent.user.emergencyContactPerson && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Users className="h-4 w-4 mr-3" />
                      <span>Emergency Contact: {selectedStudent.user.emergencyContactPerson}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* PHQ-9 Scores */}
              <div className="mt-6 bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  PHQ-9 Assessment
                </h4>
                {selectedStudent.user.phqs.length > 0 ? (
                  <div className="space-y-3">
                    {selectedStudent.user.phqs.map((phq) => {
                      const severity = getPHQSeverity(phq.score);
                      return (
                        <div key={phq.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-2xl font-bold text-slate-900">{phq.score}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${severity.bg} ${severity.color}`}>
                              {severity.level}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">
                            Taken on {formatDate(phq.takenOn)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No PHQ-9 assessments available</p>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Journal Analytics */}
              <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Wellness Trends
                </h4>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Line Chart */}
                  <div>
                    <h5 className="text-md font-medium text-slate-700 mb-3">Progress Over Time</h5>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={selectedStudent.journalReport.trend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="mood_disturbance" stroke="#ef4444" strokeWidth={2} name="Mood" />
                        <Line type="monotone" dataKey="sleep_disruption" stroke="#3b82f6" strokeWidth={2} name="Sleep" />
                        <Line type="monotone" dataKey="social_withdrawal" stroke="#8b5cf6" strokeWidth={2} name="Social" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Radar Chart */}
                  <div>
                    <h5 className="text-md font-medium text-slate-700 mb-3">Current Status Overview</h5>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="parameter" tick={{fontSize: 10}} />
                        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{fontSize: 10}} />
                        <Radar name="Current Level" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
                  {selectedStudent.journalReport.summary.map((item) => (
                    <div key={item.parameter} className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        {getParameterIcon(item.parameter)}
                        <span className="text-lg font-bold text-slate-900">{item.avg}</span>
                      </div>
                      <p className="text-xs text-slate-600">{item.parameter}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Bookings */}
              <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Session Bookings
                </h4>
                {selectedStudent.user.sessionBookings.length > 0 ? (
                  <div className="space-y-4">
                    {selectedStudent.user.sessionBookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-semibold text-slate-900 capitalize">
                              {booking.sessionType.replace('-', ' ')}
                            </h5>
                            <p className="text-sm text-slate-600">{booking.reason}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            <span className={`flex items-center text-xs ${getUrgencyColor(booking.urgency)}`}>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {booking.urgency}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-slate-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(booking.preferredDate)}
                          </div>
                          <div className="flex items-center text-slate-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {formatTime(booking.preferredTime)}
                          </div>
                          <div className="flex items-center text-slate-600">
                            <Users className="h-4 w-4 mr-2" />
                            {booking.mode}
                          </div>
                          <div className="flex items-center text-slate-600">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Booked on {formatDate(booking.createdAt)}
                          </div>
                        </div>
                        
                        {booking.additionalNotes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-slate-700">
                              <strong>Notes:</strong> {booking.additionalNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No session bookings found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main users list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Student Management
          </h2>
          <p className="text-slate-600 mt-1">Manage platform students and their access permissions</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-2xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white/80"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-3 border rounded-xl transition-all duration-200 ${
              showFilters
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>

        {searchTerm && (
          <div className="text-sm text-slate-600">
            Found {filteredUsers.length} student{filteredUsers.length !== 1 ? 's' : ''} matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading students...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User Information</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                  <th className="px-8 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/80 divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/50 transition-colors duration-200 group cursor-pointer" onClick={() => handleUserClick(user.id)}>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <span className="text-white font-bold text-sm">{getInitials(user.name)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500 flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm text-slate-600 flex items-center">
                        <Phone className="h-3 w-3 mr-2" />
                        {user.contact || 'Not provided'}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-3">
                        <button 
                          className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-2">
                <Search className="h-12 w-12 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No students found</h3>
              <p className="text-slate-500">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-sm text-slate-600 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
        <div>
          Showing {filteredUsers.length} of {users.length} students
        </div>
        <div className="flex items-center space-x-4">
          <span>Total: {users.length} students</span>
          <span>•</span>
          <span>Active searches: {searchTerm ? 1 : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentManagementSystem;