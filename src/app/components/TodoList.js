"use client";
import { useState, useEffect } from "react";

/**
 * TodoList component manages the todo list state, rendering, and actions.
 * Uses localStorage for persistence and React hooks for state management.
 */
export default function TodoList() {
  // State for todos and input field
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const handleAdd = () => {
    if (!input.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: input.trim(), completed: false },
    ]);
    setInput("");
  };

  // Delete a todo
  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Start editing a todo
  const handleEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  // Save edited todo
  const handleEditSave = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditId(null);
    setEditText("");
  };

  // Toggle completion
  const handleToggle = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Remaining tasks count
  const remaining = todos.filter((todo) => !todo.completed).length;

  // Handle Enter key for add/edit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (editId !== null) handleEditSave(editId);
      else handleAdd();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Add todo input"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={handleAdd}
          aria-label="Add todo"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 group"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
              aria-label="Toggle complete"
              className="accent-blue-500"
            />
            {editId === todo.id ? (
              <>
                <input
                  className="flex-1 border rounded px-2 py-1 mr-2"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  aria-label="Edit todo input"
                />
                <button
                  className="text-green-600 hover:underline mr-1"
                  onClick={() => handleEditSave(todo.id)}
                  aria-label="Save edit"
                >
                  Save
                </button>
                <button
                  className="text-gray-500 hover:underline"
                  onClick={() => setEditId(null)}
                  aria-label="Cancel edit"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  className={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}
                >
                  {todo.text}
                </span>
                <button
                  className="text-blue-500 hover:underline mr-1"
                  onClick={() => handleEdit(todo.id, todo.text)}
                  aria-label="Edit todo"
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(todo.id)}
                  aria-label="Delete todo"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 text-sm text-gray-600 text-center">
        {remaining} task{remaining !== 1 ? "s" : ""} remaining
      </div>
    </div>
  );
}
