import React from 'react'
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXF1YWltcGFjdCIsImEiOiJja2R0d2N3emswdzlwMnptcGliNTk4ZHNkIn0.jPYEzZD-aErgL25Zx9N_Kg';

let map
let counter = 0
let popup
let source
let randomNum = 0


class MainMap extends React.Component{
    
    constructor(props){
        super(props)

        this.state = {
            lng: 103.851959,
            lat: 1.290270,
            zoom: 10.5,
            souceColors: {},
        };

        this.mapContainer = React.createRef();
    }

    componentDidMount() {

        
        map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        // Create a popup, but don't add it to the map yet.
        var popup2 = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        popup = popup2

        var size = 100

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

        map.on('click', 'placeIDs', this.mapClicked);

        map.on('mouseenter', 'placeIDs', this.mapMouseEnter);
            
        map.on('mouseleave', 'placeIDs', this.mapMouseLeave);


        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
    }

    mapClicked = (e) => {
        var movementID = e.features[0].properties.movementID;
        this.props.dataRetrieved(movementID)
    }

    mapMouseEnter = (e) => {
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

    mapMouseLeave = () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    }

    static generateColor(){
        var x = Math.random()

        while(x == randomNum){
            x = Math.random()
        }

        randomNum = x
        let n = (x * 0xfffff * 1000000).toString(16);
        return '#' + n.slice(0, 6);
    }

