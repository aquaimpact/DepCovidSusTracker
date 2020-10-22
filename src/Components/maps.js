import React from 'react'
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXF1YWltcGFjdCIsImEiOiJja2R0d2N3emswdzlwMnptcGliNTk4ZHNkIn0.jPYEzZD-aErgL25Zx9N_Kg';

let map
let popup
let source

class Maps extends React.Component{

    constructor(props){
        super(props)
        
        this.state = {
            lng: 103.851959,
            lat: 1.290270,
            zoom: 10.5,
            movements:[],
        };

        this.mapContainer = React.createRef();
    }

    getMovements(id){
        fetch(`https://internshipcsit.herokuapp.com/getMovementbyID?IDs=${id}`).then(r => r.json()).then(data => this.setState({movements:data})).catch(err => {console.log(err)})
    }

    componentDidMount() {
        this.getMovements(this.props.UID)

        map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        var size = 100
        
        // Create a popup, but don't add it to the map yet.
        var popup2 = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        popup = popup2

        var pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),
             
            // get rendering context for the map canvas when layer is added to the map
            onAdd: function () {
                var canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');
            },
             
            // called once before every frame where the icon will be used
            render: function () {
                var duration = 1000;
                var t = (performance.now() % duration) / duration;
                
                var radius = (size / 2) * 0.3;
                var outerRadius = (size / 2) * 0.7 * t + radius;
                var context = this.context;
                
                // draw outer circle
                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    outerRadius,
                    0,
                    Math.PI * 2
                );
            context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
            context.fill();
             
            // draw inner circle
            context.beginPath();
            context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
            );
            context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();
             
            // update this image's data with data from the canvas
            this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
            ).data;
             
            // continuously repaint the map, resulting in the smooth animation of the dot
            map.triggerRepaint();
             
            // return `true` to let the map know that the image was updated
            return true;
            }
        };

        map.on('click', 'places', this.mapClicked);

        map.on('mouseenter', 'places', this.mapEnter);
            
        map.on('mouseleave', 'places', this.mapLeave);

        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
    }

    mapClicked = (e) => {
        var description = e.features[0].properties.description;
        var movementID = e.features[0].properties.movementID;
        var enter = e.features[0].properties.enter;
        var leave = e.features[0].properties.leave;
        // console.log(movementID)
        this.getPeople(movementID, enter, leave)
    }

    mapEnter = (e)  => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
            
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;
        
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    }

    mapLeave = () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    }

    getDatetime(datetime, selection){
        let date = new Date(datetime)
        date = (date + "").split(" ")
        let mon = date[1]
        let day = date[2]
        let year = date[3]
        let fullTime = date[4].split(":")
        let hh = fullTime[0]
        let min = fullTime[1]
        let sec = fullTime[2]

        // const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        let finalDatetime
        if(selection === "d"){
            finalDatetime = day + " " + mon + " " + year
        }
        else if(selection === "t"){
            let timing = "AM"
            if(parseInt(hh) === 12){
                timing = "PM"
            }
            if(parseInt(hh) > 12){
                hh = parseInt(hh) - 12
                timing = "PM"
            }
            finalDatetime = hh + ":" + min + " " + timing
        }
        else if(selection === "dt"){
            finalDatetime = new Date(datetime)
        }
        return finalDatetime
    }

    getPeople(id, enter, leave)
    {
        fetch(`https://internshipcsit.herokuapp.com/getPeopleTiming?IDs=${id}`).then(r => r.json()).then((data) => {this.props.callbackFromParent({data:data, enter:enter, leave:leave})}).catch(err => {console.log(err)})
    }

    componentDidUpdate(){

        console.log(this.state.movements)

        for(var key in map.style.sourceCaches){
            console.log(key)
            if(key != 'composite'){
                map.removeLayer(key)
                map.removeSource(key)
            }
            // console.log(map.getStyle().layers)
        }

        let UPoints = this.state.movements.map(x => {
            return({
                'type': 'Feature',
                'properties': {
                    'movementID': x.id,
                    'enter': x.datetimeEntered,
                    'leave': x.datetimeLeft,
                    'description':
                        `<strong>${x.locationShortaddress}</strong><p>Time Entered: ${this.getDatetime(x.datetimeEntered, 't')}</p><p>Time Left: ${this.getDatetime(x.datetimeLeft, 't')}</p><p>Date: ${this.getDatetime(x.datetimeLeft, 'd')}</p>`
                    },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [x.locationLong, x.locationLat]
                }
            })
        })

        let UMovements = this.state.movements.map(x => {
            return([x.locationLong, x.locationLat])
        })

        console.log("Maps debug 1")

        let that = this
       
        map.addSource('route', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': UMovements
                }
            }
        });

        console.log("Maps debug 2")
        
        map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#888',
                'line-width': 5
            }
        });

        console.log("Maps debug 3")

        map.addSource('places', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': UPoints
            }
        });

        console.log("Maps debug 4")
        
        // Add a layer showing the places.
        map.addLayer({
            'id': 'places',
            'type': 'symbol',
            'source': 'places',
            'layout': {
                // "line-cap": "round",
                // "line-join": "round"
                'icon-image': 'pulsing-dot',
                'icon-allow-overlap': true
            }
        });

        console.log("Maps debug 5")
    }

    render(){

        return(
            <div style={{position:"relative",height:"300px", width:"100%"}}>
                <div ref={el => this.mapContainer = el} style={{position:"reletive", width:"inherit", height:"inherit", overflow: "visible"}}/>
            </div>
            
        )
    }
}

export default Maps