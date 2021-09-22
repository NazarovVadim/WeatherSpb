 const url = '/js/data.json',
    temperatureUnit = '°',
    humidityUnit = '%',
    pressureUnit = ' mmHg',
    windUnit = ' m/s',
    APIKEY = 'e163b8b661bc14e09841495637e2ba12',
    spbId='498817';

let currentData;

/*ПОЛУЧЕНИЕ ДАННЫХ*/


async function getData(){
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=498817&appid=e163b8b661bc14e09841495637e2ba12`);
    if(response.ok){
        let jsonData = await response.json();
        return jsonData;
    } else{
        alert('Error: '+ response.status);
    }
    
}

function convertPressure(value){
    return (value/1.33).toFixed();
}

Number.prototype.pad = function(size){
    let s = String(this);
    while (s.length < (size || 2)) {s = "0"+s;}
    return s;
}

function getHoursString(dateTime){
    let date = new Date(dateTime);
    let hours = date.getHours().pad();

    return hours;
}

function getValueWithUnit(value, unit){
    return `${value}${unit}`;
}

function getTemperature(value){
    let roundedValue = value.toFixed()-273;
    return getValueWithUnit(roundedValue, temperatureUnit);
}

function render(data){
    renderCity(data);
    renderCurrentTemperature(data);
    renderCurrentDescription(data);

    renderForecast(data);
    renderDetalis(data);
    renderDayOrNight(data);
}

function renderCity(data){
    let cityName = document.querySelector('.current__city');
    cityName.innerHTML = data.city.name;
}
function renderCurrentTemperature(data){
    let tmp = data.list[0].main.temp;

    let currentTmp = document.querySelector('.current__temp');
    currentTmp.innerHTML = getTemperature(tmp);
}
function renderCurrentDescription(data){
    let tmp = data.list[0].weather[0].description;

    let description = document.querySelector('.current__desc');
    description.innerHTML = tmp;
}

function renderForecast(data){
    let forecastDataContainer = document.querySelector('.forecast');
    let forecasts = '';

    for(let i=0; i<6; i++){
        let item = data.list[i];
        let icon = item.weather[0].icon;
        let temp = getTemperature(item.main.temp);
        let hours = (i == 0 ? 'Now: ' : getHoursString(item.dt * 1000)+':00');

        let template = `
            <div class="forecast__item">
                <div class="forecast__time">${hours}</div>
                <div class="forecast__icon icon__${icon}"></div>
                <div class="forecat__temp">${temp}</div>
            </div>
        `;
        forecasts +=template;
    }
    forecastDataContainer .innerHTML = forecasts;
}

function renderDetalis(data){
    let item = data.list[0];
    let pressureValue = convertPressure(item.main.pressure);
    let pressure = getValueWithUnit(pressureValue, pressureUnit);
    let humidity = getValueWithUnit(item.main.humidity, humidityUnit);
    let feelsLike = getTemperature(item.main.feels_like);
    let wind = getValueWithUnit(item.wind.speed, windUnit);

    renderDetalisItem('feelslike', feelsLike);
    renderDetalisItem('pressure', pressure);
    renderDetalisItem('humidity', humidity);
    renderDetalisItem('wind', wind);
}

function renderDetalisItem(className, value){
    let container = document.querySelector(`.${className}`).querySelector('.detalis__value');
    container.innerHTML = value;
}

function isDay(data){
    let sunrise = data.city.sunrise * 1000;
    let sunset = data.city.sunset * 1000;

    let now = Date.now();
    return (now>sunrise && now < sunset);
}

function renderDayOrNight(data){
    let attrName = isDay(data) ? 'day' : 'night';
    transition();
    document.documentElement.setAttribute('data-theme', attrName);
}

function pereoditicTasks(){
    setInterval(start, 6000000);
    setInterval(() => {
        renderDayOrNight(currentData);
    }, 60000);
}

function start(){
    getData().then(data => {
        currentData = data;
        render(data);
        pereoditicTasks();
    });

}

function transition(){
    document.documentElement.classList.add('transition');
    setTimeout(function(){
        document.documentElement.classList.remove('transition');
    }, 4000);
}

start();

