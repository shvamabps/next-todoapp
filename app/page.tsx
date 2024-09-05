import { PrismaClient } from "@prisma/client";
import TodoList from "./TodoList";

const prisma = new PrismaClient();

export default async function Home() {
  const todos = await prisma.todo.findMany();

  return (
    <main className="w-full max-w-md h-full flex justify-center items-center">
      <TodoList initialTodos={todos} />
    </main>
  );
}
