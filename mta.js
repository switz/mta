"use strict";

function drawTimes(data, status, xhr) {
    var id = xhr["id"];
    $(`#times tr:eq(${id})`).html(`<td colspan=2 class="station">${data.stationName}</td>`)
    $(`#times tr:eq(${id+1})`).html(`<td>${data.direction1.name}</td><td>${data.direction1.times.map(time => `<span class="route route-${time.route}">${time.route}</span> ${time.minutes}`).join(" ")}</td>`)
    $(`#times tr:eq(${id+2})`).html(`<td>${data.direction2.name}</td><td>${data.direction2.times.map(time => `<span class="route route-${time.route}">${time.route}</span> ${time.minutes}`).join(" ")}</td>`)
}

var nextid = 0;

function request(url, first) {
    if (first) {
        $("#times").append("<tr></tr><tr></tr><tr></tr>");
    }
    $.ajax({
        dataType: "json",
        url: url,
        success: drawTimes,
    })["id"] = nextid * 3;
    nextid++;
}

function drawStatus(data, status, xhr) {
    $("#status").html("");
    var routes = data.routeDetails.filter(route => route.mode == "subway");
    routes = routes.sort((a, b) => a.route[0] < b.route[0] ? -1 : a.route[0] == b.route[0] ? 0 : 1);
    for (var route of routes) {
        var name = route.route;
        var color = route.color;
        if (route.statusDetails !== undefined) {
            $("#status").append(`<span style="color: #${color};">${name}</span>&nbsp;`);
            var last = ""
            for (var status of route.statusDetails) {
                if (status.statusSummary != last) {
                    $("#status").append(`${status.statusSummary} `);
                    last = status.statusSummary;
                }
            }
        }
    }
}

function status(url) {
    $.ajax({
        dataType: "json",
        url: url,
        success: drawStatus,
    });
}

function load(first) {
    nextid = 0;
    request("https://mtasubwaytime.info/getTime/2/231", first);
    request("https://mtasubwaytime.info/getTime/2/137", first);
    request("https://mtasubwaytime.info/getTime/2/134", first);
    request("https://mtasubwaytime.info/getTime/C/A33", first);
    request("https://mtasubwaytime.info/getTime/C/A34", first);
    request("https://mtasubwaytime.info/getTime/C/A40", first);

    status("https://collector-otp-prod.camsys-apps.com/realtime/serviceStatus?apikey=qeqy84JE7hUKfaI0Lxm2Ttcm6ZA0bYrP")

    setTimeout(() => load(false), 10000);
}
