const BASE_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || "http://localhost:5000/api";

const API_ENDPOINTS = {
  BACKEND_TEST: `${BASE_URL}/health`,
};

export async function backendTest(token: string) {
  try {
    const response = await fetch(API_ENDPOINTS.BACKEND_TEST, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    console.log("response", response);

    return {
      ok: response.ok,
      status: response.status,
      data: response.statusText,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: "Failed to fetch backend. Please try again.",
    };
  }
}

export const facialDetection = async (
  token: string,
  facialData: { mood: string; moodScore: number }
) => {
  try {
    const response = await fetch(`${BASE_URL}/student/facial-detection`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(facialData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to submit facial data");
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      status: 500,
      error: error.message || "Failed to submit facial data. Please try again.",
    };
  }
};

export const getMe = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/student/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch user data");
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      status: 500,
      error: error.message || "Failed to fetch user data. Please try again.",
    };
  }
};

export const getUserDetails = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/student/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch user details");
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      status: 500,
      error: error.message || "Failed to fetch user details. Please try again.",
    };
  }
};

export const updateUserDetails = async (
  token: string,
  updateData: Partial<ICompleteUser>,
  avatarFile?: File
) => {
  try {
    const formData = new FormData();
    if (avatarFile) {
      formData.append("file", avatarFile);
    }
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const response = await fetch(`${BASE_URL}/student/details`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to update user details");
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      status: 500,
      error:
        error.message || "Failed to update user details. Please try again.",
    };
  }
};

export const submitBooking = async (token: string, bookingData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to submit booking");
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      status: 500,
      error: error.message || "Failed to submit booking. Please try again.",
    };
  }
};

export async function getJournalEntryByDate(
  token: string,
  date: string // YYYY-MM-DD
) {
  const res = await fetch(`${BASE_URL}/journal/entry/${date}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return { ok: res.ok, data: data.data, error: data.error };
}

export async function addOrUpdateJournalEntry(
  token: string,
  payload: {
    date: string; // should be "YYYY-MM-DD"
    entryText: string;
  }
) {
  const res = await fetch(`${BASE_URL}/journal/add_entry`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: payload.date, // e.g. "2023-09-25"
      entryText: payload.entryText, // e.g. "hello, I am feeling good"
    }),
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    return {
      ok: false,
      data: null,
      error: "Invalid JSON in response",
    };
  }

  return {
    ok: res.ok,
    data: data?.data ?? null,
    error: data?.error ?? (!res.ok ? data?.message : null),
  };
}

export const appliedForVolunteer = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/student/volunteer`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.error?.message || "Failed to fetch volunteer status"
      );
    }
    return {
      ok: response.ok,
      status: response.status,
      data: result.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      status: 500,
      error:
        error.message || "Failed to fetch volunteer status. Please try again.",
    };
  }
};

export const becomeVolunteer = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/student/volunteer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.error?.message || "Failed to submit volunteer request"
      );
    }
    return {
      ok: response.ok,
      status: response.status,
      data: result.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      status: 500,
      error:
        error.message ||
        "Failed to submit volunteer request. Please try again.",
    };
  }
};
