const fs = require('fs');

document.getElementById("generateBtn").addEventListener("click", function() { getCource(generateImages); });

function getCource(cb) {
    fs.readFile(`${__dirname}/resources/course.txt`, 'utf8', function(err, data) {
        if (err) throw err;
        const newData = data.split('\n');
        const result = {};
        newData.forEach((cource) => {
            const obj = cource.split('-');
            result[obj[0].trim()] = parseFloat(obj[1]);
        });
        cb(result);
    });
}

function cleanFolder() {
    fs.readdir(`${__dirname}/results/`, (err, files) => {
        files.forEach(file => {
            fs.unlink(`${__dirname}/results/${file}`, (err) => {
                if (err) throw err;
            });
        });
    });
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

function loadFiles(cources) {
    fs.readdir(`${__dirname}/resources/img/`, (err, files) => {
        if (err) throw err;
        document.getElementById('total').innerText = files.length;
        var left = 0;
        document.getElementById('left').innerText = left;
        files.forEach(file => {
            var canvas = document.createElement('canvas');
            canvas.width = 1920;
            canvas.height = 1080;
            const isDollars = file.indexOf('$') > -1;
            const isEuro = file.indexOf('€') > -1;
            const cource = isDollars ? cources.USD : (isEuro ? cources.EUR : 1);
            const product = file.split('-');
            const price = `${Number(parseFloat(product[1]) * cource).toFixed(1)} грн`;
            const name = product[0];

            var image = new Image();
            image.src = `${__dirname}/resources/img/${file}`;

            image.onload = function () {
                var ctx = canvas.getContext('2d');
                ctx.font = "60px Tahoma";
                ctx.fillStyle = "#042d97";
                ctx.shadowColor = 'white';
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                var wrh = image.width / image.height;
                var newWidth = canvas.width;
                var newHeight = newWidth / wrh;
                if (newHeight > canvas.height) {
                            newHeight = canvas.height;
                    newWidth = newHeight * wrh;
                  }
                var xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
                var yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;
        
                ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);
                ctx.fillText(price, 400, 75);
                ctx.fillText(name, 400, 150);
                var dataURL = canvas.toDataURL('image/jpeg', 0.5);
                var blob = dataURItoBlob(dataURL);
                var fileReader = new FileReader();
                fileReader.onload = function () {
                    fs.writeFileSync(`${__dirname}/results/${file}.jpeg`, Buffer(new Uint8Array(this.result)));
                };
                fileReader.readAsArrayBuffer(blob);
                left += 1;
                document.getElementById('left').innerText = left;
              };
        });
      })
}

function generateImages(cources) {
    var select = document.getElementById('select');
    var selctedValue = select.options[select.selectedIndex].value;
    cleanFolder();
    loadFiles(cources);
}

