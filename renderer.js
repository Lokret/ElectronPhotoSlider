// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');

function getCource(cb) {
    fs.readFile(`${__dirname}/resources/course.txt`, 'utf8', function(err, data) {
        if (err) throw err;
        const newData = data.split('\n');
        const result = {};
        newData.forEach((cource) => {
            const obj = cource.split('-');
            result[obj[0].trim()] = obj[1];
        });
        cb(result)
    });
}

function loadFiles(cources) {
    fs.readdir(`${__dirname}/resources/img/`, (err, files) => {
        if (err) throw err;
        let i = 0;        
        files.forEach(file => {
          i += 5000;
          setTimeout(() => {
            const imageWrapper = document.getElementById('imageTag');
            const price = document.getElementById('price');
            const name = document.getElementById('name');
            const product = file.split('-');

            price.innerText = Number(parseFloat(product[1]) * 27.15).toFixed(1);
            name.innerText = product[0];

            imageWrapper.src = `${__dirname}/resources/img/${file}`;
          }, i);
        });
      })
}

getCource(loadFiles);
