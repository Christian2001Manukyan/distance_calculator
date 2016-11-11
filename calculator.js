function getLatAndLng(address1, address2) {
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        address1.val();
    $.getJSON(url, function(data) {
        var lat = (data.results[0].geometry['location'].lat).toFixed(3);
        var lng = (data.results[0].geometry['location'].lng).toFixed(3);
        var name = data.results[0].formatted_address;
        var point1 = calculateCoordinates(lat, lng);
        printInfo(name, lat, lng, point1);
        url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            address2.val();
        $.getJSON(url, function(data) {
            lat = (data.results[0].geometry['location'].lat).toFixed(3);
            lng = (data.results[0].geometry['location'].lng).toFixed(3);
            name = data.results[0].formatted_address;
            var point2 = calculateCoordinates(lat, lng);
            var Distance = calculatePhysicalDistance(point1, point2);
            printInfo(name, lat, lng, point2);
            $('#result').html($('#result').html() +
                    '<h3 style="color: red">Physical Distance: ' +
                    Distance + ' km</h3>' + '<hr>' +
                    '<h3 style="color: red">Distance on Surface: ' +
                    calculateDistanceOnSurface(Distance) + ' km</h3>');
        });
    });
}

function printInfo(addressName, lat, lng, point) {
    var result = $('#result');
    result.html(result.html() +
    '<h3>' + addressName.toUpperCase() + ': ' + '</h3>' +
    '<h4>Latitude: ' + lat + '</h4>' +
    '<h4>Longitude: ' + lng + '<h4>' +
    '<h4>Coordinates: ' + '</h4>' +
    '<h4>X: ' + point.X + '</h4>' +
    '<h4>Y: ' + point.Y + '</h4>' +
    '<h4>Z: ' + point.Z + '</h4>'+ '<hr>');
}

function calculateCoordinates(lat, lng) {
    var R = 6371;
    var latAngle = Math.PI / 180 * lat;
    var lngAngle = Math.PI / 180 * lng;
    var X = (R * Math.cos(latAngle) * Math.sin(lngAngle)).toFixed(3);
    var Y = (R * Math.sin(latAngle)).toFixed(3);
    var Z = (R * Math.cos(latAngle) * Math.cos(lngAngle)).toFixed(3);
    return {"X": X, "Y": Y, "Z": Z};
}

function calculateDistanceOnSurface(d) {
    var R = 6371;
    var sinAlfa = d * Math.sqrt(4 * Math.pow(R, 2) - Math.pow(d, 2)) / (2 * Math.pow(R, 2));
    var alfa = Math.asin(sinAlfa).toFixed(3);
    var distance = (alfa * R).toFixed(3);
    return distance;
}

function calculatePhysicalDistance(point1, point2) {
    var x1 = point1.X;
    var y1 = point1.Y;
    var z1 = point1.Z;
    var x2 = point2.X;
    var y2 = point2.Y;
    var z2 = point2.Z;
    var distance = Math.sqrt(
            Math.pow((x1 - x2), 2) +
            Math.pow((y1 - y2), 2) +
            Math.pow((z1 -z2), 2)
            ).toFixed(3);
    return distance;
}

$(document).ready(function() {
    var address1 = $('#address1');
    var address2 = $('#address2');
    var result = $('#result');
    $('#search').click(function() {
        result.slideUp('fast');
        result.html('');
        getLatAndLng(address1, address2);
        result.slideDown('slow');
    });
});
