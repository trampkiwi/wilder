var map;
var observations = []; // Same format as in the realtime database
var observationMarkers = []; // Array of L.markers
var interactions = []; // Same format as in the realtime database
var interactionMarkers = []; // Array of L.markers

var observationLoadCallbackID;
var interactionLoadCallbackID;

var firebaseDB;

// ----------- Lerp util --------

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
            minZoomLevel: 10,
            fullVisAtMin: 100,
            maxZoomLevel: 14,
            fullVisAtMax: 1,
            maxDiam: 30,
            zoomEaseIn: 2
        };
    }

    var fullVisZoom = lerpCapped(options.fullVisAtMax, options.maxZoomLevel, options.fullVisAtMin, options.minZoomLevel, val);

    var diam = lerpCapped(fullVisZoom-options.zoomEaseIn, 0, fullVisZoom, options.maxDiam, currentZoomLevel);

    return diam; // The magic of a double lerp...
}

// ---------------- For calculatig geohash from Leaflet Latlng object ------------
/*
    Geohashing rule:
        E
    2   3 N
    0   1
*/

function latlngToGeohash(latlng, prec) {
    var uLat = latlng.lat + 90;
    var uLong = latlng.lng + 180;

    var geohash = '';

    var latGrad, longGrad, latI, longI;

    for(var i = 1; i < prec+1; i++) {
        latGrad = 180 / (1 << i); // latitude graduation for the precision level
        longGrad = 360 / (1 << i); // for longitude
        
        latI = Math.min(Math.floor(uLat / latGrad), 1); // min to account for edge cases.
        longI = Math.min(Math.floor(uLong / longGrad), 1);

        geohash = geohash + (latI * 2 + longI).toString();

        uLat = uLat - latI * latGrad;
        uLong = uLong - longI * longGrad;
    }

    return geohash;
}

function latlngToGeohashSingle(latlng, prec) { // Returns geohash number at exactly the given precision.
    var uLat = latlng.lat + 90;
    var uLong = latlng.lng + 180;

    var geohash = '';

    var latGrad, longGrad, latI, longI;

    latGrad = 180 / (1 << prec); // latitude graduation for the precision level
    longGrad = 360 / (1 << prec); // for longitude

    uLat = uLat % (latGrad * 2);
    uLong = uLong % (longGrad * 2);
        
    latI = Math.min(Math.floor(uLat / latGrad), 1); // min to account for edge cases.
    longI = Math.min(Math.floor(uLong / longGrad), 1);

    geohash = geohash + (latI * 2 + longI).toString();

    uLat = uLat - latI * latGrad;
    uLong = uLong - longI * longGrad;

    return geohash;
}

// -------------- Find geohashes of the given precision that overlaps with the latlngBounds object ----------

function findOverlappingGeoTiles(latlngBounds, prec) {
    var uWest = latlngBounds.getWest() + 180;
    var uEast = latlngBounds.getEast() + 180;
    var uNorth = latlngBounds.getNorth() + 90;
    var uSouth = latlngBounds.getSouth() + 90;

    var latGrad = 180 / (1 << prec);
    var longGrad = 360 / (1 << prec);

    var samplingLats = Array(
        Math.floor(uNorth / latGrad) - Math.floor(uSouth / latGrad) + 1 // The number of columns of tiles
    ).fill(0).map((_, i) => {
        return (Math.floor(uSouth / latGrad) + i + 0.5) * latGrad - 90;
    });
    var samplingLngs = Array(
        Math.floor(uEast / longGrad) - Math.floor(uWest / longGrad) + 1 // The number of columns of tiles
    ).fill(0).map((_, i) => {
        return (Math.floor(uWest / longGrad) + i + 0.5) * longGrad - 180;
    });

    console.log(samplingLats, samplingLngs);

    var geohashes = [];

    for(var latI = 0; latI < samplingLats.length; latI++) {
        for(var longI = 0; longI < samplingLngs.length; longI++) {
            geohashes.push(latlngToGeohash({
                lat: samplingLats[latI],
                lng: samplingLngs[longI]
            }, prec));
        }
    }

    return geohashes;
}

