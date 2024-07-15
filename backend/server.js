const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const filePath = './pendencias.json';

// Load pendencias from file
app.get('/pendencias', (req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.send(JSON.parse(data));
    });
});

// Save pendencias to file
app.post('/pendencias', (req, res) => {
    const pendencias = req.body;
    fs.writeFile(filePath, JSON.stringify(pendencias, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error writing file');
        }
        res.send('Pendencias saved successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
