const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
const breedsFolderPath = './breeds';

// POST: /api/word - objektas su kuriamu žodžiu;
app.post('/api/word', (req, res) => {
    const id = Date.now();
    const { description, breed } = req.body;

    const breedObject = {
        id,
        breed,
        description,
        creationTime: new Date(id),
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

// GET: /api/dictionary - gauti visą sąrašą
app.get('/api/breeds', (req, res) => {
    const fileList = fs.readdirSync(breedsFolderPath);
    const breedsList = [];

    for (const file of fileList) {
        const fileData = fs.readFileSync(`${breedsFolderPath}/${file}`);
        const breedObject = JSON.parse(fileData);
        breedsList.push(breedObject);
    }

    res.json(fileList);
});
// GET: /api/dictionary/[id] - gauti visą žodžio informaciją pagal jo ID;
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

    // res.json({ found: fileExists });
});

app.listen(port, () => {
    console.log(`Dictionary API is on port number: ${port}`);
});
