const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// SQLiteデータベースの接続
const db = new sqlite3.Database('./ranking.db');

app.use(bodyParser.json());
app.use(express.static('public')); // フロントエンドのHTMLファイルを置くディレクトリ

// ランキング送信API
app.post('/submit-score', (req, res) => {
    const { username, score } = req.body;
    if (!username || !score) {
        return res.status(400).send('Invalid input');
    }

    const query = `INSERT INTO rankings (username, score) VALUES (?, ?)`;
    db.run(query, [username, score], function(err) {
        if (err) {
            return res.status(500).send('Failed to submit score');
        }
        res.send({ message: 'Score submitted successfully' });
    });
});

// ランキング取得API
app.get('/get-rankings', (req, res) => {
    db.all(`SELECT username, score FROM rankings ORDER BY score DESC LIMIT 5`, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Failed to retrieve rankings');
        }
        res.send(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});