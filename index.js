const objectListFromFiles = require('./helper_funcs/objectListFromFiles');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
const breedsFolderPath = './breeds';
if (!fs.existsSync(breedsFolderPath)) {
    fs.mkdirSync(breedsFolderPath);
}

app.post('/api/breed', (req, res) => {
    const id = uuidv4();
    const { description, breed } = req.body;

    const breedObject = {
        id,
        breed,
        description,
        creationTime: Date.now(),
    };
    const fileName = `${breed
        .toLowerCase()
        .split(' ')
        .map((word, i) => (i !== 0 ? word[0].toUpperCase() + word.slice(1) : word))
        .join('')}-${id}`;
    const filePath = `./breeds/${fileName}.json`;
    fs.writeFileSync(filePath, JSON.stringify(breedObject), 'utf8');

    res.status(201).json({ message: `${breedObject.breed} successfully added.` });
});

app.get('/api/breeds', (req, res) => {
    res.json(objectListFromFiles(breedsFolderPath));
});

app.get('/api/breeds/:id', (req, res) => {
    const id = req.params.id;

    const fileList = fs.readdirSync(breedsFolderPath);
    const fileExists = fileList.find(str => str.includes(id));

    if (fileExists) {
        const requestedBreed = fs.readFileSync(`./breeds/${fileExists}`);
        res.json(JSON.parse(requestedBreed));
    } else {
        res.status(404).json({ message: 'No such breed found' });
    }
});

app.listen(port, () => {
    console.log(`Dictionary API is on port number: ${port}`);
});