    static getDatetime(datetime, selection){

        // 20/7/2020 8:00
        let date = datetime.split(" ")
        let fulldate = date[0].split("/")
        

        let mon = fulldate[1]
        let day = fulldate[0]
        let year = fulldate[2]
        let fullTime = date[1].split(":")
        let hh = fullTime[0]
        let min = fullTime[1]

        // const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const shortmonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

        let finalDatetime
        if(selection === "d"){
            finalDatetime = day + " " + shortmonthNames[parseInt(mon)-1] + " " + year
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
        // else if(selection == "dt"){
        //     finalDatetime = new Date(datetime)
        // }
        return finalDatetime
    }

    static hexColorDelta(hex1, hex2) {
        // get red/green/blue int values of hex1
        var r1 = parseInt(hex1.substring(0, 2), 16);
        var g1 = parseInt(hex1.substring(2, 4), 16);
        var b1 = parseInt(hex1.substring(4, 6), 16);
        // get red/green/blue int values of hex2
        var r2 = parseInt(hex2.substring(0, 2), 16);
        var g2 = parseInt(hex2.substring(2, 4), 16);
        var b2 = parseInt(hex2.substring(4, 6), 16);
        // calculate differences between reds, greens and blues
        var r = 255 - Math.abs(r1 - r2);
        var g = 255 - Math.abs(g1 - g2);
        var b = 255 - Math.abs(b1 - b2);
        // limit differences between 0 and 1
        r /= 255;
        g /= 255;
        b /= 255;
        // 0 means opposit colors, 1 means same colors
        return (r + g + b) / 3;
    }

    static getDerivedStateFromProps(props, state){


        console.log("Yays")
        source = {}
        // console.log(map.style.sourceCaches);
        if(props.profile.length > 0 && props.movement.length > 0 ){
          
            let mappedResults = props.profile.map(x => {
                return({
                    profile: x,
                    movements: props.movement.filter(xx => xx.suspectId === x.id)
                })
            })

            // Accepts the array and key
            const groupBy = (array, key) => {
                // Return the end result
                return array.reduce((result, currentValue) => {
                // If an array already present for key, push it to the array. Else create an array and push the object
                (result[currentValue[key]] = result[currentValue[key]] || []).push(
                    currentValue
                );
                // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                return result;
                }, {}); // empty object is the initial value for result object
            };
            
            // Group by location address as key to the person array
            const personGroupedByColor = groupBy(props.movement, 'locationShortaddress');
            
            // console.log(personGroupedByColor)

            var UPoints = Object.keys(personGroupedByColor).map(function(key) {
                if(personGroupedByColor[key].length === 1){
                    let item = personGroupedByColor[key][0]
                    return({
                        'type': 'Feature',
                        'properties': {
                            'movementID':item.id,
                            'enter': item.datetimeEntered,
                            'leave': item.datetimeLeft,
                            'placeID': item.locationShortaddress,
                            'marker-symbol': '1',
                            'marker-color': '#3bb2d0',
                            'marker-size': 'large',
                            'description':
                                `<strong>${item.locationShortaddress}</strong><p>Time Entered: ${MainMap.getDatetime(item.datetimeEntered, 't')}</p><p>Time Left: ${MainMap.getDatetime(item.datetimeLeft, 't')}</p><p>Date: ${MainMap.getDatetime(item.datetimeLeft, 'd')}</p>`
                            },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [item.locationLong, item.locationLat],
                        },
                    })
                }
                else{
                    let movementID = personGroupedByColor[key].map(x => x.id )
                    // console.log(movementID)

                    let enter = personGroupedByColor[key].map(x => x.datetimeEntered )
                    let leave = personGroupedByColor[key].map(x => x.datetimeLeft)
                    let placeID = key

                    let text = `<strong>${key}</strong>`
                    // console.log(placeID)
                    personGroupedByColor[key].forEach(xx => {
                        let name = props.profile.filter(x => x.id === xx.suspectId).map(x => {
                            return(x.firstName + " " + x.lastName)
                        })
                        text += `<p>${name}</p>`
                        text += `<p>Time Entered: ${MainMap.getDatetime(xx.datetimeEntered, 't')}</p><p>Time Left: ${MainMap.getDatetime(xx.datetimeLeft, 't')}</p><p>Date: ${MainMap.getDatetime(xx.datetimeLeft, 'd')}</p>`
                    })

                    // console.log(text)
                    // let description = `<strong>${item.locationShortaddress}</strong><p>Time Entered: ${that.getDatetime(item.datetimeEntered, 't')}</p><p>Time Left: ${that.getDatetime(item.datetimeLeft, 't')}</p><p>Date: ${that.getDatetime(item.datetimeLeft, 'd')}</p>`

                    return({
                        'type': 'Feature',
                        'properties': {
                            'movementID': movementID,
                            'enter': enter,
                            'leave': leave,
                            'placeID': placeID,
                            'description': text,
                            },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [personGroupedByColor[key][0].locationLong, personGroupedByColor[key][0].locationLat]
                        }
                    })
                }
            });

            for(var key in map.style.sourceCaches){
                console.log(key)
                if(key != 'composite'){
                    map.removeLayer(key)
                    map.removeSource(key)
                }
            }

            var sourceIDs = []

            var colorPrevious = ""
            
            mappedResults.forEach(e => {

                let lol = Math.floor(Math.random() * 101).toString()

                while(sourceIDs.includes(lol)){
                    lol = Math.floor(Math.random() * 101).toString()
                }

                let UMovements = e.movements.map(x => {
                    return([x.locationLong, x.locationLat])
                })

                map.addSource(lol, {
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

                let color = MainMap.generateColor()
                if(colorPrevious != ""){
                    while(MainMap.hexColorDelta(color, colorPrevious) > 0.2){
                        color = MainMap.generateColor()
                    }
                }
                colorPrevious = color

                
                source = {...source, [color]: e.profile.firstName + " " + e.profile.lastName}
                
                map.addLayer({
                    'id': lol,
                    'type': 'line',
                    'source': lol,
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': color,
                        'line-width': 5
                    }
                });

                sourceIDs.push(lol)
            })

            map.addSource('placeIDs', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': UPoints
                }
            });

            // Add a layer showing the places.
            map.addLayer({
                'id': 'placeIDs',
                'type': 'symbol',
                'source': 'placeIDs',
                'layout': {
                    // "line-cap": "round",
                    // "line-join": "round"
                    'icon-image': 'pulsing-dot',
                    'icon-allow-overlap': true
                }
            });
            
            counter += 1
        } 
        
        return true;
    }

    render(){
        
        let legend = []
        for(var key in source){
            legend.push(
                <div style={{marginRight:"20px"}}>
                    {/* <hr style={{borderTop: "10px solid " + {key}, width:"50px"}}/>  */}
                    <span style={{height:"16px", width: "50px", backgroundColor: key, borderRadius: "20%", display: "inline-block"}}></span>
                    <h5 style={{display: "inline-block", marginLeft:"10px"}}>{source[key]}</h5>
                </div>
            )
        }
        return(
            <>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                   {legend}
                </div>
                <div style={{position:"relative",height:"700px", width:"100%"}}>
                    <div ref={el => this.mapContainer = el} style={{position:"reletive", width:"inherit", height:"inherit"}}/>
                </div>
            </>
            
        )
    }

}

export default MainMap