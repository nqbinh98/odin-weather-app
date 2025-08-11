import './index.css';
import hotImage from './img/hot.png';
import coolImage from './img/cool.jpg';
import coldImage from './img/cold.png';

const key = `J4928SXJD5FMPKMDA22NW5B5K`

const body = document.querySelector('body');
const main = document.querySelector('#main');
const loading = document.querySelector('#loading');
const content = document.querySelector('.content');
const form = document.querySelector('#form');
const errorMsg  = document.querySelector('.error-msg');
const input = document.querySelector('#input');

const locate = document.querySelector('.locate'); 
const date = document.querySelector('.date');
const temperature = document.querySelector('.temperature');
const conditionMsg = document.querySelector('.condition-msg');
const conditionIcon = document.querySelector('.condition-icon');
const visible = document.querySelector('.visible');
const wind = document.querySelector('.wind');
const cloud = document.querySelector('.cloud');

const iconMap = {
  'Partially cloudy': 'wi-day-cloudy',
  'Rain, Partially cloudy': 'wi-day-rain-wind',
  'Rain': 'wi-day-rain',
  'Clear': 'wi-day-sunny',
  'Overcast': 'wi-day-hail',
};
  
async function getWeather(location) {
  try {
    loading.classList.remove('hide');
    content.classList.add('hide');

    let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${key}`);
    if (response.ok) {
      loading.classList.add('hide');
      content.classList.remove('hide');
      let json = await response.json();
      let processedData = processWeatherData(json);
      errorMsg.textContent = '';  
      displayWeather(processedData);    
    } else {
      loading.classList.add('hide');
      content.classList.add('hide');
      throw new Error("Can not find this place!");
    }
  } catch (error) {
    errorMsg.textContent = error.message;  
    content.classList.add('hide');
  }
}

function processWeatherData(json) {

  let dataWeather = {
    temp: Number((((json.currentConditions.temp) - 32) * 5/9).toFixed(0)),
    windspeed: ((json.currentConditions.windspeed) * 0.44704).toFixed(2),
    visibility: Math.round(((json.currentConditions.visibility) * 1609.344) / 1000) * 1000,
    address: json.resolvedAddress,
    conditions: json.currentConditions.conditions,
    cloudcover: json.currentConditions.cloudcover,
    icon: iconMap[json.currentConditions.conditions],
  };
  return dataWeather;
}

async function displayWeather(processedData) {

  let address = processedData.address;
  let temp = processedData.temp;
  let windSpeed = processedData.windspeed;
  let conditions = processedData.conditions;
  let cloudCover = processedData.cloudcover;
  let visibility = processedData.visibility;

  date.textContent = new Date().toLocaleString();
  locate.textContent = address;
  temperature.textContent = `${temp} °C`;
  conditionMsg.textContent = conditions;
  visible.textContent = `${visibility} (m)`;
  wind.textContent = `${windSpeed} (m/s)`;
  cloud.textContent = `${cloudCover} %`;

  body.className = '';
  main.className = '';

// Add background weather
  if (!isNaN(temp)) {
      if (temp > 30) {
        body.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0)), url(${hotImage}`;
        main.style.backgroundImage = `url(${hotImage}`;
      } else if (temp < 20) {
        body.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0)), url(${coldImage});`
        main.style.backgroundImage = `url(${coldImage});`
      } else {
        body.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0)), url(${coolImage}`;
        main.style.backgroundImage = `url(${coolImage}`;
      }
  }

// Add icon weather
  try {
    let iconName = processedData.icon;
    let module;
    if(!iconName) {
      iconName = 'default-icon';
    } 
    module = await import(`./icons/${iconName}.svg?raw`);
    conditionIcon.innerHTML = module.default;
  } catch(error) {
    console.error('Can not load icon!');
  }
}


getWeather('hochiminh')

form.addEventListener('submit', function (e) {
  e.preventDefault();
  let location = input.value.trim();
  console.log(location)
  getWeather(location);
})
