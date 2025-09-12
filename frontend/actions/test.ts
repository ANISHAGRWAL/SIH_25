import { ITestHistory } from "../../backend/src/types";

const BASE_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || "http://localhost:5000/api";

export const getTestHistory = async (token: string): Promise<{ ok: boolean; status?: number; data?: ITestHistory; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/test/history`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch test history");
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error fetching test history:", error);
    return {
      ok: false,
      status: 500,
      error: error.message || "Failed to fetch test history. Please try again.",
    };
  }
};

export const submitTestScore = async (testType: string, score: number, token: string): Promise<{ ok: boolean; status?: number; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/test/${testType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ score }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to submit test");
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error submitting test score:", error);
    return {
      ok: false,
      status: 500,
      error: error.message || "Failed to submit test. Please try again.",
    };
  }
};
