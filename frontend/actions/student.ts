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

    console.log(result);
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
