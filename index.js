$(function(){
    // Initialise map

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

    // Locate user

    map.locate({setView: true, maxZoom: 16});
    
    function onLocationFound(e) {
        var err = e.accuracy;

        L.marker(e.latlng, {icon: userPosIcon}).addTo(map);

        L.circle(e.latlng, {radius: err, color: '#3c6942'}).addTo(map);
    }
    
    map.on('locationfound', onLocationFound);

    function onLocationError(e) {
        alert(e.message);
    }
    
    map.on('locationerror', onLocationError);
});