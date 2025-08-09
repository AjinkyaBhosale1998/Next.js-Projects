// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("todos") || "[]");
      if (Array.isArray(stored)) {
        setTodos(stored);
      }
    } catch (e) {
      console.error("Failed to parse todos from localStorage:", e);
      setTodos([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!task.trim()) return;
    const newTask = { text: task, id: Date.now() };

    if (editIndex !== null) {
      const updatedTodos = todos.map((todo) =>
        todo.id === editIndex ? { ...todo, text: task } : todo
      );
      setTodos(updatedTodos);
      setEditIndex(null);
    } else {
      setTodos([...todos, newTask]);
    }
    setTask("");
  };

  const handleEdit = (id, text) => {
    setTask(text);
    setEditIndex(id);
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
      {/*
        The main change is here. We are replacing the fixed 'max-w-lg' with
        responsive width classes that allow the card to grow.
      */}
      <Card className="w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-2xl bg-white/20 backdrop-blur-md border border-white/30">
        <CardContent className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center drop-shadow-lg">
            ✨ Classy Todo List
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Enter a task..."
              className="flex-grow bg-white/70 h-14 text-lg px-4"
            />
            <Button
              onClick={addTodo}
              className="h-14 px-6 text-lg bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105 transition-transform"
            >
              {editIndex !== null ? "Update" : "Add Task"}
            </Button>
          </div>

          <div>
            <AnimatePresence>
              {todos.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white text-center text-lg mt-8"
                >
                  No tasks yet ✍️
                </motion.p>
              ) : (
                todos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    layout
                    className="flex justify-between items-center bg-white/40 backdrop-blur-sm px-5 py-4 rounded-lg shadow-md mb-3"
                  >
                    <span className="text-white font-medium text-lg break-words">
                      {todo.text}
                    </span>
                    <div className="flex gap-3">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 text-yellow-300 hover:bg-white/30"
                        onClick={() => handleEdit(todo.id, todo.text)}
                      >
                        <Pencil2Icon className="w-6 h-6" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 text-red-300 hover:bg-white/30"
                        onClick={() => handleDelete(todo.id)}
                      >
                        <TrashIcon className="w-50 h-50" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <p className="mt-6 text-sm text-white text-center drop-shadow-md">
            {todos.length} task{todos.length !== 1 ? "s" : ""} remaining
          </p>
        </CardContent>
      </Card>
    </div>
  );
}