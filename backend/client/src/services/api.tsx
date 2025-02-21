import { get } from "http";
import { json } from "react-router-dom";

const API_URL = "http://localhost:5000"; // Backend port

// Fetch all pets
export const fetchPets = async () => {
  try {
    const query = window.location.search;
    const res = await fetch(`${API_URL}/pets${query}`);

    if (!res.ok) {
      throw new Error("No pets available.");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching pets:", error);
    throw error;
  }
};

// Fetch a single pet by ID
export const fetchPet = async ({ params }: { params: any }) => {
  try {
    const id = params.id;
    const res = await fetch(`${API_URL}/pets/${id}`);

    if (!res.ok) {
      throw new Error("Pet not found.");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching pet:", error);
    throw error;
  }
};

// Register a new user
export const registerUser = async (user: RegisterUser) => {
  try {
    const res = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed.");
    
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// User login
export const loginUser = async (user: LoginUser) => {
  try {
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed.");
    
    return data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Get authenticated user
export const getUser = async () => {
  try {
    const res = await fetch(`${API_URL}/users/isUserAuth`, {
      method: "GET",
      credentials: "include", // Ensure cookies/sessions are sent
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "User authentication failed.");
    
    return data;
  } catch (error) {
    console.log("Error fetching user:", error);
    throw error;
  }
};

// User logout
export const logoutUser = async () => {
  try {
    const res = await fetch(`${API_URL}/users/logout`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Logout failed.");
    
    return data;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};
