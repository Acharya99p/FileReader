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
    var last = false;
    for (let i = 1; i <= len; i++) {
        if (i === len) last = true;

        processFile(filesMap[i], i, last);
    }

}

function processFile(data, count, last) {
    var col = [];
    data.split('\n').forEach(function(row, index) {

        if (index === 0) {
            // initColumns(row);
            col = row.split(',');
            return;
        }

        var obj = {};

        row.split(',').forEach(function(word, index) {
            obj[col[index]] = word;
        });

        if (col.indexOf('user_name') > -1) {
            userData.push(obj);
        } else if (col.indexOf('course_name') > -1) {
            courseData.push(obj);
        } else {
            enrollData.push(obj);
        }

    });

    if (last) {
        return filterActiveCourses();
    }
}

function filterActiveCourses() {
    var activeCourses = [];
    activeCourses = courseData.filter(function(data) {
        return data.state === 'active';
    });

    return filterStudents(activeCourses);
}

function filterStudents(courses) {
    var studentsId = [];

    courses.forEach(function(course) {
        enrollData.forEach(function(enroll) {
            if (course.course_id == enroll.course_id && enroll.status === 'active') {
                studentsId.push(enroll.user_id);
            }
        })
    });

    return listStudents(courses, studentsId);
}
