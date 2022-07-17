mapboxgl.accessToken = accessToken;
        
        let markers = [];
        // create map
        let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-71.104081, 42.365554],
            zoom: 13
        });

        function init() {

            getBusLocations().then(
                busses => {
                    busses.forEach((bus) => {
                        let lat = bus["attributes"]["latitude"];
						let long = bus["attributes"]["longitude"];
                        let dirColor;
                        if (bus["attributes"]["direction_id"] === 1) {
                            dirColor = "#ff0000";
                        } else {
                            dirColor = "#0000CD";
                        }
                        const marker = new mapboxgl.Marker({color: dirColor})
                            .setLngLat([long, lat])
                            .addTo(map);
                        
                        markers.push({id: bus["id"], bus_marker: marker})
                    })
                }
            )

            setInterval(refresh, 15000);
        }

        async function getBusLocations(){
			const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
			const response = await fetch(url)
                .catch(err => alert("An error occured fetching MBTA data", err));
			const json = await response.json();
			return json.data;
		}

        async function refresh() {
            let busses = await getBusLocations();
            // set to true if bus is found 
            
            for (let i = 0; i < busses.length; i++) {
                let busStatus = false;
                for (let j = 0; j < markers.length; j++) {
                    if (busses[i]["id"] === markers[j]["id"]) {
                        console.log(`bus ${busses[i]["id"]} already exists`);
                        // TODO shift color existing marker if direction changes
                        markers[i]["bus_marker"]
                            .setLngLat(
                                [busses[i]["attributes"]["longitude"],
                                busses[i]["attributes"]["latitude"]]
                            );
                        busStatus = true;
                        break;
                    }
                }
                if (!busStatus) {
                    console.log(`bus ${busses[i]["id"]} not found`)
                    let dirColor;
                        if (bus["attributes"]["direction_id"] === 1) {
                            dirColor = "#ff0000";
                        } else {
                            dirColor = "#0000CD";
                        }
                    const marker = new mapboxgl.Marker({color: dirColor})
                            .setLngLat(
                                [busses[i]["attributes"]["longitude"], 
                                busses[i]["attributes"]["latitude"]])
                            .addTo(map);
                    
                    markers.push({id: busses[i]["id"], bus_marker: marker});
                }
            }
        };

        init();