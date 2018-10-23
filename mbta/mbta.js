var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.352271, lng: -71.05524200000001},
    zoom: 13
  });
  var icon = {
          url:"mbta.jpg",
          size: new google.maps.Size(50, 50),
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(25,50)
  };
  // init infowindow
  var infowindow = new google.maps.InfoWindow({
          content: ""
  });
  // init markers
  Stations.map(function(station){
          var marker = new google.maps.Marker({
                  position: {lat: station.lat, lng: station.lng},
                  map: map,
                  icon: icon
          });
          marker.addListener('click', function(){
                  changeMarkerData(station, infowindow);
                  infowindow.open(map,marker);
          });
  })

  // create lines
  var lines = [];
  for(i = 0; i < Stations.length - 1; i++){
          var line_path = [{lat: Stations[i].lat,   lng: Stations[i].lng},
                           {lat: Stations[i+1].lat, lng: Stations[i+1].lng}];
          line = new google.maps.Polyline({
                  path: line_path,
                  geodesic: true,
                  strokeColor: 'red',
                  strokeOpacity: 1.0,
                  strokeWeight: 2
          });
          lines.push(line);
  }
  // account for the split
  lines[17] = new google.maps.Polyline({
          path: [{lat:Stations[12].lat, lng:Stations[12].lng},
                 {lat:Stations[18].lat, lng:Stations[18].lng}],
          geodesic: true,
          strokeColor: 'red',
          strokeOpacity: 1.0,
          strokeWeight: 2
  });
  // add lines to map
  lines.map(function(line){line.setMap(map)});
}


navigator.geolocation.getCurrentPosition(function(pos){
        var newCenter = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        var person = new google.maps.Marker({
                position: newCenter,
                map: map,
        });
        var closest_station = calc_closest_station(newCenter);
        var content_info = "<h1>Current Location</h1>" +
                 "<h4>The closest_station is " +
                 Stations[closest_station.index].name +
                 "</h4><h4>It is " + closest_station.distance/1609.344 +
                 " miles away.</h4>";
        person.addListener('click', function(){
                var infowindow = new google.maps.InfoWindow({
                        content: content_info
                });
                infowindow.open(map,person);
        });
        var to_nearest = new google.maps.Polyline({
                path: [newCenter, {lat:Stations[closest_station.index].lat,lng:Stations[closest_station.index].lng}],
                geodesic: true,
                strokeColor: 'red',
                strokeOpacity: 1.0,
                strokeWeight: 2
        });
        to_nearest.setMap(map);
        map.panTo(newCenter);
});

function calc_closest_station(pos){
        var Alewife = new google.maps.LatLng(Stations[0].lat,Stations[0].lng);
        var closest_station = {index: 0, distance: google.maps.geometry.spherical.computeDistanceBetween(pos,Alewife)};
        for (i = 0; i < Stations.length; i++){
                var new_place = new google.maps.LatLng(Stations[i].lat,Stations[i].lng);
                var new_distance = google.maps.geometry.spherical.computeDistanceBetween(pos,new_place);
                if (new_distance < closest_station.distance){
                        closest_station.index = i;
                        closest_station.distance = new_distance;
                }
        }
        return closest_station;
}

var data;
var previous_time = undefined;
function changeMarkerData(station, infowindow){
        var cur_time = new Date();
        if (previous_time == undefined){
                get_data();
        }
        // updates every click if previous click was over a min ago
        else if(previous_time - cur_time >= 60000){
                get_data();
        }
        previous_time = cur_time;

}

function get_data(){

}

var Stations = [
        {name:"Alewife",          lat:  42.395428,  lng: -71.142483,        id:"place-alfcl"},
        {name:"Davis",            lat:   42.39674,  lng: -71.121815,        id:"place-davis"},
        {name:"Porter Square",    lat:42.3884,      lng:-71.11914899999999, id:"place-porter"},
        {name:"Harvard Square",   lat:  42.373362,  lng: -71.118956,        id:"place-harsq"},
        {name:"Central Square",   lat:  42.365486,  lng: -71.103802,        id:"place-cntsq"},
        {name:"Kendall/MIT",      lat:42.36249079,  lng: -71.08617653,      id:"place-knncl"},
        {name:"Charles/MGH",      lat:  42.361166,  lng: -71.070628,        id:"place-chmnl"},
        {name:"Park Street",      lat:  42.35639457,lng: -71.0624242,       id:"place-pktrm"},
        {name:"Downtown Crossing",lat:  42.355518,  lng: -71.060225,        id:"place-dwnxg"},
        {name:"South Station",    lat:42.352271,    lng:-71.05524200000001, id:"place-sstat"},
        {name:"Broadway",         lat:  42.342622,  lng: -71.056967,        id:"place-brdwy"},
        {name:"Andrew",           lat:42.330154,    lng:-71.057655,         id:"place-andrw" },
        {name:"JFK/UMass",        lat:  42.320685,  lng: -71.052391,        id:"place-jfk"},
        {name:"North Quincy",     lat:  42.275275,  lng: -71.029583,        id:"place-nqncy"},
        {name:"Wollaston",        lat: 42.2665139,  lng: -71.0203369,       id:"place-wlsta"},
        {name:"Quincy Center",    lat:  42.251809,  lng: -71.005409,        id:"place-qnctr"},
        {name:"Quincy Adams",     lat:  42.233391,  lng: -71.007153,        id:"place-qamnl"},
        {name:"Braintree",        lat: 42.2078543,  lng: -71.0011385,       id:"place-brntn"},
        {name:"Savin Hill",       lat:   42.31129,  lng: -71.053331,        id:"place-shmnl"},
        {name:"Fields Corner",    lat:  42.300093,  lng: -71.061667,        id:"place-fldcr"},
        {name:"Shawmut",          lat:42.29312583,  lng: -71.06573796000001,id:"place-smmnl"},
        {name:"Ashmont",          lat:  42.284652,  lng: -71.06448899999999,id:"place-asmnl"}
]
