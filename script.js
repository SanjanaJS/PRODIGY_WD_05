/* =========================================================
   WeatherNow | Smart Weather Dashboard
   ========================================================= */


/* =========================================================
   API
   ========================================================= */

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";

const REVERSE_GEOCODING_API =
    "https://api.bigdatacloud.net/data/reverse-geocode-client";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const locationBtn =
    document.getElementById("locationBtn");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const errorText =
    document.getElementById("errorText");

const weatherContent =
    document.getElementById("weatherContent");

const welcomeSection =
    document.getElementById("welcomeSection");

const locationName =
    document.getElementById("locationName");

const weatherDate =
    document.getElementById("weatherDate");

const weatherIcon =
    document.getElementById("weatherIcon");

const heroWeatherIcon =
    document.getElementById("heroWeatherIcon");

const weatherDescription =
    document.getElementById("weatherDescription");

const temperatureDescription =
    document.getElementById("temperatureDescription");

const temperature =
    document.getElementById("temperature");

const feelsLike =
    document.getElementById("feelsLike");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const pressure =
    document.getElementById("pressure");

const visibility =
    document.getElementById("visibility");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const forecastGrid =
    document.getElementById("forecastGrid");

const clothingTip =
    document.getElementById("clothingTip");

const umbrellaTip =
    document.getElementById("umbrellaTip");

const activityTip =
    document.getElementById("activityTip");

const celsiusBtn =
    document.getElementById("celsiusBtn");

const fahrenheitBtn =
    document.getElementById("fahrenheitBtn");

const temperatureCard =
    document.getElementById("temperatureCard");


/* =========================================================
   STATE
   ========================================================= */

let currentTemperatureCelsius = null;

let currentFeelsLikeCelsius = null;

let currentUnit = "C";

let currentWeatherCode = null;

let lastDailyData = null;


/* =========================================================
   WEATHER INFORMATION
   ========================================================= */

function getWeatherInfo(code) {

    if (code === 0) {

        return {
            description: "Clear Sky",
            icon: "fa-sun",
            className: "weather-clear"
        };

    }

    if (code === 1 || code === 2) {

        return {
            description: "Partly Cloudy",
            icon: "fa-cloud-sun",
            className: "weather-partly-cloudy"
        };

    }

    if (code === 3) {

        return {
            description: "Overcast",
            icon: "fa-cloud",
            className: "weather-cloudy"
        };

    }

    if (code >= 45 && code <= 48) {

        return {
            description: "Fog",
            icon: "fa-smog",
            className: "weather-fog"
        };

    }

    if (code >= 51 && code <= 57) {

        return {
            description: "Drizzle",
            icon: "fa-cloud-rain",
            className: "weather-drizzle"
        };

    }

    if (code >= 61 && code <= 67) {

        return {
            description: "Rain",
            icon: "fa-cloud-showers-heavy",
            className: "weather-rain"
        };

    }

    if (code >= 71 && code <= 77) {

        return {
            description: "Snow",
            icon: "fa-snowflake",
            className: "weather-snow"
        };

    }

    if (code >= 80 && code <= 82) {

        return {
            description: "Rain Showers",
            icon: "fa-cloud-showers-heavy",
            className: "weather-showers"
        };

    }

    if (code >= 85 && code <= 86) {

        return {
            description: "Snow Showers",
            icon: "fa-snowflake",
            className: "weather-snow-showers"
        };

    }

    if (code >= 95) {

        return {
            description: "Thunderstorm",
            icon: "fa-cloud-bolt",
            className: "weather-storm"
        };

    }

    return {
        description: "Unknown",
        icon: "fa-cloud",
        className: "weather-cloudy"
    };
}


/* =========================================================
   FORECAST WEATHER CLASS
   ========================================================= */

function getForecastWeatherClass(code) {

    return getWeatherInfo(code).className;
}


/* =========================================================
   CELSIUS → FAHRENHEIT
   ========================================================= */

function celsiusToFahrenheit(celsius) {

    return (celsius * 9 / 5) + 32;
}


/* =========================================================
   TEMPERATURE DISPLAY
   ========================================================= */

function updateTemperatureDisplay() {

    if (
        currentTemperatureCelsius === null ||
        currentFeelsLikeCelsius === null
    ) {
        return;
    }

    let temp;
    let feels;

    if (currentUnit === "C") {

        temp =
            Math.round(
                currentTemperatureCelsius
            );

        feels =
            Math.round(
                currentFeelsLikeCelsius
            );

    } else {

        temp =
            Math.round(
                celsiusToFahrenheit(
                    currentTemperatureCelsius
                )
            );

        feels =
            Math.round(
                celsiusToFahrenheit(
                    currentFeelsLikeCelsius
                )
            );
    }

    temperature.innerHTML =
        `${temp}<span class="degree">°${currentUnit}</span>`;

    feelsLike.textContent =
        `Feels like ${feels}°${currentUnit}`;
}


