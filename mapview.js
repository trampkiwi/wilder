$(function(){
    // -------------- Initialise map ----------------

    var map = L.map('mapdiv').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        username: 'starwatcherkiwi',
        id: 'ckmv4oewx06sw17p7ezxkfw5h',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic3RhcndhdGNoZXJraXdpIiwiYSI6ImNrbXY0ODVkMjAxa2Myb205ZTFxeDVweHEifQ.fwIZz2Ljwvpv3dGH7Elp9g'
    }).addTo(map);

    // ----------------- Locate user -------------------

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

        console.error(e.message);

        // Attempt locating user again

        setTimeout(function() {
            map.locate({setView: false});
        }, 1000);
    }
    
    map.on('locationerror', onLocationError);
});