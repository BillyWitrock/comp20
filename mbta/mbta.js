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
  for(var i = 0; i < Stations.length - 1; i++){
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


function changeMarkerData(station, infowindow){
        var cur_time = new Date();
        var previous_time = data[station.id].last_update;
        if (previous_time != undefined && (cur_time - previous_time) <= 60000){
                update_infowindow(station, infowindow);
        }
        else {
                get_data(station,infowindow);
        }
}

function update_infowindow(station,infowindow){
        var content_string = "<h1>" + station.name + "</h1>";
        var alewife = '<h3>To Alewife</h3>';
        var Braintree = '<h3>To Braintree/Ashmont</h3>';
        // slot 0 = to ashmont; 1 = to alewife
        var departures = ["<ul>", "<ul>"];
        var arrivals = ["<ul>", "<ul>"];

        var schedule = data[station.id].data.data;
        if (schedule == undefined){content_string == "Error"} else {
        for (var i = 0; i < schedule.length; i++){
                var info = schedule[i].attributes;
                if (info.arrival_time != null){
                        arrivals[info.direction_id] +=
                                "<li>" + time_format(info.arrival_time) + "</li>";
                }
                if (info.departure_time != null){
                        departures[info.direction_id] +=
                                "<li>" + time_format(info.departure_time) + "</li>";
                }
        }

        Braintree += '<h4>Arrivals</h4>' + arrivals[0] + '</ul>' +
                     '<h4>Departures</h4>' + departures[0] + '</ul>';
        alewife += '<h4>Arrivals</h4>' + arrivals[1] + '</ul>' +
                   '<h4>Departures</h4>' + departures[1] + '</ul>';
        content_string += Braintree + alewife;
        }
        infowindow.setContent(content_string);
}

function time_format(date_string){
        var date = new Date(date_string);
        var hour = date.getHours();
        var min  = date.getMinutes();
        var day  = date.getDay();
        var AmPm = " am";
        if (hour >= 12){
                AmPm = " pm";
                hour -= 12;
        }
        var time = ((hour == 0) ? hour = "12":hour) + ":" + ((min < 10) ? "0" + min: min) + AmPm;
        return time;
}


function get_data(station,infowindow){
        var request = new XMLHttpRequest();
        var url = "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" + station.id;
        request.open("GET", url);
        request.onreadystatechange = function(){
                //want to parse data, update data object.
                if (request.readyState == 4 && request.status == 200){
                        console.log(request.responseText);
                        cur_data = JSON.parse(request.responseText);
                        data[station.id] = {data:cur_data, last_update:new Date()};
                        update_infowindow(station,infowindow);
                }
        };
        request.send();
}

// current location
if (navigator.geolocation){
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
}

function calc_closest_station(pos){
        var Alewife = new google.maps.LatLng(Stations[0].lat,Stations[0].lng);
        var closest_station = {index: 0, distance: google.maps.geometry.spherical.computeDistanceBetween(pos,Alewife)};
        for (var i = 0; i < Stations.length; i++){
                var new_place = new google.maps.LatLng(Stations[i].lat,Stations[i].lng);
                var new_distance = google.maps.geometry.spherical.computeDistanceBetween(pos,new_place);
                if (new_distance < closest_station.distance){
                        closest_station.index = i;
                        closest_station.distance = new_distance;
                }
        }
        return closest_station;
}

var data = {"place-alfcl": {data:undefined, last_update:undefined},
            "place-davis": {data:undefined, last_update:undefined},
            "place-portr":{data:undefined, last_update:undefined},
            "place-harsq": {data:undefined, last_update:undefined},
            "place-cntsq": {data:undefined, last_update:undefined},
            "place-knncl": {data:undefined, last_update:undefined},
            "place-chmnl": {data:undefined, last_update:undefined},
            "place-pktrm": {data:undefined, last_update:undefined},
            "place-dwnxg": {data:undefined, last_update:undefined},
            "place-sstat": {data:undefined, last_update:undefined},
            "place-brdwy": {data:undefined, last_update:undefined},
            "place-andrw": {data:undefined, last_update:undefined},
            "place-jfk":   {data:undefined, last_update:undefined},
            "place-nqncy": {data:undefined, last_update:undefined},
            "place-wlsta": {data:undefined, last_update:undefined},
            "place-qnctr": {data:undefined, last_update:undefined},
            "place-qamnl": {data:undefined, last_update:undefined},
            "place-brntn": {data:undefined, last_update:undefined},
            "place-shmnl": {data:undefined, last_update:undefined},
            "place-fldcr": {data:undefined, last_update:undefined},
            "place-smmnl": {data:undefined, last_update:undefined},
            "place-asmnl": {data:undefined, last_update:undefined}};

var Stations = [
        {name:"Alewife",          lat:  42.395428,  lng: -71.142483,        id:"place-alfcl"},
        {name:"Davis",            lat:   42.39674,  lng: -71.121815,        id:"place-davis"},
        {name:"Porter Square",    lat:42.3884,      lng:-71.11914899999999, id:"place-portr"},
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
