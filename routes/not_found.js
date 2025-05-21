import express, { application } from "express";

const router = express.Router();

// not found route
router.use((req, res) => {
  res.json({ message: "🚫 Route not found" });
});

export default router;
