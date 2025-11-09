import express, {} from 'express';
import cors from 'cors';
// Importiere 'better-sqlite3' (alias "Database")
import Database from 'better-sqlite3';
// ---- Server-Setup ----
const app = express();
app.use(cors()); // Erlaubt Anfragen von deinem React-Frontend
app.use(express.json()); // Erlaubt das Lesen von JSON-Bodies
// ---- LiteSQL/SQLite-Setup ----
// 'better-sqlite3' ist synchron, was den Code viel sauberer macht!
const db = new Database('./mydb.sqlite');
// Erstelle die Tabelle (falls sie nicht existiert)
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`);
console.log('Connected to the SQLite database.');
// ---- API-Routen (jetzt mit Typen) ----
// API-Route: Alle Projekte holen
app.get('/api/projects', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM projects');
        const rows = stmt.all();
        res.json({ projects: rows });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// API-Route: Neues Projekt erstellen
app.post('/api/project', (req, res) => {
    try {
        const { name } = req.body; // TS weiß, dass name 'any' ist
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const stmt = db.prepare('INSERT INTO projects (name) VALUES (?)');
        const info = stmt.run(name);
        res.status(201).json({ id: info.lastInsertRowid, name: name });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ---- Server starten ----
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map