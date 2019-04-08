fetch('https://utils.pauliankline.com/stops.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {
        console.log(JSON.stringify(myJson));
    });

function toRadians(number) {
    return (number * Math.PI / 180);
}
function getDistance(lat1, lat2, lon1, lon2) {
    //code adapted from: https://stackoverflow.com/questions/13840516/how-to-find-my-distance-to-a-known-location-in-javascript
    let rad = 6371; // Radius of the earth in km
    let dLat = toRadians(Math.abs(lat1 - lat2));  // Javascript functions in radians
    let dLon = toRadians(Math.abs(lon1 - lon2));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distanceKM = rad * c;
    return distanceKM;
}
const app = new Vue({
    el: '#app',
    data: {
        stops: [],
        numStops: 10,
        latitude: 0,
        longitude: 0,
        distance: 999999
    },

    computed: {
        filteredStops: function () {
            this.stops.sort(function (a, b) { return a.distance - b.distance });
            return (this.stops.slice(0, this.numStops))
        }
    },
    methods: {
        computeDistance: function () {
            for (let i = 0; i < this.stops.length; i++) {
                this.stops[i].distance = getDistance(this.latitude, this.stops[i].lat, this.longitude, this.stops[i].lon);
            }
        }
    },
    created: function () {
        fetch('https://utils.pauliankline.com/stops.json')
            .then(function (response) {
                return response.json();
            })
            .then(myJson => this.stops = myJson)
            .then(() => { if (this.stops.length != 0) console.log("storing stop data success!!") });
        //the code below was adapted from : https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
        if ("geolocation" in navigator) {
            function geo_success(position) {
                this.latitude = position.coords.latitude
                this.longitude = position.coords.longitude;
                console.log("Latitude: " + this.latitude)
                console.log("Longitude: " + this.longitude)

                this.computeDistance();
            }
            function geo_error() {
                alert("Sorry, no position available.");
            }
            var geo_options = {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            };
            navigator.geolocation.watchPosition(geo_success.bind(this), geo_error, geo_options);
        }
        else {
            console.log("Unable to detect user location :'(");
        }
    }
})