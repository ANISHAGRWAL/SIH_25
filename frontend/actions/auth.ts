const BASE_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || "http://localhost:5000/api";

const API_ENDPOINTS = {
  AUTH: `${BASE_URL}/auth`,
};

export async function login(loginData: { email: string; password: string }) {
  try {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {}
}

export async function register(registerData: {
  name: string;
  email: string;
  password: string;
  role: "student" | "admin";
  organization: string;
  contact: string;
  idFile: File;
}) {
  try {
    const formData = new FormData();
    formData.append("email", registerData.email);
    formData.append("password", registerData.password);
    formData.append("role", registerData.role);
    formData.append("organization", registerData.organization);
    formData.append("name", registerData.name);
    formData.append("contact", registerData.contact);
    formData.append("file", registerData.idFile);
    const response = await fetch(`${API_ENDPOINTS.AUTH}/register`, {
      method: "POST",
      body: formData,
    });
    console.log("registering with data", formData);

    const data = await response.json();
    console.log("register response data:", data);
    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: "Failed to register. Please try again.",
    };
  }
}
