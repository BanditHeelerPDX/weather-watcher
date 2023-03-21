const apiKey = "796d4a60796f715c7b650eb7c5eade88";
let userInput = document.getElementById("search");
const submit = document.getElementById("searchBtn");
const locationEl = document.getElementById("location");
const persistentLocationsEl = document.getElementById("persistentLocations");
let persistentLocations = [];

submit.addEventListener("click", function (event) {
    event.preventDefault();
    doTheDamnThang();
  });

  function doTheDamnThang() {
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
            const name = data.name;
            const weatherIcon = data.weather[0].icon;
            const mainTemp = parseInt(data.main.temp);
            const feelsLikeTemp = parseInt(data.main.feels_like);
            const minTemp = parseInt(data.main.temp_min);
            const maxTemp = parseInt(data.main.temp_max);
            const windSpeed = parseInt(data.wind.speed);
            const cloudiness = data.clouds.all;
            const snowVolumeLast3Hrs = data.snow ? data.snow["3h"] : "N/A";

            const weatherIconEl = document.createElement('img');
            const mainTempEl = document.createElement("div");
            const feelsLikeTempEl = document.createElement("p");
            const minTempEl = document.createElement("p");
            const maxTempEl = document.createElement("p");
            const windSpeedEl = document.createElement('p');
            const cloudinessEl = document.createElement("p");
            const snowVolumeLast3HrsEl = document.createElement("p");

            weatherIconEl.setAttribute('src', `https://openweathermap.org/img/w/${weatherIcon}.png`);
            locationEl.textContent = `The weather in ${name}:`
            mainTempEl.textContent = `Current Temp: ${mainTemp}F`;
            feelsLikeTempEl.textContent = `Feels Like Temp: ${feelsLikeTemp}F`;
            minTempEl.textContent = `Min: ${minTemp}F`;
            maxTempEl.textContent = `Max: ${maxTemp}F`;
            windSpeedEl.textContent = `Wind speed: ${windSpeed}mph`;
            cloudinessEl.textContent = `Cloudiness: ${cloudiness}%`;
            snowVolumeLast3HrsEl.textContent = `Snow Volume (last 3 hours): ${snowVolumeLast3Hrs}`;

            const containerEl = document.getElementById("currentWeatherEl");
            containerEl.innerHTML = "";
            containerEl.appendChild(weatherIconEl);
            containerEl.appendChild(mainTempEl);
            containerEl.appendChild(feelsLikeTempEl);
            containerEl.appendChild(minTempEl);
            containerEl.appendChild(maxTempEl);
            containerEl.appendChild(windSpeedEl);
            containerEl.appendChild(cloudinessEl);
            containerEl.appendChild(snowVolumeLast3HrsEl);

            persistentLocations.push(location);
            populateLocations(persistentLocations);
          })
          .catch((error) => {
            console.error(error);
          });

        const wizardURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

        fetch(wizardURL)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            const forecast = data.list;

            const forecastEl = document.getElementById("fiveDayForecast");
            forecastEl.innerHTML = "";

            for (let i = 0; i < forecast.length; i += 8) {
              const forecastData = forecast[i];

              const date = new Date(forecastData.dt * 1000);
              const dayOfWeek = date.toLocaleDateString("en-US", {
                weekday: "long",
              });

              const weatherIcon = forecastData.weather[0].icon;
              const minTemp = parseInt(forecastData.main.temp_min);
              const maxTemp = parseInt(forecastData.main.temp_max);
              const chanceOfPrecip = parseInt(forecastData.pop * 100);
              const cloudiness = forecastData.clouds.all;

              const forecastCard = document.createElement("div");
              forecastCard.classList.add("card");

              const cardBody = document.createElement("div");
              cardBody.classList.add("card-body");

              const dayOfWeekEl = document.createElement("h3");
              dayOfWeekEl.textContent = dayOfWeek;

              const weatherIconEl = document.createElement('img');
              weatherIconEl.setAttribute('src', `https://openweathermap.org/img/w/${weatherIcon}.png`);

              const minTempEl = document.createElement("p");
              minTempEl.textContent = `Min Temp: ${minTemp}F`;

              const maxTempEl = document.createElement("p");
              maxTempEl.textContent = `Max Temp: ${maxTemp}F`;

              const chanceOfPrecipEl = document.createElement("p");
              chanceOfPrecipEl.textContent = `Chance of Precipitation: ${chanceOfPrecip}%`;

              const cloudinessEl = document.createElement("p");
              cloudinessEl.textContent = `Cloudiness: ${cloudiness}%`;

              cardBody.appendChild(dayOfWeekEl);
              cardBody.appendChild(weatherIconEl);
              cardBody.appendChild(minTempEl);
              cardBody.appendChild(maxTempEl);
              cardBody.appendChild(chanceOfPrecipEl);
              cardBody.appendChild(cloudinessEl);

              forecastCard.appendChild(cardBody);
              forecastEl.appendChild(forecastCard);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      });
      userInput.value = '';
  }
  
// function populateLocations(locations) {
//     persistentLocationsEl.innerHTML = '';
//     const beenThere = document.createElement('ul');
//     const doneThat = [];
//     for (let location of locations) {
//         if (!doneThat.includes(location)) {
//         const visited = document.createElement('li');
//         visited.textContent = location;
//         beenThere.appendChild(visited);
//         doneThat.push(location);
//       }
//     }
//     persistentLocationsEl.appendChild(beenThere);
// }

// function populateLocations(locations) {
//   persistentLocationsEl.innerHTML = "";
//   const beenThere = document.createElement("ul");
//   for (let location of locations) {
//     if (!document.querySelector(`[data-location="${location}"]`)) {
//       const visited = document.createElement("li");
//       const link = document.createElement("a");
//       link.setAttribute("href", "#");
//       link.setAttribute("data-location", location);
//       link.textContent = location;
//       visited.appendChild(link);
//       beenThere.appendChild(visited);
//       link.addEventListener("click", () => {
//         doTheDamnThang(location);
//       });
//     }
//   }
//   persistentLocationsEl.appendChild(beenThere);
// }

function populateLocations(locations) {
  persistentLocationsEl.innerHTML = "";
  const uniqueLocations = Array.from(new Set(locations)); // Get unique locations from the persistentLocations array
  uniqueLocations.forEach((location) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = location;
    a.href = "#";
    a.onclick = () => {
      userInput.value = location;
      doTheDamnThang();
    };
    li.appendChild(a);
    persistentLocationsEl.appendChild(li);
  });
  persistentLocations = uniqueLocations;
}

