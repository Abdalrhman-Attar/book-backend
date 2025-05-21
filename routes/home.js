import express, { application } from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to your first API server");
});

export default router;
