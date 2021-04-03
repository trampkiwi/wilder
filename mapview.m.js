function lerp(xa, ya, xb, yb, x) { // Linearly interpolating function (xa < xb)
    return ya + (yb-ya)/(xb-xa)*(x-xa);
}

function lerpCapped(xa, ya, xb, yb, x) { // 'Capped' lerp function (xa < xb)
    if(x < xa) { return ya; }
    else if(x > xb) { return yb; }
    else {
        return lerp(xa, ya, xb, yb, x);
    }
}

// ------------- For calculating marker size based on the zoom level and some numerical variable --------
/*
    minZoomLevel: the zoom level below which all markers will become 'invisible'
    fullVisAtMin: the numerical value corresponding to a marker that will "stop" being fully visible at the minZoomLevel
    maxZoomLevel: a zoom level above this will cause all markers to take on their maximum size
    fullVisAtMax: the numerical value corresponding to a marker that will only be fully visible at maxZoomLevel or above
    maxDiam: the maximum diameter of the marker
    val: the numerical variable
    currentZoomLevel: the current zoom level
    zoomEasein: a marker will disappear or fully appear across this number of zoom levels
*/
// In our use case, val represents the 'weight' an actor has.
function calcMarkerDiam(val, currentZoomLevel, options) {
    if(options === undefined) {
        options = {
            minZoomLevel: 9,
            fullVisAtMin: 100,
            maxZoomLevel: 14,
            fullVisAtMax: 1,
            maxDiam: 40,
            zoomEaseIn: 2
        };
    }

    var fullVisZoom = lerpCapped(options.fullVisAtMax, options.maxZoomLevel, options.fullVisAtMin, options.minZoomLevel, val);
    console.log([fullVisZoom-options.zoomEaseIn, 0, fullVisZoom, options.maxDiam, currentZoomLevel]);

    var diam = lerpCapped(fullVisZoom-options.zoomEaseIn, 0, fullVisZoom, options.maxDiam, currentZoomLevel)
    console.log(diam);

    return diam; // The magic of a double lerp...
}


$(function(){
    // -------------- Initialise map ----------------
    
    var map = L.map('mapdiv', {
        zoomControl: false
    }).setView([51.505, -0.09], 15);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        username: 'starwatcherkiwi',
        id: 'ckmv4oewx06sw17p7ezxkfw5h',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic3RhcndhdGNoZXJraXdpIiwiYSI6ImNrbXY0ODVkMjAxa2Myb205ZTFxeDVweHEifQ.fwIZz2Ljwvpv3dGH7Elp9g'
    }).addTo(map);

    // -------------- Test code to see zoom level -----------------

    /*map.on('zoomend', () => {
        console.log(map.getZoom());
    });*/

    // -------------- Marker Diam Calc test markers ---------------

    var markers = [];
    for(var i = 0; i < 7; i++) {
        var lat = 51.573646 + 0.005 * i;
        var long = -0.032916;
        var weight = lerp(0, 1, 6, 100, i);

        var marker = L.marker([lat, long]);
        marker.prop = {
            weight: weight
        };

        var diam = calcMarkerDiam(weight, map.getZoom());

        var markerIcon = L.icon({
            iconUrl: 'Assets/posMarker.png',
            iconSize: [diam, diam]
        });

        marker.setIcon(markerIcon);

        marker.addTo(map);

        markers.push(marker);
    }

    map.on('zoomend', () => {
        var currentZoom = map.getZoom();
        console.log(currentZoom);
        
        markers.forEach((marker) => {
            var diam = calcMarkerDiam(marker.prop.weight, currentZoom);
            var icon = marker.getIcon();
            icon.options.iconSize = [diam, diam];
            marker.setIcon(icon);
        });
    })

    // ----------------- Locate user -------------------

    /*var locationMarker = L.marker([0, 0], {icon: userPosIcon});
    var locationCircle = L.circle([0, 0], {radius: 1, color: '#3c6942'});

    locationMarker.addTo(map);
    locationCircle.addTo(map);*/

    /*map.locate({setView: true, maxZoom: 16});
    
    function onLocationFound(e) {
        locationMarker.setLatLng(e.latlng);
        locationCircle.setLatLng(e.latlng);
        locationCircle.setRadius(e.accuracy);

        // Loop again for user position

        setTimeout(function() {
            map.locate({setView: false});
        }, 1000);
    }
    
    map.on('locationfound', onLocationFound);

    function onLocationError(e) {
        // Log error

        console.error(e.message);

        // Attempt locating user again

        setTimeout(function() {
            map.locate({setView: false});
        }, 1000);
    }
    
    map.on('locationerror', onLocationError);*/

    // -------------- Load 

    // -------------- Menu button functionality ---------------

    $('#menubutton').on('click', function() {
        $('.navBar').css('height', '70%');
    });

    $('#closemenu').on('click', function() {
        $('.navBar').css('height', '0');
    });
});