import { json } from "react-router-dom";

const API_URL = "http://localhost:5000"; // Backend port

export const fetchPets = async () => {
  const query = window.location.search;
  const res = await fetch(`${API_URL}/pets${query}`); // Corrected URL
  if (!res.ok) {
    throw json({ message: "No pets available." }, { status: 500 });
  }
  return res.json();
};

export const fetchPet = async ({ params }: { params: any }) => {
  const id = params.id;
  const res = await fetch(`${API_URL}/pets/${id}`); // Fixed URL
  if (!res.ok) {
    throw json({ message: "Pet not found." }, { status: 404 });
  }
  return res.json();
};

//Authorize users.
export const registerUser = async (user: RegisterUser) => {
  const res = await fetch("/users/register", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(user),
  });
  if (res.status !== 200) {
    const data = await res.json();
    return Promise.reject(data.message);
  } else {
    const data = await res.json();
    return data;
  }
};

export const loginUser = async (user: LoginUser) => {
  const res = await fetch("/users/login", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(user),
  });
  if (res.status !== 200) {
    const data = await res.json();
    return Promise.reject(data.message);
  } else {
    const data = await res.json();
    return data;
  }
};

export const getUser = async () => {
  const res = await fetch("/users/isUserAuth", {
    credentials: "include",
    headers: { "Content-type": "application/json" },
  });
  if (res.status !== 200) {
    const data = await res.json();
    return Promise.reject(data.message);
  }
  const data = await res.json();
  return data;
};

export const logoutUser = async () => {
  const res = await fetch("/users/logout", {
    credentials: "include",
    headers: { "Content-type": "application/json" },
  });
  const data = await res.json();
  return data;
};
