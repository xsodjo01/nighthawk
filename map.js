const map = L.map('map').setView([50.083333, 14.416667], 14);
map.invalidateSize()
const photoIcon = L.icon({
    iconUrl: 'img/photo-icon.svg',

    iconSize: [30, 30], // size of the icon
    iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -20] // point from which the popup should open relative to the iconAnchor
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    iconCreateFunction: function (cluster) {
        return L.divIcon({
            html: '<div class="cluster">'+ cluster.getChildCount() +'</div>',
            className: 'marker-cluster',
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });
    },
});

map.addLayer(markers);

fetch("markers.json").then(r => {
    if (r.ok) {
        r.json().then(data => {
            data.forEach(val => {
                let marker = L.marker([val["lat"], val["lng"]], {icon: photoIcon})
                    .bindPopup(val["title"])
                    .on('click', function (e) {
                        reset()
                        for (let i=1; i < val.imgs.length; i++) {
                            compare(val.imgs[i-1], val.imgs[i])
                        }
                        document.getElementById('title-of-comparison').innerHTML = val["title"]
                        document.getElementById('description').innerHTML = val["desc"]
                    })
                markers.addLayer(marker);
            })
        });
    }
});
window.dispatchEvent(new Event('resize'))