function lastUpdated(update) {
  let currentHour = update.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinute = update.getMinutes();
  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }
  return `${currentHour}:${currentMinute}`;
}

function updateCurrentMonthYearDay(update) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentDay = days[update.getDay()];
  let currentMonth = months[update.getMonth()];
  let currentYear = update.getFullYear();
  return `${currentMonth} ${currentYear}, ${currentDay}`;
}

function updateCurrentDate(update) {
  let currentDate = update.getDate();
  let dateNumber = Number(currentDate);

  if (dateNumber === 1 || dateNumber === 21) {
    return `${dateNumber}st`;
  } else {
    if (dateNumber === 3 || dateNumber === 23) {
      return `${dateNumber}rd`;
    } else {
      if (dateNumber === 2 || dateNumber === 22) {
        return `${dateNumber}nd`;
      } else {
        return `${dateNumber}th`;
      }
    }
  }
}

function forecastDate(timestamp) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let currentDay = days[timestamp.getDay()];
  return `${currentDay},</span>
    <span class="month-day">${updateCurrentDate(timestamp)}`;
}

function showDefault(city) {
  let apiKey = "2e441a46ac7fd97e3ca0c59e6e2a3fcc";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function searchCity(event) {
  event.preventDefault();
  let apiKey = "2e441a46ac7fd97e3ca0c59e6e2a3fcc";
  let cityInput = document.querySelector("#enter-city");
  let city = cityInput.value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function displayWeather(response) {
  displayTemperature = document.querySelector("#temperature");
  let temperature = Math.round(response.data.main.temp);
  displayTemperature.innerHTML = temperature;
  let displayCountry = document.querySelector("#country");
  displayCountry.innerHTML = response.data.sys.country;
  let displayCity = document.querySelector("#city");
  displayCity.innerHTML = `${response.data.name},`;
  let displayTodayIn = document.querySelector("#today-in");
  displayTodayIn.innerHTML = `${response.data.name}:`;
  let displayForecastCity = document.querySelector("#city-forecast");
  displayForecastCity.innerHTML = `${response.data.name}:`;
  let displayFeelsLike = document.querySelector("#feels-like");
  displayFeelsLike.innerHTML = Math.round(response.data.main.feels_like);
  let displayHumidity = document.querySelector("#humidity");
  displayHumidity.innerHTML = response.data.main.humidity;
  let displayWindSpeed = document.querySelector("#wind");
  displayWindSpeed.innerHTML = Math.round(response.data.wind.speed);
  let displayMaxTemp = document.querySelector("#max-temp");
  displayMaxTemp.innerHTML = Math.round(response.data.main.temp_max);
  let displayMinTemp = document.querySelector("#min-temp");
  displayMinTemp.innerHTML = Math.round(response.data.main.temp_min);
  let description = document.querySelector("#weather-description");
  description.innerHTML = response.data.weather[0].description;

  let weatherIcon = document.querySelector("#main-weather-icon");
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);

  let hourUpdate = document.querySelector("#hour");
  hourUpdate.innerHTML = lastUpdated(new Date(response.data.dt * 1000));
  console.log(response);

  let apiKey = "2e441a46ac7fd97e3ca0c59e6e2a3fcc";
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let apiUrlOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrlOneCall).then(displayForecast);
}

function displayForecast(response) {
  console.log(response);

  let forecast = null;
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;

  for (let index = 0; index < 5; index++) {
    forecast = response.data.daily[index];

    let forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML += `
    
    <div class="col">
      <p class="temperature-day"><strong>${Math.round(
        forecast.temp.max
      )}º </strong><span>${Math.round(forecast.temp.min)}º</span></p>
     <img src="http://openweathermap.org/img/wn/${
       forecast.weather[0].icon
     }@2x.png" alt="" class="dayWeatherIcon">
      <div><span class="week-day">${forecastDate(
        new Date(forecast.dt * 1000)
      )}</span></div>
    </div>
  
    `;
  }
}

function retrievePosition(position) {
  let apiKey = "2e441a46ac7fd97e3ca0c59e6e2a3fcc";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&units=${units}`;
  axios.get(url).then(displayWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let now = new Date();

let MonthYearDayUpdate = document.querySelector("#month-year-day");
MonthYearDayUpdate.innerHTML = updateCurrentMonthYearDay(now);

let dateUpdate = document.querySelector("#date");
dateUpdate.innerHTML = updateCurrentDate(now);

let insertCity = document.querySelector("#city-form");
insertCity.addEventListener("submit", searchCity);

let hereButton = document.querySelector("#here");
hereButton.addEventListener("click", getCurrentLocation);

showDefault("London");
