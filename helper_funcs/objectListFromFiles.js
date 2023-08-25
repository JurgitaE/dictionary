const fs = require('fs');
module.exports = folderPath => {
    const fileList = fs.readdirSync(folderPath);
    const objList = [];

    for (const file of fileList) {
        const fileData = fs.readFileSync(`${folderPath}/${file}`);
        const obj = JSON.parse(fileData);
        objList.push(obj);
    }
    return objList;
};
