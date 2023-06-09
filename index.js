const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// GET: /api/dictionary - gauti visą sąrašą
const breedsFolderPath = './breeds';
app.get('/breeds', (req, res) => {
    const fileList = fs.readdirSync(breedsFolderPath);
    const breedsList = [];

    for (const file of fileList) {
        const fileData = fs.readFileSync(`${breedsFolderPath}/${file}`);
        const breedObject = JSON.parse(fileData);
        breedsList.push(breedObject);
    }

    res.json(breedsList);
});
app.listen(port, () => {
    console.log(`Dictionary API is on port number: ${port}`);
});
