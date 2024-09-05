"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Todo } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: newTodo }),
    });
    const data = await response.json();
    setTodos([...todos, data]);
    setNewTodo("");
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const response = await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !completed }),
    });
    const updatedTodo = await response.json();
    setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
  };

  const deleteTodo = async (id: string) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <Card className="w-full bg-white shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground p-6">
        <CardTitle className="text-2xl font-bold text-center">
          Todo List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={addTodo} className="flex space-x-2 mb-6">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="flex-grow"
          />
          <Button type="submit" size="icon" variant="secondary">
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Add Todo</span>
          </Button>
        </form>
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg mb-2 group hover:bg-secondary/80 transition-colors">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`text-sm font-medium ${
                      todo.completed
                        ? "line-through text-muted-foreground"
                        : "text-secondary-foreground"
                    }`}
                  >
                    {todo.task}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Delete Todo</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {todos.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">
            No todos yet. Add one to get started!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
