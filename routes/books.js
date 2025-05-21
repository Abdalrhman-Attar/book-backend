// GET /api/books Get all books
// GET /api/books/:id Get a single book by ID
// POST /api/books Add a new book
// PUT /api/books/:id Update book by ID
// DELETE /api/books/:id Delete a book by ID

import express, { application } from "express";
import pgClient from "../db.js";

const router = express.Router();

// GET /api/books Get all books
router.get("/", async (req, res) => {
  try {
    const result = await pgClient.query("SELECT * FROM books");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/books/:id Get a single book by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pgClient.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/books Add a new book
router.post("/", async (req, res) => {
  const { title, author, year } = req.body;
  try {
    const result = await pgClient.query("INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING *", [title, author, year]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/books/:id Update book by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  // get the book by id
  const { title, author, year } = req.body;
  try {
    const result = await pgClient.query("UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4 RETURNING *", [title, author, year, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/books/:id Delete a book by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pgClient.query("DELETE FROM books WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
