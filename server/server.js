import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./viniciusout.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS signatures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.get("/api/stats", (req, res) => {
  db.get("SELECT COUNT(*) AS total FROM signatures", [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      total: row?.total || 0,
    });
  });
});

app.post("/api/sign", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"] || "unknown";

  db.run(
    "INSERT INTO signatures (ip, user_agent) VALUES (?, ?)",
    [String(ip), String(userAgent)],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.get("SELECT COUNT(*) AS total FROM signatures", [], (err2, row) => {
        if (err2) {
          return res.status(500).json({ error: err2.message });
        }

        res.json({
          success: true,
          id: this.lastID,
          total: row?.total || 0,
        });
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});