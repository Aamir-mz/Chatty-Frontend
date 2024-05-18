import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const { id, name, email, oldPassword, newPassword } = body;

  if (!name || !email) {
    return Response.json({ error: "Invalid credentials" }, { status: 400 });
  }

  // Check if the user already exists
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 400 });
  }

  let password = user.password;

  if (newPassword && oldPassword) {
    // Check if the password is correct
    const validPassword = await bcrypt.compare(oldPassword, user.password);

    if (!validPassword) {
      return Response.json({ error: "Invalid password" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    password = hashedPassword;
  }

  // Update the user
  await prisma.user.update({
    where: { id },
    data: { name, email, password },
  });

  return Response.json({ message: "User updated" });
}
