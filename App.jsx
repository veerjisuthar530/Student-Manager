import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const BASE_URL = "http://localhost:3000";
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("todos");

  // Todo States
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);

  // Student States
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: "", email: "", age: "" });

  useEffect(() => {
    getTodos();
    getStudents();
  }, []);

  // ===== Todos =====
  const getTodos = async () => {
    setLoading(true);
    try {
      const response = await axios(`${BASE_URL}/get-all-todos`);
      setTodos(response?.data?.data || []);
    } catch {
      toast.dismiss();
      toast.error("Todos not found");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return toast.dismiss(), toast.error("Todo content is required");
    try {
      await axios.post(`${BASE_URL}/add-todo`, { todo: newTodo });
      setNewTodo("");
      getTodos();
    } catch {
      toast.dismiss();
      toast.error("Error adding todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/delete-todo/${id}`);
      getTodos();
      toast.dismiss();
      toast("Todo Deleted");
    } catch {
      toast.dismiss();
      toast.error("Error deleting todo");
    }
  };

  const editTodo = async (id, updatedContent) => {
    try {
      await axios.patch(`${BASE_URL}/edit-todo/${id}`, { todo: updatedContent });
      getTodos();
      toast.dismiss();
      toast.success("Todo Edited");
    } catch {
      toast.dismiss();
      toast.error("Todo content is required");
    }
  };

  // ===== Students =====
  const getStudents = async () => {
    try {
      const response = await axios(`${BASE_URL}/get-all-students`);
      setStudents(response?.data?.data || []);
    } catch {
      toast.error("Failed to load students");
    }
  };

  const addStudent = async () => {
    const { name, email, age } = newStudent;
    if (!name || !email || !age) return toast.error("All student fields are required");

    try {
      await axios.post(`${BASE_URL}/add-student`, newStudent);
      setNewStudent({ name: "", email: "", age: "" });
      getStudents();
      toast.success("Student added");
    } catch {
      toast.error("Error adding student");
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/delete-student/${id}`);
      getStudents();
      toast.success("Student deleted");
    } catch {
      toast.error("Error deleting student");
    }
  };

  const editStudent = async (id, currentData) => {
    const name = prompt("Edit Name:", currentData.name);
    const email = prompt("Edit Email:", currentData.email);
    const age = prompt("Edit Age:", currentData.age);
    if (!name || !email || !age) return toast.error("All fields are required");

    try {
      await axios.patch(`${BASE_URL}/edit-student/${id}`, { name, email, age });
      getStudents();
      toast.success("Student updated");
    } catch {
      toast.error("Error updating student");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
        <div className={`shadow-lg rounded-lg w-full max-w-2xl transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <header className={`text-center py-4 rounded-t-lg transition-colors duration-300 ${darkMode ? "bg-gray-700 text-gray-100" : "bg-blue-500 text-white"}`}>
            <h1 className="text-2xl font-semibold">Todo & Student Manager</h1>
            <button onClick={() => setDarkMode(!darkMode)} className="mt-2 px-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-2">
              Toggle {darkMode ? "Light" : "Dark"} Mode
            </button>
            <div className="mt-4 flex justify-center space-x-4">
              <button onClick={() => setActiveTab("todos")} className={`px-4 py-2 rounded ${activeTab === "todos" ? "bg-white text-black" : "bg-gray-500 text-white"}`}>Todos</button>
              <button onClick={() => setActiveTab("students")} className={`px-4 py-2 rounded ${activeTab === "students" ? "bg-white text-black" : "bg-gray-500 text-white"}`}>Students</button>
            </div>
          </header>

          <div className="p-4">
            {activeTab === "todos" ? (
              <>
                <div className="flex items-center space-x-2">
                  <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTodo()} placeholder="Add a new task..." className={`flex-1 px-4 py-2 border rounded-md ${darkMode ? "bg-gray-700" : "bg-white"}`} />
                  <button onClick={addTodo} className="px-4 py-2 rounded-md bg-blue-500 text-white">Add</button>
                </div>
                {loading ? (
                  <div className="text-center mt-4">Loading...</div>
                ) : (
                  <ul className="mt-6 space-y-4">
                    {todos.map((todo) => (
                      <li key={todo.id} className={`flex items-center justify-between p-3 rounded-md shadow-sm ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        <span>{todo.todoContent}</span>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => editTodo(todo.id, prompt("Edit Todo:", todo.todoContent))} className="text-blue-500">Edit</button>
                          <button onClick={() => deleteTodo(todo.id)} className="text-red-500">Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                  <input type="text" placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className={`px-4 py-2 border rounded-md ${darkMode ? "bg-gray-700" : "bg-white"}`} />
                  <input type="email" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className={`px-4 py-2 border rounded-md ${darkMode ? "bg-gray-700" : "bg-white"}`} />
                  <input type="number" placeholder="Age" value={newStudent.age} onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })} className={`px-4 py-2 border rounded-md ${darkMode ? "bg-gray-700" : "bg-white"}`} />
                </div>
                <button onClick={addStudent} className="w-full px-4 py-2 mb-4 bg-green-500 text-white rounded-md">Add Student</button>
                <ul className="space-y-3">
                  {students.map((student) => (
                    <li key={student.id} className={`p-3 rounded-md shadow-sm ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                      <div className="flex justify-between">
                        <div>
                          <p><strong>Name:</strong> {student.name}</p>
                          <p><strong>Email:</strong> {student.email}</p>
                          <p><strong>Age:</strong> {student.age}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => editStudent(student.id, student)} className="text-blue-500">Edit</button>
                          <button onClick={() => deleteStudent(student.id)} className="text-red-500">Delete</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <footer className="text-center py-2">
            <p className="text-sm">&copy; 2025 Todo & Student App</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
