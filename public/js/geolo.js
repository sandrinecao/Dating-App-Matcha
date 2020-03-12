
function maPosition(position) {
    var infopos = position.coords.latitude +", "+position.coords.longitude;
    document.getElementById("geolo").value = infopos;
}

function errorHandler(err) {
 
 var obj ;

    fetch('https://ipapi.co/json/')
    .then((resp) => resp.json())
    .then(data => obj = data)
    .then(() => document.getElementById("geolo").value = obj.latitude+ ", "+obj.longitude) ;
 }

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(maPosition, errorHandler);
    }


function initialize() {
    var address = (document.getElementById('pac-input'));
    var autocomplete = new google.maps.places.Autocomplete(address);
    autocomplete.setTypes(['geocode']);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        var savelat = place.geometry.location.lat()
        var savelong = place.geometry.location.lng();
        document.getElementById('position').value = savelat + ", " + savelong;
       
    });
}

google.maps.event.addDomListener(window, 'load', initialize);