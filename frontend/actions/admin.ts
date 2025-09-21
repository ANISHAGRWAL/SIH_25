import { IAuthUser } from "../../backend/src/types";

const BASE_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || "http://localhost:5000/api";

// New function to fetch all students
export const getAdminStudents = async (
  token: string
): Promise<{
  ok: boolean;
  status?: number;
  data?: IAuthUser[] | any;
  error?: string;
}> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/students`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch students");
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result.data || [],
    };
  } catch (error: any) {
    console.error("Error fetching students:", error);
    return {
      ok: false,
      status: 500,
      error: error.message || "Failed to fetch students. Please try again.",
    };
  }
};

// ... (other functions remain the same)
// Note: We are not changing getStudentsCount as it returns a count, not the full list.

export const getStudentsCount = async (
  token: string
): Promise<{ ok: boolean; status?: number; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/students`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch student count");
    }

    const count = result.data ? result.data.length : 0;

    return {
      ok: response.ok,
      status: response.status,
      data: { count },
    };
  } catch (error: any) {
    console.error("Error fetching students count:", error);
    return {
      ok: false,
      status: 500,
      error:
        error.message || "Failed to fetch student count. Please try again.",
    };
  }
};

export const getTestAverages = async (
  token: string
): Promise<{ ok: boolean; status?: number; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/test`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch test averages");
    }

    const data = result.data || {};

    return {
      ok: response.ok,
      status: response.status,
      data: data,
    };
  } catch (error: any) {
    console.error("Error fetching test averages:", error);
    return {
      ok: false,
      status: 500,
      error:
        error.message || "Failed to fetch test averages. Please try again.",
    };
  }
};

export const getSessionsCount = async (
  token: string
): Promise<{ ok: boolean; status?: number; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/sessions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch session count");
    }

    const count = result.data ? result.data.length : 0;

    return {
      ok: response.ok,
      status: response.status,
      data: { count },
    };
  } catch (error: any) {
    console.error("Error fetching sessions count:", error);
    return {
      ok: false,
      status: 500,
      error:
        error.message || "Failed to fetch session count. Please try again.",
    };
  }
};

export const getAdminSessions = async (
  token: string
): Promise<{ ok: boolean; status?: number; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/sessions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch sessions");
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result.data || [],
    };
  } catch (error: any) {
    console.error("Error fetching sessions:", error);
    return {
      ok: false,
      status: 500,
      error: error.message || "Failed to fetch sessions. Please try again.",
    };
  }
};

export const getUsers = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/students`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch student count");
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result.data || [],
    };
  } catch (error: any) {
    console.error("Error fetching students count:", error);
    return {
      ok: false,
      status: 500,
      error:
        error.message || "Failed to fetch student count. Please try again.",
    };
  }
};

export const getUserById = async (token: string, id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/user?userId=${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch student");
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result.data || null,
    };
  } catch (error: any) {
    console.error("Error fetching student:", error);
    return {
      ok: false,
      status: 500,
      error: error.message || "Failed to fetch student. Please try again.",
    };
  }
};


// Fetch volunteer requests
export async function getVolunteerRequests(token: string) {
  const res = await fetch(`${BASE_URL}/admin/wants-to-volunteer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return { ok: res.ok, data: data.data, error: data.error?.message };
}

// New function to approve a volunteer
export const makeVolunteer = async (
  token: string,
  studentId: string
): Promise<{ ok: boolean; status?: number; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/volunteer`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ studentId }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to approve volunteer");
    }
    return { ok: true, status: response.status, data: result.data };
  } catch (error: any) {
    return { ok: false, status: 500, error: error.message };
  }
};


export const getAdminVolunteers = async (
  token: string
): Promise<{ ok: boolean; status?: number; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/volunteers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch volunteers");
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result.data || [],
    };
  } catch (error: any) {
    console.error("Error fetching volunteers:", error);
    return {
      ok: false,
      status: 500,
      error: error.message || "Failed to fetch volunteers. Please try again.",
    };
  }
};