const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const suggestions = document.getElementById('suggestions');
const weatherResult = document.getElementById('weatherResult');

const apiKey = "0c91df48307853f4f8067302da20da32"; // Your OpenWeatherMap API key

// Dynamic suggestions while typing
cityInput.addEventListener('input', () => {
  const input = cityInput.value.trim();
  suggestions.innerHTML = '';

  if (!input) {
    suggestions.style.display = 'none';
    return;
  }

  // Fetch matching cities from OpenWeatherMap Geocoding API
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        suggestions.style.display = 'none';
        return;
      }

      data.forEach(city => {
        const li = document.createElement('li');
        
        // Add country flag
        const flag = document.createElement('img');
        flag.src = `https://countryflagsapi.com/png/${city.country}`;
        flag.alt = city.country;
        flag.style.width = '20px';
        flag.style.height = '15px';
        flag.style.marginRight = '10px';

        li.appendChild(flag);
        li.appendChild(document.createTextNode(`${city.name}, ${city.country}`));

        li.addEventListener('click', () => {
          cityInput.value = `${city.name}, ${city.country}`;
          suggestions.innerHTML = '';
          suggestions.style.display = 'none';
          getWeather(city.name);
        });

        suggestions.appendChild(li);
      });

      suggestions.style.display = 'block';
    })
    .catch(err => {
      console.error(err);
      suggestions.style.display = 'none';
    });
});

// Search button click
searchBtn.addEventListener('click', () => getWeather(cityInput.value.trim()));

// Enter key press
cityInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') getWeather(cityInput.value.trim());
});

// Fetch weather from OpenWeatherMap API
function getWeather(city) {
  if (!city) return alert("Please enter a city name!");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      // Set dynamic background based on weather
      const weatherMain = data.weather[0].main.toLowerCase();
      if(weatherMain.includes("cloud")) {
        document.body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      } else if(weatherMain.includes("rain")) {
        document.body.style.background = "linear-gradient(135deg, #4e54c8, #8f94fb)";
      } else if(weatherMain.includes("clear")) {
        document.body.style.background = "linear-gradient(135deg, #fceabb, #f8b500)";
      } else if(weatherMain.includes("snow")) {
        document.body.style.background = "linear-gradient(135deg, #e6dada, #274046)";
      } else {
        document.body.style.background = "linear-gradient(135deg, #74ebd5, #ACB6E5)"; // default
      }

      // Show weather info with icon
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherResult.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="${iconUrl}" alt="${data.weather[0].description}">
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
      `;
    })
    .catch(err => {
      weatherResult.innerHTML = `<p style="color:red;">${err.message}</p>`;
    });
}
