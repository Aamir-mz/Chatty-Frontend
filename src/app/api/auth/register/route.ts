import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import * as EmailValidator from "email-validator";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return Response.json(
      {
        error: "Name, email, and password are required",
      },
      { status: 400 }
    );
  }

  // Check if the user already exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return Response.json({ error: "User already exists" }, { status: 400 });
  }

  // check if the email is valid
  if (!EmailValidator.validate(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  // Check if the password is strong enough
  if (password.length < 8) {
    return Response.json({ error: "Password is too short" }, { status: 400 });
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return Response.json({ message: "User created" });
  } catch (error) {
    console.error("Error found while registering");
    console.error(error);

    return Response.json({ error: "Error while registering" }, { status: 500 });
  }
}
