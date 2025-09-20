"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { getVolunteerRequests, getUserById, makeVolunteer } from '../../../actions/admin';

// Type definitions for clarity
interface VolunteerRequest {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  requestedAt: Date;
  reason: string;
}

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

const VolunteerUI = () => {
  const [volunteerRequests, setVolunteerRequests] = useState<VolunteerRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });

  // In a real app, the token would come from your auth context/provider
   const token = localStorage.getItem("token") || "";

  const fetchAndCombineData = useCallback(async () => {
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

  useEffect(() => {
    fetchAndCombineData();
  }, [fetchAndCombineData]);

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

    } catch (error: any) {
      console.error(`Failed to make ${studentName} a volunteer`, error);
      setMessage({ type: 'error', text: error.message || `An error occurred while approving ${studentName}.` });
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Management</h1>
        </div>
        <p className="text-gray-600">Review and approve volunteer applications from students</p>
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

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Pending Volunteer Requests</h2>
              <p className="text-sm text-gray-600 mt-1">
                {loading ? 'Loading...' : `${volunteerRequests.length} pending requests`}
              </p>
            </div>
            <button
              onClick={fetchAndCombineData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Volunteer Requests List */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading volunteer requests...</p>
            </div>
          ) : error ? (
             <div className="p-8 text-center text-red-600">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Data</h3>
                <p>{error}</p>
            </div>
          ) : volunteerRequests.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
              <p className="text-gray-600">There are currently no volunteer requests to review.</p>
            </div>
          ) : (
            volunteerRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.studentName}</h3>
                        <p className="text-sm text-gray-600">{request.email}</p>
                      </div>
                    </div>
                    
                    <div className="ml-13 mb-3 pl-1">
                        <p className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">Reason for volunteering:</span>
                        </p>
                        <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg border">
                            "{request.reason}"
                        </p>
                    </div>
                    
                    <div className="ml-13 pl-1">
                      <p className="text-xs text-gray-500">
                        Requested on {formatDate(request.requestedAt)}
                      </p>
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
            ))
          )}
        </div>
      </div>

       {/* Info Section */}
       <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                    <h4 className="font-medium text-blue-900 mb-1">About Volunteer Approval</h4>
                    <p className="text-sm text-blue-800">
                        When you approve a volunteer request, the student will be granted volunteer status and removed from the pending requests list. 
                        They will then have access to volunteer-specific features and responsibilities within the platform.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default VolunteerUI;

