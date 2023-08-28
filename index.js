const { v4: uuidv4 } = require('uuid');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
console.clear();
const breedsFolderPath = './breeds';
if (!fs.existsSync(breedsFolderPath)) {
    fs.mkdirSync(breedsFolderPath);
}
const paginationFolderPath = './pagination';
if (!fs.existsSync(paginationFolderPath)) {
    fs.mkdirSync(paginationFolderPath);
    fs.writeFileSync(`./pagination/breed_list.json`, JSON.stringify([]), 'utf8');
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
    // Create file
    const filePath = `./breeds/${fileName}.json`;
    fs.writeFileSync(filePath, JSON.stringify(breedObject), 'utf8');
    // Push new obj to breedList data
    let breedListData = fs.readFileSync(`./pagination/breed_list.json`, 'utf8');
    breedListData = JSON.parse(breedListData);
    breedListData.push(breedObject);
    fs.writeFileSync(`./pagination/breed_list.json`, JSON.stringify(breedListData), 'utf8');

    res.status(201).json({ message: `${breedObject.breed} successfully added.` });
});

app.get('/api/breeds', (req, res) => {
    res.json(JSON.parse(fs.readFileSync(`./pagination/breed_list.json`, 'utf8')));
});

app.get('/api/breeds/:id', (req, res) => {
    const id = req.params.id;
    let breedListData = fs.readFileSync(`./pagination/breed_list.json`, 'utf8');
    breedListData = JSON.parse(breedListData);
    if (breedListData.length !== 0 && breedListData.find(breed => id === breed.id)) {
        res.json(breedListData.find(breed => id === breed.id));
    } else {
        res.status(404).json({ message: 'No such breed found' });
    }
});

app.listen(port, () => {
    console.log(`Dictionary API is on port number: ${port}`);
});
