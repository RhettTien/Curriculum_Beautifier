var color_list = [];
var default_course_list = [];
var course_list = [];
var real_course_list = [];
let unique_course_list = new Set();
var jsonData = {};
var json_file_path = "./data/data.json";

// auto start
window.onload = function () {
    init_div_();
    if (typeof (json_file_path) == "string") {
        $.getJSON(json_file_path, function (data) {
            jsonData = data;
            init_(data);
        });
    } else {
        init_(json_file_path);
    }
}

// initializing div tags
function init_div_() {
    var target = document.getElementById('course-column');
    for (i = 1; i < 6; i++) {
        var column = document.createElement('div');
        column.className = 'column' + i;
        column.setAttribute('id', 'column' + i);
        target.appendChild(column);

        for (j = 1; j < 11; j++) {
            var item = document.createElement('div');
            item.classList.add('column-item');
            item.classList.add('course-item' + i + j);
            item.setAttribute('id', 'course-item' + i + j);
            column.appendChild(item);

            var decorate = document.createElement('div')
            decorate.className = 'decorate';
            item.appendChild(decorate);

            var title_box = document.createElement('div')
            title_box.className = 'title-box';
            item.appendChild(title_box);

            var title = document.createElement('div')
            title.className = 'course-title';
            title.setAttribute('id', 'course-title');
            title_box.appendChild(title);

            var locations = document.createElement('div')
            locations.className = 'course-location';
            locations.setAttribute('id', 'course-location');
            title_box.appendChild(locations);

            var time = document.createElement('div')
            time.className = 'course-time';
            time.setAttribute('id', 'course-time');
            item.appendChild(time);
        }
    }
}

// initializing data
function init_(data) {

    color_list = [];
    default_course_list = [];
    course_list = [];
    jsonData = data;

    if (color_list.length == 0) {
        color_list = data["color"]
    }
    // console.log(color_list);

    let uniqueStrings = new Set();
    for (i = 1; i < 6; i++) {
        var days = data["day" + i];
        change_check_status(days);
        Object.keys(days).forEach(function (key) {
            var course_name = days[key][0];
            if (!(course_name.trim().length === 0)) {
                uniqueStrings.add(capitalizeFirstLetter(course_name));
            }
        });
    }
    default_course_list = [...uniqueStrings]
    // console.log(default_course_list);

    for (i = 1; i < 6; i++) {
        var days = data["day" + i];
        for (j = 1; j < 11; j++) {
            var course_item = document.getElementById("course-item" + i + j);
            // 判断是否存在
            if (days['lesson' + j] !== undefined) {
                var course = days['lesson' + j][0];
                if (course !== "") {
                    course_item.children[1].children[0].innerText = course;
                    course_item.children[1].children[1].innerText = days["lesson" + j][1];
                    course_item.children[2].innerText = days["lesson" + j][2];

                    var bg_color = 'background-color:' + what_color(default_course_list, [], course);
                    course_item.setAttribute('style', bg_color);
                } else {
                    course_item.children[1].children[0].innerText = '';
                    course_item.children[1].children[1].innerText = '\\';
                    course_item.children[2].innerText = '\\';
                    course_item.setAttribute('style', 'opacity: 0;');
                }
            } else {
                course_item.setAttribute('style', 'display: none;');
            }
        }
    }
}

// import json file
document.getElementById('jsonFileInput').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (file) {
        // You can also access the file details like this:
        console.log(e.target.files[0]);
        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                var data = JSON.parse(e.target.result);

                init_(data);
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        };
        // Trigger the read operation
        reader.readAsText(file);
    } else {
        console.log("No file selected.");
    }
    e.target.value = '';
});

// export json file
function export_() {
    if (isEmptyObject(jsonData)) {
        alert("json data undefined");
        return;
    }
    var json_ = jsonData;

    var courseValue = {};
    for (i = 1; i < 6; i++) {
        var days = 'day' + i
        courseValue[days] = {};
        for (j = 1; j < 11; j++) {
            var column = "course-item" + i + j;
            var items = document.getElementById(column);
            var displayValue = window.getComputedStyle(items).display;
            if (displayValue !== 'none') {
                var values = []
                var lesson_name = `lesson${j}`;

                var course = items.children[1].children[0].textContent;
                var location = items.children[1].children[1].textContent;
                var time = items.children[2].textContent;

                values.push(course, location, time);
                courseValue[days][lesson_name] = values;
            }
        }
    }

    let daysLen = Object.keys(courseValue);
    for (i = 0; i < daysLen.length; i++) {
        var day = courseValue['day' + (i + 1)];
        // sequence order
        // var lesson_ = {};
        // var num = 1;
        // for (const lesson in day) {
        //     lesson_['lesson' + num] = day[lesson];
        //     num++;
        // }
        // json_['day' + (i + 1)] = lesson_;
        json_['day' + (i + 1)] = day;
    }

    const jsonString = JSON.stringify(json_);
    const blob = new Blob([jsonString], { type: 'application/json' });
    var dataURL = window.URL.createObjectURL(blob);
    downloadImage(dataURL, 'curriculum_data.json');

}

