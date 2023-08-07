const apiKey = 'b8e76533d49342768241dd6ce39ca8e7';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryDiv = document.getElementById('search-history');

async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
}

function displayCurrentWeather(weatherData) {
    currentWeatherDiv.innerHTML = `
        <div class="weather-card">
            <h2>${weatherData.name}  (${new Date(weatherData.dt * 1000).toLocaleDateString()})</h2>
            <img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="weather icon">
            <p>Temperature: ${weatherData.main.temp}F</p>
            <p>Humidity: ${weatherData.main.humidity}%</p>
            <p>Wind Speed: ${weatherData.wind.speed}mph</p>
        </div>
    `;
}

async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    const response = await fetch(url);
    const data = await response.json();
    const forecastDataFiltered = data.list.filter(item => item.dt_txt.includes('12:00'));
    return forecastDataFiltered;
}

function displayForecast(forecastData) {
    forecastDiv.innerHTML = '';
    forecastData.forEach(item => {
        forecastDiv.innerHTML += `
            <div class="forecast-card">
                <p>Date: ${new Date(item.dt * 1000).toLocaleDateString()}</p>
                <img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="weather icon">
                <p>Temperature:${item.main.temp}F</p>
                <p>Humidity: ${item.main.humidity}%</p>
                <p>Wind Speed: ${item.wind.speed}mph</p>
            </div>
        `;
    });
}

function displaySearchHistory(history) {
    searchHistoryDiv.innerHTML = history
        .map(city => `<div class="history-item">${city}</div>`)
        .join('');
}

searchForm.addEventListener('submit', async event => {
    event.preventDefault();

    const city = cityInput.value.trim();
    if (city === '') return;

    const weatherData = await getWeatherData(city);
    displayCurrentWeather(weatherData);

    const forecastData = await getForecast(city);
    displayForecast(forecastData);

    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        displaySearchHistory(history);
    }
});

searchHistoryDiv.addEventListener('click', async event => {
    if (event.target.classList.contains('history-item')) {
        const city = event.target.textContent;
        cityInput.value = city;
        searchForm.dispatchEvent(new Event('submit'));
    }
});

// On page load display the search history if available
let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
displaySearchHistory(history);
