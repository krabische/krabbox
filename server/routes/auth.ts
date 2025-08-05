import { RequestHandler } from "express";
import { z } from "zod";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  joinDate: string;
  isHost: boolean;
  phoneNumber?: string;
}

const users: User[] = [];

const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const handleSignup: RequestHandler = (req, res) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Invalid signup data" });
  }

  const exists = users.find((u) => u.email === result.data.email);
  if (exists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const data = result.data;
  const newUser: User = {
    id: String(users.length + 1),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    joinDate: new Date().toISOString(),
    isHost: false,
  };

  users.push(newUser);
  res.status(200).json({ user: sanitizeUser(newUser), token: "fake-token" });
};

export const handleLogin: RequestHandler = (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Invalid login data" });
  }

  const user = users.find(
    (u) => u.email === result.data.email && u.password === result.data.password
  );
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.status(200).json({ user: sanitizeUser(user), token: "fake-token" });
};

function sanitizeUser(user: User) {
  const { password, ...rest } = user;
  return rest;
}

