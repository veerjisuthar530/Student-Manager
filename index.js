import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import sqlite3 from "sqlite3";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

const db = new sqlite3.Database("./todos.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database.");

    db.run(
      `CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        todoContent TEXT NOT NULL
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER NOT NULL
      )`
    );
  }
});

app.get("/", (req, res) => {
  res.send("Welcome");
});

// ===== TODOS =====
app.get("/get-all-todos", (req, res) => {
  db.all("SELECT * FROM todos", (err, rows) => {
    if (err) {
      return res.status(500).send({ message: "Database error", error: err });
    }
    const message = rows.length === 0 ? "Todos container is empty" : "Here is All Todos";
    res.send({ message, data: rows });
  });
});

app.post("/add-todo", (req, res) => {
  const { todo } = req.body;
  const id = uuidv4();
  if (!todo || todo.trim() === "") {
    return res.status(400).send({ message: "Todo content is required" });
  }
  db.run("INSERT INTO todos (id, todoContent) VALUES (?, ?)", [id, todo], (err) => {
    if (err) return res.status(500).send({ message: "Database error", error: err });
    res.status(201).send({ message: "Todo added successfully", data: { id, todoContent: todo } });
  });
});

app.patch("/edit-todo/:id", (req, res) => {
  const { todo } = req.body;
  const { id } = req.params;
  db.run("UPDATE todos SET todoContent = ? WHERE id = ?", [todo, id], function (err) {
    if (err) return res.status(500).send({ message: "Database error", error: err });
    if (this.changes === 0) return res.status(404).send({ message: "Todo Not Found" });
    res.status(202).send({ message: "Todo updated successfully", data: { id, todoContent: todo } });
  });
});

app.delete("/delete-todo/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).send({ message: "Database error", error: err });
    if (this.changes === 0) return res.status(404).send({ message: "Todo Not Found" });
    res.status(202).send({ message: "Todo deleted successfully" });
  });
});

// ===== STUDENTS =====
app.get("/get-all-students", (req, res) => {
  db.all("SELECT * FROM students", (err, rows) => {
    if (err) return res.status(500).send({ message: "Database error", error: err });
    res.send({ message: "All students fetched", data: rows });
  });
});

app.post("/add-student", (req, res) => {
  const { name, email, age } = req.body;
  const id = uuidv4();
  if (!name || !email || !age) return res.status(400).send({ message: "All fields are required" });

  db.run(
    "INSERT INTO students (id, name, email, age) VALUES (?, ?, ?, ?)",
    [id, name, email, age],
    (err) => {
      if (err) return res.status(500).send({ message: "Database error", error: err });
      res.status(201).send({ message: "Student added", data: { id, name, email, age } });
    }
  );
});

app.patch("/edit-student/:id", (req, res) => {
  const { name, email, age } = req.body;
  const { id } = req.params;
  if (!name || !email || !age) return res.status(400).send({ message: "All fields are required" });

  db.run(
    "UPDATE students SET name = ?, email = ?, age = ? WHERE id = ?",
    [name, email, age, id],
    function (err) {
      if (err) return res.status(500).send({ message: "Database error", error: err });
      if (this.changes === 0) return res.status(404).send({ message: "Student Not Found" });
      res.status(202).send({ message: "Student updated", data: { id, name, email, age } });
    }
  );
});

app.delete("/delete-student/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM students WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).send({ message: "Database error", error: err });
    if (this.changes === 0) return res.status(404).send({ message: "Student Not Found" });
    res.status(202).send({ message: "Student deleted" });
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
