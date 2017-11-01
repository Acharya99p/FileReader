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

        filenames.forEach(function(filename,index,arr) {
            fs.readFile(dirname + '/' + filename, 'utf-8', function(err, content, total) {
                if (err) {
                    onError(err);
                    return;
                }
                count++;

                if (count === arr.length) {
                    last = true;
                }

                console.log(total);

                onFileContent(filename, content, last);
            });
        });
    });
}


var filesMap = {};

var wholeData = {};

function onFileContent(name, content, isLast) {
    var key = name.split('.csv')[0].substring(1, name.length);
    filesMap[key] = content;

    if (isLast) {
        processContent(filesMap);
    }
}

function onError(err) {
    console.error(err);
}

