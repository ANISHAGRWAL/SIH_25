import { IAuthUser } from "../../backend/src/types"; 

const BASE_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || "http://localhost:5000/api";

export const getStudentsCount = async (token: string): Promise<{ ok: boolean; status?: number; data?: any; error?: string }> => {
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
      error: error.message || "Failed to fetch student count. Please try again.",
    };
  }
};

export const getTestAverages = async (token: string): Promise<{ ok: boolean; status?: number; data?: any; error?: string }> => {
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
      error: error.message || "Failed to fetch test averages. Please try again.",
    };
  }
};

export const getSessionsCount = async (token: string): Promise<{ ok: boolean; status?: number; data?: any; error?: string }> => {
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
      error: error.message || "Failed to fetch session count. Please try again.",
    };
  }
};

export const getAdminSessions = async (token: string): Promise<{ ok: boolean; status?: number; data?: any; error?: string }> => {
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