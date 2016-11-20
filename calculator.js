var baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
var EARTH_RADIUS = 6371;

function getLatAndLng(address1, address2, callback) {
    $.getJSON(baseUrl + address1.val(), function(data) {
        var info1 = addressInfo(data);
        $.getJSON(baseUrl + address2.val(), function(data) {
            var info2 = addressInfo(data);
            var physDistance = calculatePhysicalDistance(info1.point, info2.point);
            var surfDistance = calculateDistanceOnSurface(physDistance);
            callback(info1, info2, physDistance, surfDistance);
        });
    });
}

function addressInfo(data) {
    var result = {
      lat: data.results[0].geometry.location.lat,
      lng: data.results[0].geometry.location.lng,
      name: data.results[0].formatted_address,
    };
    result.point = calculateCoordinates(result.lat, result.lng);
    return result;
}

function showResults(info1, info2, physDistance, surfDistance) {
    var location1 = $('#location1');
    var location2 = $('#location2');
    var distance = $('#distance');
    printInfo(location1, info1.name, info1.lat, info1.lng, info1.point);
    printInfo(location2, info2.name, info2.lat, info2.lng, info2.point);
    distance.find('strong').filter('.phys-distance').text(physDistance);
    distance.find('strong').filter('.surf-distance').text(surfDistance);
}

function printInfo(location, addressName, lat, lng, point) {
    location.children().filter('.address').text(addressName.toUpperCase());
    location.find('strong').filter('.lat').text(lat);
    location.find('strong').filter('.lng').text(lng);
    location.find('strong').filter('.X').text(point.X);
    location.find('strong').filter('.Y').text(point.Y);
    location.find('strong').filter('.Z').text(point.Z);
}

function calculateCoordinates(lat, lng) {
    var R = EARTH_RADIUS;
    var latAngle = Math.PI / 180 * lat;
    var lngAngle = Math.PI / 180 * lng;
    var X = R * Math.cos(latAngle) * Math.sin(lngAngle);
    var Y = R * Math.sin(latAngle);
    var Z = R * Math.cos(latAngle) * Math.cos(lngAngle);
    return {"X": X, "Y": Y, "Z": Z};
}

function calculateDistanceOnSurface(d) {
    var R = EARTH_RADIUS;
    return 2 * R * Math.asin(d / (2 * R));
}

function calculatePhysicalDistance(point1, point2) {
    var x1 = point1.X;
    var y1 = point1.Y;
    var z1 = point1.Z;
    var x2 = point2.X;
    var y2 = point2.Y;
    var z2 = point2.Z;
    return Math.sqrt(
        Math.pow((x1 - x2), 2) +
        Math.pow((y1 - y2), 2) +
        Math.pow((z1 -z2), 2)
    );
}

$(document).ready(function() {
    var address1 = $('#address1');
    var address2 = $('#address2');
    var result = $('#result');
    $('#search').click(function() {
        result.slideUp('fast');
        getLatAndLng(address1, address2, showResults);
        result.slideDown('slow');
    });
});