// ----------------- Init -----------------

function loadObservations() { // Called when user stays at some position for 1.5 seconds
    /*console.log('loading observations...');

    var precLevel = map.getZoom() - 1;

    var geohashes = findOverlappingGeoTiles(map.getBounds(), precLevel); // Find geohashes to load data from

    geohashes.forEach((geohash, i) => {
        firebaseDB.ref('observation_from_')
    });*/
}

function initialiseMap() {
    // -------------- Initialise map ----------------
    
    map = L.map('mapdiv', {
        zoomControl: false
    }).setView([51.505, -0.09], 15);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        minZoom: 1,
        username: 'starwatcherkiwi',
        id: 'ckmv4oewx06sw17p7ezxkfw5h',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic3RhcndhdGNoZXJraXdpIiwiYSI6ImNrbXY0ODVkMjAxa2Myb205ZTFxeDVweHEifQ.fwIZz2Ljwvpv3dGH7Elp9g'
    }).addTo(map);

    map.on('zoomend', () => {
        clearTimeout(observationLoadCallbackID);
        
        var currentZoom = map.getZoom();

        console.log(currentZoom);

        // TODO: loading feedback for user

        observationLoadCallbackID = setTimeout(loadObservations, 1500);

        var markerResizeFromZoom = (marker) => {
            var diam = calcMarkerDiam(marker.prop.weight, currentZoom);
            var icon = marker.getIcon();
            icon.options.iconSize = [diam, diam];
            marker.setIcon(icon);
        };
        
        observationMarkers.forEach(markerResizeFromZoom);
        interactionMarkers.forEach(markerResizeFromZoom);
    });

    map.on('moveend', () => {
        clearTimeout(observationLoadCallbackID);

        console.log('move ended!');

        observationLoadCallbackID = setTimeout(loadObservations, 1500);
    });
}

function initialisePage() {
    $('.all_content').css('display', 'block');

    initialiseMap();

    // -------------- Marker Diam Calc test markers ---------------

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

        observationMarkers.push(marker);
    }

    // ----------------- Locate user -------------------

    var userPosIcon = L.icon({
        iconUrl: 'Assets/posMarker.png',
        iconSize: [20, 20]
    });

    var locationMarker = L.marker([0, 0], {icon: userPosIcon});
    var locationCircle = L.circle([0, 0], {radius: 1, color: '#3c6942'});

    locationMarker.addTo(map);
    locationCircle.addTo(map);

    map.locate({setView: true, maxZoom: 16});
    
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

        console.error(e);

        // Attempt locating user again

        // TODO: show location error prompt
        /*setTimeout(function() {
            map.locate({setView: false});
        }, 1000);*/
    }
    
    map.on('locationerror', onLocationError);

    // -------------- Load 

    // -------------- Menu button functionality ---------------

    $('#menubutton').on('click', function() {
        $('.navBar').css('height', '70%');
    });

    $('#closemenu').on('click', function() {
        $('.navBar').css('height', '0');
    });
}

$(async function(){
    // -------------- Check user ---------------

    /*firebase.auth().onAuthStateChanged((user) => {
        if(user) { // User logged in
            var db = firebase.database();
    
            var uid = firebase.auth().currentUser.uid;
    
            db.ref('/users/' + uid).once('value').then((snapShot) => { // User is authorised.
                var dat = snapShot.val();
                
                if(dat == null) { // User has not registered before.
                    window.location.replace('/signin_complete.m.html'); // Redirect to signup complete page.
                } else { // User has registered before.
                    initialiseMap();
                }
            }).catch((err) => { // If error occurs
                if(err.code == 'PERMISSION_DENIED') { // Current login is invalid.
                    window.location.replace('/invalid_user.m.html'); // Redirect to invalid user page.
                } else {
                    alert(err);
                    
                    throw err;
                }
            });
        } else { // User not logged in
            window.location.replace('/');
        }
    });*/

    // TODO: put initialiseMap() back into the authstate check code.

    firebaseDB = firebase.database();

    initialisePage();
    
});