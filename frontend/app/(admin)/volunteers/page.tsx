"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserCheck, AlertCircle, CheckCircle, List } from 'lucide-react';
import { getVolunteerRequests, getUserById, makeVolunteer, getAdminVolunteers } from '../../../actions/admin';

// Type definitions for clarity
interface VolunteerRequest {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  requestedAt: Date;
  reason: string;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
}

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

const VolunteerUI = () => {
  const [volunteerRequests, setVolunteerRequests] = useState<VolunteerRequest[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [activeView, setActiveView] = useState<'requests' | 'volunteers'>('requests');

  const token = typeof window !== 'undefined' ? localStorage.getItem("token") || "" : "";

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }
    try {
      const requestsResponse = await getVolunteerRequests(token);
      if (!requestsResponse.ok || !requestsResponse.data) {
        throw new Error(requestsResponse.error || 'Failed to fetch volunteer requests.');
      }
      const initialRequests = requestsResponse.data;

      const detailedRequestsPromises = initialRequests.map(async (request: any) => {
        const userDetailsResponse = await getUserById(token, request.studentId);
        if (userDetailsResponse.ok && userDetailsResponse.data) {
          return {
            id: request.id,
            studentId: request.studentId,
            reason: request.reason,
            requestedAt: new Date(request.requestedAt),
            studentName: userDetailsResponse.data.user.name,
            email: userDetailsResponse.data.user.email,
          };
        }
        console.warn(`Could not fetch details for student ID: ${request.studentId}`);
        return null;
      });

      const combinedData = (await Promise.all(detailedRequestsPromises)).filter(Boolean) as VolunteerRequest[];
      setVolunteerRequests(combinedData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchVolunteers = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }
    try {
      const response = await getAdminVolunteers(token);
      if (!response.ok) {
        throw new Error(response.error || 'Failed to fetch volunteers.');
      }
      setVolunteers(response.data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeView === 'requests') {
      fetchRequests();
    } else {
      fetchVolunteers();
    }
  }, [activeView, fetchRequests, fetchVolunteers]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const handleMakeVolunteer = async (studentId: string, studentName: string): Promise<void> => {
    if (!token) {
      setMessage({ type: 'error', text: 'Authentication token not found. Please log in.' });
      return;
    }
    setProcessingId(studentId);
    try {
      const response = await makeVolunteer(token, studentId);

      if (!response.ok) {
        throw new Error(response.error || `Failed to make ${studentName} a volunteer`);
      }
      
      setVolunteerRequests(prev => prev.filter(req => req.studentId !== studentId));
      setMessage({ type: 'success', text: `${studentName} has been successfully made a volunteer!` });
      fetchRequests();
      fetchVolunteers();
    } catch (error: any) {
      console.error(`Failed to make ${studentName} a volunteer`, error);
      setMessage({ type: 'error', text: error.message || `An error occurred while approving ${studentName}.` });
    } finally {
      setProcessingId(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {activeView === 'requests' ? 'volunteer requests' : 'volunteers'}...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 text-center text-red-600">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Data</h3>
          <p>{error}</p>
        </div>
      );
    }

    if (activeView === 'requests') {
      return volunteerRequests.length === 0 ? (
        <div className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
          <p className="text-gray-600">There are currently no volunteer requests to review.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {volunteerRequests.map((request) => (
            <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.studentName}</h3>
                      <p className="text-sm text-gray-600">{request.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6">
                  <button
                    onClick={() => handleMakeVolunteer(request.studentId, request.studentName)}
                    disabled={processingId === request.studentId}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingId === request.studentId ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Approve as Volunteer
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeView === 'volunteers') {
      return volunteers.length === 0 ? (
        <div className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Volunteers Found</h3>
          <p className="text-gray-600">There are currently no approved volunteers.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 p-4 bg-gray-100 font-semibold text-gray-700">
            <span className="col-span-2">Name</span>
            <span className="hidden sm:block">Email</span>
          </div>
          {volunteers.map((volunteer) => (
            <div key={volunteer.id} className="p-4 grid grid-cols-2 sm:grid-cols-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 col-span-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">{volunteer.name}</span>
              </div>
              <span className="text-gray-600 hidden sm:block truncate">{volunteer.email}</span>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Management</h1>
        </div>
        <p className="text-gray-600">Manage volunteer applications and view approved volunteers.</p>
      </div>
      
      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* View Toggles */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setActiveView('requests')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeView === 'requests' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          Pending Requests
          {volunteerRequests.length > 0 && activeView === 'requests' && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold">{volunteerRequests.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveView('volunteers')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeView === 'volunteers' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          <List className="w-5 h-5" />
          Approved Volunteers
          {volunteers.length > 0 && activeView === 'volunteers' && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold">{volunteers.length}</span>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {activeView === 'requests' ? 'Pending Volunteer Requests' : 'Approved Volunteers'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {loading 
                  ? 'Loading...' 
                  : activeView === 'requests' 
                  ? `${volunteerRequests.length} pending requests` 
                  : `${volunteers.length} approved volunteers`}
              </p>
            </div>
            <button
              onClick={() => {
                if (activeView === 'requests') {
                  fetchRequests();
                } else {
                  fetchVolunteers();
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        {renderContent()}
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">About Volunteer Management</h4>
            <p className="text-sm text-blue-800">
              Use the tabs above to switch between pending volunteer requests that you can approve and a list of all current approved volunteers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerUI;