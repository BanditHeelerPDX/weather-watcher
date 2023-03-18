const apiKey = '796d4a60796f715c7b650eb7c5eade88';
let userInput = document.getElementById('search');
const submit = document.getElementById('searchBtn');
const persistentLocationsEl = document.getElementById('persistentLocations');
let persistentLocations = [];

submit.addEventListener('click', function(event) {
    event.preventDefault();

    const location = userInput.value;
    
    const coordURL = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${apiKey}`;

    fetch(coordURL)
        .then((response) => response.json())
        .then((geoData) => {
            console.log(geoData);
            const lat = geoData[0].lat;
            const lon = geoData[0].lon;
    
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(weatherURL)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
    const mainTemp = parseInt(data.main.temp);
    const feelsLikeTemp = parseInt(data.main.feels_like);
    const minTemp = parseInt(data.main.temp_min);
    const maxTemp = parseInt(data.main.temp_max);
    const cloudiness = data.clouds.all;
    const snowVolumeLast3Hrs = data.snow ? data.snow['3h'] : 'N/A';

    const mainTempEl = document.createElement("div");
    const feelsLikeTempEl = document.createElement("p");
    const minTempEl = document.createElement("p");
    const maxTempEl = document.createElement("p");
    const cloudinessEl = document.createElement("p");
    const snowVolumeLast3HrsEl = document.createElement("p");

    mainTempEl.textContent = `Main Temp: ${mainTemp}F`;
    feelsLikeTempEl.textContent = `Feels Like Temp: ${feelsLikeTemp}F`;
    minTempEl.textContent = `Min Temp: ${minTemp}F`;
    maxTempEl.textContent = `Max Temp: ${maxTemp}F`;
    cloudinessEl.textContent = `Cloudiness: ${cloudiness}%`;
    snowVolumeLast3HrsEl.textContent = `Snow Volume (last 3 hours): ${snowVolumeLast3Hrs}`;

    const containerEl = document.getElementById("currentWeatherEl");
    containerEl.innerHTML = '';
    containerEl.appendChild(mainTempEl);
    containerEl.appendChild(feelsLikeTempEl);
    containerEl.appendChild(minTempEl);
    containerEl.appendChild(maxTempEl);
    containerEl.appendChild(cloudinessEl);
    containerEl.appendChild(snowVolumeLast3HrsEl);

    persistentLocations.push(location);
    populateLocations(persistentLocations);
  })
  .catch(error => {
    console.error(error);
    
  });
})
.catch(error => {
    console.error(error);
})
});

function populateLocations(locations) {
    persistentLocationsEl.innerHTML = '';
    const beenThere = document.createElement('ul');
    for (let location of locations) {
        const visited = document.createElement('li');
        visited.textContent = location;
        beenThere.appendChild(visited);
    }
    persistentLocationsEl.appendChild(beenThere);
}