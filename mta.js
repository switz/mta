"use strict";

function drawTime(data, status, xhr) {
    var id = xhr.id;
    $(`#times tr:eq(${id})`).html(`<td colspan=2 class="station">${data.stationName}</td>`);
    $(`#times tr:eq(${id+1})`).html(`<td>${data.direction1.name}</td><td>${data.direction1.times.map(time => `<span class="route route-${time.route}">${time.route}</span> ${time.minutes}`).join(" ")}</td>`);
    $(`#times tr:eq(${id+2})`).html(`<td>${data.direction2.name}</td><td>${data.direction2.times.map(time => `<span class="route route-${time.route}">${time.route}</span> ${time.minutes}`).join(" ")}</td>`);
}

function drawTimeError(xhr, status, error) {
    var id = xhr.id;
    if ($(`#times tr:eq(${id})`).html() == "") {
        $(`#times tr:eq(${id})`).html(`<td colspan=2 class="station">unknown</td>`);
        $(`#times tr:eq(${id+1})`).html(`<td>${status}</td><td></td>`);
        $(`#times tr:eq(${id+2})`).html(`<td>${error}</td><td></td>`);
    }
}

var nextid = 0;

function request(url, first) {
    if (first) {
        $("#times").append("<tr></tr><tr></tr><tr></tr>");
    }
    $.ajax({
        dataType: "json",
        url: url,
        success: drawTime,
        error: drawTimeError,
        timeout: 4500,
    })["id"] = nextid * 3;
    nextid++;
}

function drawStatus(data, st, xhr) {
    $("#status").html("");
    var routes = data.routeDetails.filter(route => route.mode == "subway");
    routes = routes.sort((a, b) => a.route[0] < b.route[0] ? -1 : a.route[0] == b.route[0] ? 0 : 1);
    for (var route of routes) {
        var name = route.route;
        var color = route.color;
        if (route.statusDetails !== undefined) {
            $("#status").append(`<span style="color: #${color};">${name}</span>&nbsp;`);
            var last = "";
            for (var status of route.statusDetails) {
                if (status.statusSummary != last) {
                    $("#status").append(`${status.statusSummary} `);
                    last = status.statusSummary;
                }
            }
        }
    }
}

function drawStatusError(xhr, status, error) {
    if ($("#status").html() == "") {
        $("#status").html(`Loading status: ${status} (${error})`);
    }
}

function status(url) {
    $.ajax({
        dataType: "json",
        url: url,
        success: drawStatus,
        error: drawStatusError,
        timeout: 4500,
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

    status("https://collector-otp-prod.camsys-apps.com/realtime/serviceStatus?apikey=qeqy84JE7hUKfaI0Lxm2Ttcm6ZA0bYrP");

    window.setTimeout(() => load(false), 5000);
}
