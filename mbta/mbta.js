

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
  Stations.map(function(station){
          var marker = new google.maps.Marker({
                  position: {lat: station.lat, lng: station.lng},
                  map: map,
                  icon: icon
          });
  })
}

var Stations = [
        {name:"South Station",    lat:42.352271,    lng:-71.05524200000001, id:"place-sstat"},
        {name:"Andrew",           lat:42.330154,    lng:-71.057655,         id:"place-andrw" },
        {name:"Porter Square",    lat:42.3884,      lng:-71.11914899999999, id:"place-porter"},
        {name:"Harvard Square",   lat:  42.373362,  lng: -71.118956,        id:"place-harsq"},
        {name:"JFK/UMass",        lat:  42.320685,  lng: -71.052391,        id:"place-jfk"},
        {name:"Savin Hill",       lat:   42.31129,  lng: -71.053331,        id:"place-shmnl"},
        {name:"Park Street",      lat:  42.35639457,lng: -71.0624242,       id:"place-pktrm"},
        {name:"Broadway",         lat:  42.342622,  lng: -71.056967,        id:"place-brdwy"},
        {name:"North Quincy",     lat:  42.275275,  lng: -71.029583,        id:"place-nqncy"},
        {name:"Shawmut",          lat:42.29312583,  lng: -71.06573796000001,id:"place-smmnl"},
        {name:"Davis",            lat:   42.39674,  lng: -71.121815,        id:"place-davis"},
        {name:"Alewife",          lat:  42.395428,  lng: -71.142483,        id:"place-alfcl"},
        {name:"Kendall/MIT",      lat:42.36249079,  lng: -71.08617653,      id:"place-knncl"},
        {name:"Charles/MGH",      lat:  42.361166,  lng: -71.070628,        id:"place-chmnl"},
        {name:"Downtown Crossing",lat:  42.355518,  lng: -71.060225,        id:"place-dwnxg"},
        {name:"Quincy Center",    lat:  42.251809,  lng: -71.005409,        id:"place-qnctr"},
        {name:"Quincy Adams",     lat:  42.233391,  lng: -71.007153,        id:"place-qamnl"},
        {name:"Ashmont",          lat:  42.284652,  lng: -71.06448899999999,id:"place-asmnl"},
        {name:"Wollaston",        lat: 42.2665139,  lng: -71.0203369,       id:"place-wlsta"},
        {name:"Fields Corner",    lat:  42.300093,  lng: -71.061667,        id:"place-fldcr"},
        {name:"Central Square",   lat:  42.365486,  lng: -71.103802,        id:"place-cntsq"},
        {name:"Braintree",        lat: 42.2078543,  lng: -71.0011385,       id:"place-brntn"}
]


function initMarkers(map){

}
