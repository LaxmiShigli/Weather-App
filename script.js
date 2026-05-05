const apiKey = "YOUR_API_KEY"; // Paste your OpenWeather API key here

// ======================
// Realtime Date & Time
// ======================
function updateDateTime() {
  const dateTime = document.getElementById("dateTime");
  if (dateTime) {
    const now = new Date();
    dateTime.innerText = now.toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
}

setInterval(updateDateTime, 1000);
updateDateTime();

// ======================
// Weather Dashboard Logic
// ======================
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city !== "") {
      getWeather(city);
    }
  });
}

if (cityInput) {
  cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const city = cityInput.value.trim();
      if (city !== "") {
        getWeather(city);
      }
    }
  });
}

async function getWeather(city) {
  try {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const currentRes = await fetch(currentWeatherURL);
    const currentData = await currentRes.json();

    const forecastRes = await fetch(forecastURL);
    const forecastData = await forecastRes.json();

    if (currentData.cod != 200) {
      alert("City not found. Please enter a valid city.");
      return;
    }

    displayCurrentWeather(currentData);
    displayForecast(forecastData);
    changeBackground(currentData.weather[0].main);
  } catch (error) {
    console.log(error);
    alert("Error fetching weather data.");
  }
}

function displayCurrentWeather(data) {
  const cityName = document.getElementById("cityName");
  const temperature = document.getElementById("temperature");
  const weatherCondition = document.getElementById("weatherCondition");
  const feelsLike = document.getElementById("feelsLike");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("windSpeed");
  const pressure = document.getElementById("pressure");
  const visibility = document.getElementById("visibility");
  const sunrise = document.getElementById("sunrise");
  const sunset = document.getElementById("sunset");
  const weatherIcon = document.getElementById("weatherIcon");

  if (cityName) cityName.innerText = `${data.name}, ${data.sys.country}`;
  if (temperature) temperature.innerText = `${Math.round(data.main.temp)}°C`;
  if (weatherCondition) weatherCondition.innerText = data.weather[0].description;
  if (feelsLike) feelsLike.innerText = `${Math.round(data.main.feels_like)}°C`;
  if (humidity) humidity.innerText = `${data.main.humidity}%`;
  if (windSpeed) windSpeed.innerText = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  if (pressure) pressure.innerText = `${data.main.pressure} hPa`;
  if (visibility) visibility.innerText = `${(data.visibility / 1000).toFixed(1)} km`;
  if (weatherIcon) weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  if (sunrise) sunrise.innerText = formatTime(data.sys.sunrise);
  if (sunset) sunset.innerText = formatTime(data.sys.sunset);
}

function displayForecast(data) {
  const forecastContainer = document.getElementById("forecastContainer");
  if (!forecastContainer) return;

  forecastContainer.innerHTML = "";

  const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyForecasts.forEach(day => {
    const card = document.createElement("div");
    card.classList.add("forecast-card", "glass", "fade-in");

    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-IN", { weekday: "short" });

    card.innerHTML = `
      <h3>${dayName}</h3>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon" />
      <p><strong>${Math.round(day.main.temp)}°C</strong></p>
      <p>${day.weather[0].description}</p>
      <p>Humidity: ${day.main.humidity}%</p>
    `;

    forecastContainer.appendChild(card);
  });
}

function formatTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function changeBackground(weatherMain) {
  const body = document.body;

  switch (weatherMain.toLowerCase()) {
    case "clear":
      body.style.background = "linear-gradient(135deg, #f6d365, #fda085)";
      break;
    case "clouds":
      body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      break;
    case "rain":
      body.style.background = "linear-gradient(135deg, #4b79a1, #283e51)";
      break;
    case "thunderstorm":
      body.style.background = "linear-gradient(135deg, #232526, #414345)";
      break;
    case "snow":
      body.style.background = "linear-gradient(135deg, #e6dada, #274046)";
      break;
    case "mist":
    case "haze":
    case "fog":
      body.style.background = "linear-gradient(135deg, #757f9a, #d7dde8)";
      break;
    default:
      body.style.background = "linear-gradient(135deg, #4facfe, #00f2fe)";
      break;
  }
}

// Default load only on dashboard page
if (window.location.pathname.includes("dashboard.html")) {
  getWeather("Belagavi");
}