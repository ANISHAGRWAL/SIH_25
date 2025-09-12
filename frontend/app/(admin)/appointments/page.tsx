"use client"

import { useState, useEffect } from "react";
import { Calendar, Clock, User, MapPin, AlertTriangle, FileText, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getAdminSessions } from "../../../actions/admin";

// Define a type for your appointment data
interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  sessionType: string;
  reason: string;
  mode: "physical" | "virtual";
  urgency: "routine" | "high" | "medium";
  preferredDate: string;
  preferredTime: string;
  additionalNotes: string | null;
  status: "pending" | "confirmed" | "completed";
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
  }
}

const AppointmentsPage = () => {
  const [selectedStudent, setSelectedStudent] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) {
        setError("Unauthorized. Please log in as an administrator.");
        setLoading(false);
        return;
      }
      try {
        const res = await getAdminSessions(token);
        if (res.ok) {
          setAppointments(res.data);
        } else {
          setError(res.error || "Failed to load appointments.");
          toast.error(res.error || "Failed to load appointments.");
        }
      } catch (err: any) {
        console.error("Appointments fetch error:", err);
        setError(err.message || "An unexpected error occurred.");
        toast.error(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: Appointment['urgency']) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'routine': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getSessionTypeLabel = (type: string): string => {
    switch (type) {
      case 'crisis-support': return 'Crisis Support';
      case 'academic-support': return 'Academic Support';
      case 'personal-counseling': return 'Personal Counseling';
      default: return type.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    }
  };

  // Helper function to get student name consistently
  const getStudentName = (appointment: Appointment): string => {
    return appointment.studentName || appointment.user?.name || 'Unknown Student';
  };

  if (loading) {
    return (
      <div className="text-center text-slate-600 mt-20 text-lg">
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20 text-lg">
        Error: {error}
      </div>
    );
  }

  if (selectedStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSelectedStudent(null)}
            className="flex items-center space-x-2 mb-6 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Sessions</span>
          </button>

          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 md:px-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {getStudentName(selectedStudent)}
                  </h1>
                  <p className="text-blue-100">Session Details & Information</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedStudent.status)}`}>
                    {selectedStudent.status.charAt(0).toUpperCase() + selectedStudent.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Session Information */}
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Session Information</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-slate-700">Session Type</div>
                          <div className="text-slate-900">{getSessionTypeLabel(selectedStudent.sessionType)}</div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-slate-700">Date & Time</div>
                          <div className="text-slate-900">
                            {new Date(selectedStudent.preferredDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="text-slate-600">{formatTime(selectedStudent.preferredTime)}</div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-slate-700">Mode</div>
                          <div className="text-slate-900 capitalize">{selectedStudent.mode}</div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${getUrgencyColor(selectedStudent.urgency)}`} />
                        <div>
                          <div className="text-sm font-medium text-slate-700">Urgency Level</div>
                          <div className={`font-medium capitalize ${getUrgencyColor(selectedStudent.urgency)}`}>
                            {selectedStudent.urgency}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details & Notes */}
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Details & Notes</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-slate-700 mb-2">Reason for Session</div>
                        <div className="text-slate-900 bg-white p-3 rounded-lg border">
                          {selectedStudent.reason}
                        </div>
                      </div>

                      {selectedStudent.additionalNotes && (
                        <div>
                          <div className="text-sm font-medium text-slate-700 mb-2">Additional Notes</div>
                          <div className="text-slate-900 bg-white p-3 rounded-lg border">
                            {selectedStudent.additionalNotes}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-200">
                        <div className="text-sm font-medium text-slate-700 mb-2">Session Timeline</div>
                        <div className="space-y-2 text-sm text-slate-600">
                          <div>Created: {new Date(selectedStudent.createdAt).toLocaleDateString()}</div>
                          <div>Last Updated: {new Date(selectedStudent.updatedAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                    Mark as Completed
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                    Reschedule
                  </button>
                  <button className="flex-1 border border-red-300 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all duration-200">
                    Cancel Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">All Scheduled Sessions</h2>
          <p className="text-slate-600 text-lg">Manage all your counseling sessions, past and present</p>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-3xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                All Sessions
              </h3>
              <div className="text-sm text-slate-500">
                {appointments.length} total sessions
              </div>
            </div>

            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  onClick={() => setSelectedStudent(appointment)}
                  className="group cursor-pointer bg-slate-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 p-4 md:p-6 rounded-2xl border border-transparent hover:border-blue-200 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-12 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-1 md:space-y-0">
                          <div className="font-semibold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                            {new Date(appointment.preferredDate).toLocaleDateString()} at {formatTime(appointment.preferredTime)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600 font-medium">{getStudentName(appointment)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-500">{getSessionTypeLabel(appointment.sessionType)}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                          {appointment.reason}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 md:flex-shrink-0">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                      <span className={`text-xs font-medium ${getUrgencyColor(appointment.urgency)}`}>
                        {appointment.urgency.toUpperCase()}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-blue-400 transition-colors"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {appointments.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No sessions scheduled</h3>
                <p className="text-slate-500">You have no appointments to display.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
