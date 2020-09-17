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
      } else {
        return `${dateNumber}th`;
      }
    }
  }
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
  let displayFeelsLike = document.querySelector("#feels-like");
  displayFeelsLike.innerHTML = Math.round(response.data.main.feels_like);
  let displayHumidity = document.querySelector("#humidity");
  displayHumidity.innerHTML = response.data.main.humidity;
  let displayWindSpeed = document.querySelector("#wind");
  displayWindSpeed.innerHTML = response.data.wind.speed;
  let displayMaxTemp = document.querySelector("#max-temp");
  displayMaxTemp.innerHTML = Math.round(response.data.main.temp_max);
  let displayMinTemp = document.querySelector("#min-temp");
  displayMinTemp.innerHTML = Math.round(response.data.main.temp_min);
  let description = document.querySelector("#weather-description");
  description.innerHTML = response.data.weather[0].description;
  console.log(response.data);

  let hourUpdate = document.querySelector("#hour");
  hourUpdate.innerHTML = lastUpdated(new Date(response.data.dt * 1000));
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

let reloadButton = document.querySelector("#reload");
reloadButton.addEventListener("click", getCurrentLocation);

showDefault("London");
