var MyMap;
mapboxgl.accessToken =
  "pk.eyJ1IjoiZnJvaWxhbmVucmlxdWV6MyIsImEiOiJja21xNjU3bWQxZ202MnBsd3lqaXZjOHpmIn0.qKVFhoneRnyPf5fAlM_rzQ";

MyMap = initMap("mapBox");

//Initialize map
function initMap(idDiv) {
  let map = new mapboxgl.Map({
    //Create new mapbox object
    container: idDiv,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-3, 40], // starting position [lng, lat]
    zoom: 7, // starting zoom
  });
  map.markers = [];
  map.on("load", function () {
    map.resize();
  });

  //   console.log("Map initialized");
  return map;
}

//Add a marker to the map, given the longitude and latitude of the address.
const addMark = (lat, lng, map = MyMap) => {
  let mark = new mapboxgl.Marker().setLngLat([lat, lng]).addTo(map);

  map.on("load", function () {
    map.resize();
  });

  removeAllMarks(map);
  map.markers.push(mark);
  map.flyTo({
    center: [lat, lng],
    essential: true, // this animation is considered essential with respect to prefers-reduced-motion
  });

  return mark;
};

const removeAllMarks = (map) => {
  if (map.markers != null) {
    for (currentMarker of map.markers) {
      currentMarker.remove();
    }
  }
};