/* =========================================================
   UPDATE WEATHER THEME
   ========================================================= */

function updateWeatherTheme(weatherClass) {

    const themeClasses = [

        "weather-clear-theme",
        "weather-partly-cloudy-theme",
        "weather-cloudy-theme",
        "weather-fog-theme",
        "weather-drizzle-theme",
        "weather-rain-theme",
        "weather-snow-theme",
        "weather-showers-theme",
        "weather-snow-showers-theme",
        "weather-storm-theme"

    ];

    document.body.classList.remove(
        ...themeClasses
    );

    document.body.classList.add(
        weatherClass + "-theme"
    );
}


/* =========================================================
   UPDATE HERO WEATHER
   ========================================================= */

function updateHeroWeather(weatherInfo) {

    /* Remove old weather classes */

    temperatureCard.classList.remove(

        "weather-clear",
        "weather-partly-cloudy",
        "weather-cloudy",
        "weather-fog",
        "weather-drizzle",
        "weather-rain",
        "weather-snow",
        "weather-showers",
        "weather-snow-showers",
        "weather-storm"

    );

    /* Add current weather class */

    temperatureCard.classList.add(
        weatherInfo.className
    );

    /* Main location icon */

    weatherIcon.innerHTML =
        `<i class="fa-solid ${weatherInfo.icon}"></i>`;

    /* Large hero icon */

    heroWeatherIcon.innerHTML =
        `<i class="fa-solid ${weatherInfo.icon}"></i>`;

    /* Description */

    weatherDescription.textContent =
        weatherInfo.description;

    temperatureDescription.textContent =
        weatherInfo.description;

    /* Whole page theme */

    updateWeatherTheme(
        weatherInfo.className
    );
}


/* =========================================
   Search City
   ========================================= */

async function searchCity(city) {
    const trimmedCity = city.trim();

    // 1. Check for empty input
    if (!trimmedCity) {
        showError("Please enter a city name.");
        return;
    }

    showLoading();

    try {
        let searchName = trimmedCity;

        // 2. Handle Bangalore/Bengaluru correctly
        const normalizedCity = trimmedCity.toLowerCase();

        if (
            normalizedCity === "bangalore" ||
            normalizedCity === "bengaluru"
        ) {
            await getWeather(
                12.9716,
                77.5946,
                "Bengaluru",
                "India"
            );
            return;
        }

        // 3. Search using the Open-Meteo geocoding API
        const url =
            "https://geocoding-api.open-meteo.com/v1/search" +
            `?name=${encodeURIComponent(searchName)}` +
            "&count=10&language=en&format=json";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City search request failed.");
        }

        const data = await response.json();

        // 4. Handle cities that were not found
        if (!data.results || data.results.length === 0) {
            showError(
                "City not found. Please check the spelling and try again."
            );
            return;
        }

        // 5. Prefer an Indian result if one exists
        const indianResult = data.results.find(
            place =>
                place.country_code &&
                place.country_code.toUpperCase() === "IN"
        );

        const cityData = indianResult || data.results[0];

        // 6. Fetch weather for the selected city
        await getWeather(
            cityData.latitude,
            cityData.longitude,
            cityData.name,
            cityData.country || ""
        );

    } catch (error) {
        console.error("City search error:", error);

        showError(
            "Unable to fetch weather. Check your internet connection and try again."
        );
    }
}


/* =========================================================
   GET WEATHER
   ========================================================= */

async function getWeather(
    latitude,
    longitude,
    cityName,
    countryName
) {

    try {

        const url =
            `${WEATHER_API}` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +

            `&current=` +
            `temperature_2m,` +
            `relative_humidity_2m,` +
            `apparent_temperature,` +
            `pressure_msl,` +
            `wind_speed_10m,` +
            `visibility,` +
            `weather_code` +

            `&daily=` +
            `sunrise,` +
            `sunset,` +
            `weather_code,` +
            `temperature_2m_max,` +
            `temperature_2m_min,` +
            `precipitation_probability_max` +

            `&timezone=auto` +

            `&forecast_days=5`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Unable to fetch weather data."
            );
        }


        const data =
            await response.json();


        displayWeather(
            data,
            cityName,
            countryName
        );


    } catch (error) {

        showError(
            error.message ||
            "Unable to load weather."
        );
    }
}


