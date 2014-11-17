/*jslint browser:true */
/*global moment */

function fetchJSONFile(path, success, failure) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (success) success(data);
            } else
            if (httpRequest.status === 404) {
                if (failure) failure("Not found");
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

function isInTimeInterval(time, from, to) {
    if (from < to) {
       return from <= time && time < to;
    } else { // means it is awake past midnight
        return (from <= time && time < 24) || (0 <= time && time < to);
    }
}

function isAwake() {
    'use strict';
    var positions = [
            800, 800, 800, 800,
            800, 550, 450, 220,
            0, 0, 0, 0,
            0, 100, 100, 100,
            150, 150, 250, 300,
            400, 450, 550, 750
        ],
        colors = [
            "#ecf0f1", "#ecf0f1", "#ecf0f1", "#ecf0f1",
            "#ecf0f1", "#ecf0f1", "#ecf0f1", "#000000",
            "#000000", "#000000", "#000000", "#000000",
            "#000000", "#000000", "#000000", "#000000",
            "#000000", "#000000", "#000000", "#000000",
            "#000000", "#000000", "#ecf0f1", "#ecf0f1"
        ],
        person = location.hostname.split(".")[0],
        local = moment().zone(0)

    if (!person || person == "isawake") {
        document.getElementById("answer").innerHTML = "<a class='add_yourself' href='https://github.com/nicola/isawake#add-yourself'>Add yourself</a>"
        return
    }

    fetchJSONFile(
        "http://"+person+".isawake.me/people/"+person+".json",
        function(obj) {
            if (!obj) {
                return;
            }
            var personOffset = (obj || {}).offset*60,
                personRange = (obj || {}).range,
                remote = local.add(personOffset, 'm'),
                hours = +remote.format("H"),
                answer = isInTimeInterval(hours, personRange[0], personRange[1]) ? "Yes" : "No",
                answerElement = document.getElementById("answer"),
                skyElement = document.getElementById("sky");

            answerElement.innerHTML = answer + " it's " + remote.format('HH:mm');
            skyElement.style.top = "-" + positions[hours] + "%";
            answerElement.style.color = colors[hours];
        })

}
isAwake();
