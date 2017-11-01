var fs = require('fs');

var dirname = './csvs';

function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        var total = filenames.length-1, count=0, last=true;

        filenames.forEach(function(filename) {
            fs.readFile(dirname + '/' + filename, 'utf-8', function(err, content, total) {
                if (err) {
                    onError(err);
                    return;
                }
                count++;

                if(count ===total)
                onFileContent(filename, content,last);
            });
        });
    });
}

