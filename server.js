const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to add new contact
app.post('/add', (req, res) => {
  const { username } = req.body;

  if (!username || username.trim() === '') {
    return res.status(400).send("Username is required");
  }

  const query = 'INSERT INTO contacts (username) VALUES (?)';
  db.query(query, [username], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.send("User already added.");
      }
      return res.status(500).send("Database error.");
    }
    res.send("Contact added successfully.");
  });
});

// Route to get all contacts
app.get('/contacts', (req, res) => {
  const query = 'SELECT * FROM contacts ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Error fetching contacts");
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