/* =========================================================
   DISPLAY WEATHER
   ========================================================= */

function displayWeather(
    data,
    cityName,
    countryName
) {

    const current =
        data.current;


    /* Location */

    locationName.textContent =
        `${cityName}, ${countryName}`;


    /* Date */

    weatherDate.textContent =
        formatDate(
            current.time
        );


    /* Weather information */

    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    currentWeatherCode =
        current.weather_code;


    /* Hero */

    updateHeroWeather(
        weatherInfo
    );


    /* Temperature */

    currentTemperatureCelsius =
        current.temperature_2m;

    currentFeelsLikeCelsius =
        current.apparent_temperature;


    updateTemperatureDisplay();


    /* Details */

    humidity.textContent =
        `${Math.round(
            current.relative_humidity_2m
        )}%`;


    windSpeed.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    pressure.textContent =
        `${Math.round(
            current.pressure_msl
        )} hPa`;


    const visibilityKm =
        current.visibility / 1000;


    visibility.textContent =
        `${visibilityKm.toFixed(1)} km`;


    /* Sunrise / sunset */

    if (
        data.daily &&
        data.daily.sunrise &&
        data.daily.sunset
    ) {

        sunrise.textContent =
            formatTime(
                data.daily.sunrise[0]
            );

        sunset.textContent =
            formatTime(
                data.daily.sunset[0]
            );
    }


    /* Forecast */

    lastDailyData =
        data.daily;


    displayForecast(
        data.daily
    );


    /* Smart insights */

    generateWeatherInsights(
        current,
        data.daily
    );


    /* Show */

    weatherContent.classList.remove(
        "hidden"
    );

    welcomeSection.classList.add(
        "hidden"
    );

    hideLoading();

    hideError();
}


/* =========================================================
   FORECAST
   ========================================================= */

function displayForecast(
    daily
) {

    forecastGrid.innerHTML = "";


    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        const date =
            daily.time[i];

        const code =
            daily.weather_code[i];

        const maxTemp =
            daily.temperature_2m_max[i];

        const minTemp =
            daily.temperature_2m_min[i];

        const rainProbability =
            daily.precipitation_probability_max[i];


        const weatherInfo =
            getWeatherInfo(code);


        let displayMax =
            maxTemp;

        let displayMin =
            minTemp;


        if (currentUnit === "F") {

            displayMax =
                celsiusToFahrenheit(
                    maxTemp
                );

            displayMin =
                celsiusToFahrenheit(
                    minTemp
                );
        }


        const card =
            document.createElement("div");


        card.className =
            `forecast-card ${getForecastWeatherClass(code)}`;


        card.innerHTML = `

            <div class="forecast-day">
                ${getForecastDayName(date, i)}
            </div>

            <div class="forecast-icon">
                <i class="fa-solid ${weatherInfo.icon}"></i>
            </div>

            <div class="forecast-condition">
                ${weatherInfo.description}
            </div>

            <div class="forecast-temp">

                <span class="forecast-max">
                    ${Math.round(displayMax)}°
                </span>

                <span class="forecast-min">
                    ${Math.round(displayMin)}°
                </span>

            </div>

            <div class="forecast-rain">
                <i class="fa-solid fa-droplet"></i>
                ${rainProbability ?? 0}% rain
            </div>
        `;


        forecastGrid.appendChild(
            card
        );
    }
}


/* =========================================================
   FORECAST DAY
   ========================================================= */

function getForecastDayName(
    dateString,
    index
) {

    if (index === 0) {
        return "Today";
    }


    const date =
        new Date(
            dateString + "T12:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short"
        }
    );
}


/* =========================================================
   WEATHER INSIGHTS
   ========================================================= */

