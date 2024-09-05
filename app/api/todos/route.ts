import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const { task } = await request.json();
  const todo = await prisma.todo.create({
    data: { task },
  });
  return NextResponse.json(todo);
}

export async function PUT(request: Request) {
  const { id, completed } = await request.json();
  const todo = await prisma.todo.update({
    where: { id },
    data: { completed },
  });
  return NextResponse.json(todo);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.todo.delete({
    where: { id },
  });
  return NextResponse.json({ message: "Todo deleted" });
}
