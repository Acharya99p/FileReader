var fs = require('fs');

var dirname = './csvs';

function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }

        var total = filenames.length - 1,
            count = 0,
            last = false;

        filenames.forEach(function(filename, index, arr) {
            fs.readFile(dirname + '/' + filename, 'utf-8', function(err, content, total) {
                if (err) {
                    onError(err);
                    return;
                }
                count++;

                if (count === arr.length) {
                    last = true;
                }

                onFileContent(filename, content, last);
            });
        });
    });
}


var filesMap = {};

var wholeData = {};

var userData = [],
    courseData = [],
    enrollData = [];

function onFileContent(name, content, isLast) {
    var key = name.split('.csv')[0].replace(/^0+/, '');

    filesMap[key] = content;

    if (isLast) {
        processContent(filesMap);
    }
}

function onError(err) {
    console.error(err);
}

function processContent(filesMap) {
    var len = Object.keys(filesMap).length;

    for (let i = 1; i <= len; i++) {
        processFile(filesMap[i], i);
    }

}