// save as image
function save_img() {
    var myDiv = document.getElementById('course-panel');
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // Set the canvas size to the same size as the div
    canvas.width = myDiv.offsetWidth;
    canvas.height = myDiv.offsetHeight;

    // Render the div onto the canvas
    html2canvas(myDiv, { scale: 2, dpi: 300 }).then(function (canvas) {
        // Now you can convert the canvas to an image
        var imgData = canvas.toDataURL('image/png'); // Convert to PNG base64

        // You can download the image using the following code
        downloadImage(imgData, 'div_image.png');
    });
}

// download file
function downloadImage(dataURL, filename) {
    var a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// reset color
function reset_color() {
    // random sort course list or color list
    shuffle(color_list)

    for (i = 0; i < 5; i++) {
        for (j = 0; j < 10; j++) {
            var id = "course-item" + (i + 1) + (j + 1);
            var column_item = document.getElementById(id);
            if (!(window.getComputedStyle(column_item).display === 'none')) {
                var course_ = column_item.children[1].children[0].textContent;
                var course_ = capitalizeFirstLetter(course_);
                if (course_list.includes(course_) | default_course_list.includes(course_)) {
                    var bg_color = 'background-color:' + what_color(default_course_list, course_list, course_);
                    column_item.setAttribute('style', bg_color);
                }
            }
        }
    }
}

// random sort list
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// add class item
function add_() {

    var day = document.getElementById('day').value
    var lesson = document.getElementById('lesson').value
    var course = document.getElementById('course').value
    var time = document.getElementById('time').value
    var location = document.getElementById('location').value

    const regex = /[?]/;
    if (regex.test(day) && regex.test(lesson)) {
        multi_add_(day, lesson, course, time, location);
    } else {
        single_add_(day, lesson, course, time, location);
    }
}

// single add
function single_add_(day, lesson, course, time, location) {

    var lesson_ = -1;

    // is number?
    if (!(/^\d+$/.test(day))) {
        lesson_ == -1
    } else if (/^\d+$/.test(lesson)) {
        lesson_ = check_lesson(lesson);
    }

    if (lesson_ == -1) {
        course = ''
    }

    if (!(day === '' || lesson_ === '' || course === '' || location === '' || time === '')) {
        set_class('', day, lesson_, course, time, location, false);
        document.getElementById("notice").setAttribute('style', 'display:none;');
        default_course_list = [];
    } else {
        // wrong Event Listener
        show_info();
    }
}

// multiple add class
function multi_add_(day, lesson, course, time, location) {

    let days_list = day.split('?').filter(item => item.trim().length > 0);
    let lessons_list = lesson.split('?').filter(item => item.trim().length > 0);
    let courses_list = course.split('?').filter(item => item.trim().length > 0);
    let times_list = time.split('?').filter(item => item.trim().length > 0);
    let locations_list = location.split('?').filter(item => item.trim().length > 0);

    let unique_len = new Set();

    unique_len.add(days_list.length);
    unique_len.add(lessons_list.length);
    unique_len.add(courses_list.length);
    unique_len.add(times_list.length);
    unique_len.add(locations_list.length);

    if (!(unique_len.size === 1)) {
        show_info();
        return;
    }

    var lesson_ = -1;
    for (i = 0; i < days_list.length; i++) {
        var str_day = days_list[i].trim();
        var str_lesson = lessons_list[i].trim();
        var str_course = courses_list[i].trim();
        var str_time = times_list[i].trim();
        var str_location = locations_list[i].trim();

        if (!(/^\d+$/.test(str_day))) {
            show_info();
            return;
        } else if (/^\d+$/.test(str_lesson)) {
            lesson_ = check_lesson(str_lesson);
        }
        if (lesson_ == -1) {
            show_info();
            return;
        } else {
            single_add_(str_day, str_lesson, str_course, str_time, str_location);
        }
    }
}

// set_class
// is_check is checkbox status, checked is checkbox operation
function set_class(is_check, day, lesson, course, time, location, checked) {
    // console.log("set -- " + day, lesson, course,)
    var id_ = "course-item" + day + lesson;
    var item_ = document.getElementById(id_);

    if (checked) {
        if (is_check) {
            if (course_list.length > 0) {
                item_.setAttribute('style', 'display:block;');
                var bg_color = 'background-color:' + what_color([], course_list, course);
                item_.setAttribute('style', bg_color);
                if (course == '') {
                    item_.setAttribute('style', 'opacity:0;');
                }
            } else {
                item_.setAttribute('style', 'display:block;');
                var bg_color = 'background-color:' + what_color(default_course_list, [], course);
                item_.setAttribute('style', bg_color);
                if (course == '') {
                    item_.setAttribute('style', 'opacity:0;');
                }
                // console.log("bg -- " + bg_color)
            }
        } else {
            item_.setAttribute('style', 'display:none;');
        }
    } else {
        item_.setAttribute('style', 'display:block;');

        item_.children[1].children[0].innerText = course;
        item_.children[1].children[1].innerText = location;
        item_.children[2].innerText = time;

        unique_course_list.add(capitalizeFirstLetter(course));
        course_list = [...unique_course_list]

        var bg_color = 'background-color:' + what_color([], course_list, course);
        item_.setAttribute('style', bg_color);

        jsonData['day' + day]['lesson' + lesson][0] = course;
        jsonData['day' + day]['lesson' + lesson][1] = location;
        jsonData['day' + day]['lesson' + lesson][2] = time;

        course_list = get_real_course();
    }
}

// different combinations of input states
function check_lesson(lesson_) {

    var lesson = lesson_;

    var h = document.getElementById('high').checked
    var l = document.getElementById('lunchtime').checked
    var e = document.getElementById('evening').checked

    if (!(h) && !(l) && !(e)) {
        if (lesson < 1) {
            lesson = -1;
        } else if (lesson > 2 && lesson < 5) {
            lesson = parseInt(lesson) + 3
        } else if (lesson > 4) {
            lesson = -1;
        }
    } else if (!(h) && !(l) && e) {
        if (lesson < 1) {
            lesson = -1;
        } else if (lesson > 2 && lesson < 5) {
            lesson = parseInt(lesson) + 3
        } else if (lesson == 5) {
            lesson = parseInt(lesson) + 5
        } else if (lesson > 5) {
            lesson = -1;
        }
    } else if (!(h) && l && !(e)) {
        if (lesson < 1) {
            lesson = -1;
        } else if (lesson > 2 && lesson < 6) {
            lesson = parseInt(lesson) + 2
        } else if (lesson > 5) {
            lesson = -1;
        }
    } else if (!(h) && l && e) {
        if (lesson < 1) {
            lesson = -1;
        } else if (lesson > 2 && lesson < 6) {
            lesson = parseInt(lesson) + 2
        } else if (lesson == 6) {
            lesson = parseInt(lesson) + 4
        } else if (lesson > 6) {
            lesson = -1;
        }
    } else if (h && !(l) && !(e)) {
        if (lesson < 1) {
            lesson = -1;
        } else if (lesson > 4 && lesson < 9) {
            lesson = parseInt(lesson) + 1
        } else if (lesson > 8) {
            lesson = -1;
        }
    } else if (h && !(l) && e) {
        if (lesson < 1) {
            lesson = -1;
        } else if (lesson > 4 && lesson < 9) {
            lesson = parseInt(lesson) + 1
        } else if (lesson == 9) {
            lesson = parseInt(lesson) + 1
        } else if (lesson > 9) {
            lesson = -1;
        }
    } else if (h && l && !(e)) {
        if (lesson < 1) {
            lesson = -1;
        } else if (lesson > 9) {
            lesson = -1;
        }
    } else {
        if (lesson > 10) {
            lesson = -1;
        }
    }

    return lesson;
};

function what_color(default_course_list, course_list, c_course) {
    var temp = 0;
    var color_ = '';
    var course_name = capitalizeFirstLetter(c_course);
    if (default_course_list.length == 0) {
        if (course_list.includes(course_name)) {
            temp = course_list.indexOf(course_name);
            color_ = color_list[temp];
        } else {
            console.log("course not found, set color defeated")
            // course_list[temp] = course_name;
            // temp = course_list.length;
            // course_list[temp] = course_name;
            // color_ = color_list[temp];
        }
    } else {
        temp = default_course_list.indexOf(course_name);
        color_ = color_list[temp];
    }
    // console.log("course = " + c_course)
    // console.log(color_)
    return color_;
}

// high school
function high_() {
    var check = false;
    if (document.getElementById('high').checked) {
        check = true;
    }

    var list_ = [3, 4, 8, 9]
    for (n of list_) {
        for (i = 1; i < 6; i++) {
            var item = document.getElementById("course-item" + i + n);
            if (item.display !== 'none') {
                var course = '';
                try {
                    var course = jsonData['day' + i]['lesson' + n][0]
                } catch (e) {
                    console.log(e)
                }
                // var location = jsonData['day' + i]['lesson' + n][1]
                // var time = jsonData['day' + i]['lesson' + n][2]
                set_class(check, i, n, course, '', '', true);
            }
        }
    }
}

// lunch time
function lunch_() {
    var check = false;
    if (document.getElementById('lunchtime').checked) {
        check = true;
    }

    for (i = 1; i < 6; i++) {
        var item = document.getElementById("course-item" + i + 5);
        if (item.display !== 'none') {
            var course = '';
            try {
                var course = jsonData['day' + i]['lesson' + 5][0]
            } catch (e) {
                console.log(e)
            }
            set_class(check, i, 5, course, '', '', true);
        }
    }
}

// self-study
function evening_() {
    var check = false;
    if (document.getElementById('evening').checked) {
        check = true;
    }

    for (i = 1; i < 6; i++) {
        var item = document.getElementById("course-item" + i + 10);
        if (item.display !== 'none') {
            var course = '';
            try {
                var course = jsonData['day' + i]['lesson' + 10][0];
            } catch (e) {
                console.log(e)
            }
            set_class(check, i, 10, course, '', '', true);
        }
    }
}

// wrong alert
function show_info() {
    document.getElementById("notice").setAttribute('style', 'display:block;');
    document.getElementById('course').addEventListener('mouseenter', function () {
        document.getElementById("notice").setAttribute('style', 'display:none;');
    }, { once: true });
}

// format course name 
function capitalizeFirstLetter(string) {
    if (!string) return string;
    var str = '';
    try {
        str = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    } catch (error) {
        console.error("Error String : " + string, error);
    }
    return str;
}

function hidden_menu_() {
    var myDiv = document.getElementById("control-panel");
    var show_menu = document.getElementById("show_menu");
    var showButton = document.getElementById("show_btn");

    show_menu.setAttribute('style', 'display:block;');
    showButton.setAttribute('style', 'display:block;');

    myDiv.classList.add('out');
    myDiv.classList.remove('in');

    setTimeout(function () {
        myDiv.setAttribute('style', 'display:none;');
    }, 300);
}

function show_menu_() {
    var myDiv = document.getElementById("control-panel");
    var show_menu = document.getElementById("show_menu");
    var showButton = document.getElementById("show_btn");

    myDiv.classList.remove('out');
    myDiv.classList.add('in');

    myDiv.setAttribute('style', 'display:flex;');
    show_menu.setAttribute('style', 'display:none;');
    showButton.setAttribute('style', 'display:none;');
}

function isEmptyObject(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

// check status according to the imported file
function change_check_status(lesson_list) {
    var vh = 0;
    var vl = 0;
    var ve = 0;

    document.getElementById('high').checked = false;
    document.getElementById('lunchtime').checked = false;
    document.getElementById('evening').checked = false;

    if (lesson_list['lesson3'] !== undefined || lesson_list['lesson4'] !== undefined || lesson_list['lesson8'] !== undefined || lesson_list['lesson9'] !== undefined) {
        vh++;
    }
    if (lesson_list['lesson5'] !== undefined) {
        vl++;
    }
    if (lesson_list['lesson10'] !== undefined) {
        ve++;
    }

    if (vh > 0) {
        document.getElementById('high').checked = true;
    }
    if (vl > 0) {
        document.getElementById('lunchtime').checked = true;
    }
    if (ve > 0) {
        document.getElementById('evening').checked = true;
    }
}

// get all real course
function get_real_course() {
    const uniqueStrings = new Set();
    for (let i = 1; i <= 6; i++) {
        const columnId = 'column' + i;
        const column = document.getElementById(columnId);
        if (column) {
            for (let j = 1; j <= 10; j++) {
                const itemId = 'course-item' + i + j;
                const item = column.querySelector('#' + itemId);
                if (window.getComputedStyle(item).getPropertyValue('opacity') !== '0') {
                   const course_name = item.children[1].children[0].textContent.trim();
                    uniqueStrings.add(capitalizeFirstLetter(course_name));
                }
            }
        }
    }
    return Array.from(uniqueStrings);
    // console.log(uniqueStringsArray);
}

function test_() {
    // console.log(jsonData);
    // console.log("--------")
    // console.log(course_list)
    // console.log("--------")
    // console.log(default_course_list)
}