function generateWeatherInsights(
    current,
    daily
) {

    const temp =
        current.temperature_2m;

    const code =
        current.weather_code;

    const rain =
        daily.precipitation_probability_max[0] || 0;


    /* Clothing */

    if (temp >= 30) {

        clothingTip.textContent =
            "Light, breathable clothing is best.";

    } else if (temp >= 24) {

        clothingTip.textContent =
            "Light and comfortable clothing should be enough.";

    } else if (temp >= 18) {

        clothingTip.textContent =
            "A light jacket or comfortable layers may help.";

    } else {

        clothingTip.textContent =
            "Wear warm clothing and consider an extra layer.";
    }


    /* Umbrella */

    if (
        rain >= 50 ||
        code >= 51
    ) {

        umbrellaTip.textContent =
            "Carry an umbrella today.";

    } else if (rain >= 25) {

        umbrellaTip.textContent =
            "There is some chance of rain. Keep an umbrella nearby.";

    } else {

        umbrellaTip.textContent =
            "An umbrella is probably not needed today.";
    }


    /* Outdoor activity */

    if (
        code >= 95
    ) {

        activityTip.textContent =
            "Avoid outdoor activities during thunderstorms.";

    } else if (
        code >= 61 ||
        code >= 80
    ) {

        activityTip.textContent =
            "Outdoor activities may be affected by rain.";

    } else if (
        temp >= 35
    ) {

        activityTip.textContent =
            "Limit strenuous outdoor activity during hot hours.";

    } else {

        activityTip.textContent =
            "Good conditions for outdoor activities.";
    }
}


/* =========================================================
   FORMAT TIME
   ========================================================= */

function formatTime(
    dateTime
) {

    const date =
        new Date(dateTime);


    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(
    dateTime
) {

    const date =
        new Date(dateTime);


    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );
}


/* =========================================================
   USE MY LOCATION
   ========================================================= */

function useMyLocation() {

    if (!navigator.geolocation) {

        showError(
            "Location services are not supported by this browser."
        );

        return;
    }


    showLoading();


    navigator.geolocation.getCurrentPosition(

        async function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                const reverseUrl =
                    `${REVERSE_GEOCODING_API}` +
                    `?latitude=${latitude}` +
                    `&longitude=${longitude}` +
                    `&localityLanguage=en`;


                const response =
                    await fetch(
                        reverseUrl
                    );


                const locationData =
                    await response.json();


                const city =
                    locationData.city ||
                    locationData.locality ||
                    locationData.principalSubdivision ||
                    "Your Location";


                const country =
                    locationData.countryName ||
                    "";


                await getWeather(
                    latitude,
                    longitude,
                    city,
                    country
                );


            } catch (error) {

                await getWeather(
                    latitude,
                    longitude,
                    "Your Location",
                    ""
                );
            }

        },

        function(error) {

            hideLoading();

            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                showError(
                    "Location permission was denied. Please allow location access or search for a city."
                );

            } else {

                showError(
                    "Unable to detect your location."
                );
            }

        },

        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 300000
        }
    );
}


/* =========================================================
   LOADING
   ========================================================= */

function showLoading() {

    loading.classList.remove(
        "hidden"
    );

    weatherContent.classList.add(
        "hidden"
    );

    welcomeSection.classList.add(
        "hidden"
    );

    hideError();
}


/* =========================================================
   HIDE LOADING
   ========================================================= */

function hideLoading() {

    loading.classList.add(
        "hidden"
    );
}


/* =========================================================
   ERROR
   ========================================================= */

function showError(
    message
) {

    hideLoading();

    weatherContent.classList.add(
        "hidden"
    );

    welcomeSection.classList.remove(
        "hidden"
    );

    errorText.textContent =
        message;

    errorMessage.classList.remove(
        "hidden"
    );
}


/* =========================================================
   HIDE ERROR
   ========================================================= */

function hideError() {

    errorMessage.classList.add(
        "hidden"
    );
}


/* =========================================================
   SEARCH BUTTON
   ========================================================= */

searchBtn.addEventListener(
    "click",
    function() {

        searchCity(
            cityInput.value
        );

    }
);


/* =========================================================
   ENTER KEY
   ========================================================= */

cityInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            searchCity(
                cityInput.value
            );
        }
    }
);


/* =========================================================
   LOCATION BUTTON
   ========================================================= */

locationBtn.addEventListener(
    "click",
    function() {

        useMyLocation();

    }
);


/* =========================================================
   CELSIUS
   ========================================================= */

celsiusBtn.addEventListener(
    "click",
    function() {

        currentUnit = "C";

        celsiusBtn.classList.add(
            "active"
        );

        fahrenheitBtn.classList.remove(
            "active"
        );

        updateTemperatureDisplay();


        if (lastDailyData) {

            displayForecast(
                lastDailyData
            );
        }
    }
);


/* =========================================================
   FAHRENHEIT
   ========================================================= */

fahrenheitBtn.addEventListener(
    "click",
    function() {

        currentUnit = "F";

        fahrenheitBtn.classList.add(
            "active"
        );

        celsiusBtn.classList.remove(
            "active"
        );

        updateTemperatureDisplay();


        if (lastDailyData) {

            displayForecast(
                lastDailyData
            );
        }
    }
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

console.log(
    "WeatherNow initialized successfully."
);