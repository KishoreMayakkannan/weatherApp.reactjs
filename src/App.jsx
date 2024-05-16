import { useEffect, useState } from 'react'
import PropTypes from "prop-types";
import './App.css'

import searchIcon from "./assets/magnifying-glass-solid.svg"
import clearIcon from "./assets/clearcloud.jpg"
import cloudIcon from "./assets/cloudicon.png"
import drizzleIcon from "./assets/drizzle icon.png"
import humidityIcon from "./assets/humidity.png"
import rainIcon from "./assets/rain icon.png"
import snowIcon from "./assets/snow icon.png"
import windIcon from "./assets/windicon.png"



const WeatherDetails = ({ icon, temp, city, country, lat, log, wind, humidity }) => {

  return (
    <>
      <div className='image'>
        <img src={icon} alt="Image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className='lat'>latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>longitude   </span>
          <span>{log}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className="element">
          <img src={humidityIcon} alt="humidity" className='icon' />
          <div className="data">
            <div className="humidity-percent">{humidity} %</div>
            <div className="text">Humidity</div>
          </div>
        </div>

        <div className="element">
          <img src={windIcon} alt="wind" className='icon' />
          <div className="data">
            <div className="wind-percent">{wind} km/hr</div>
            <div className="text">Wind</div>
          </div>

        </div>

      </div>

    </>
  )
}

WeatherDetails.propTypes ={
  icon : PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city : PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  humidity : PropTypes.number.isRequired,
}

function App() {

  let apiKey = "c3cf286fd00389951e605ab248f06a92"


  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon
  }

  const [text, setText] = useState("London")
  const [icon, setIcon] = useState(rainIcon)
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState("London")
  const [country, setCountry] = useState("GB")
  const [lat, setLat] = useState(0)
  const [log, setLog] = useState(0)
  const [wind, setWind] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [cityNotFound, setCityNotFound] = useState(false)
  const [loading, setLoading] = useState(false)


  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=metric`

    try {
      let res = await fetch(url)
      let data = await res.json()
      if (data.cod === "404") {
        console.log("city not found")
        setCityNotFound(true)
        setLoading(false)
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp))
      setCity(data.name);
      setCountry(data.sys.country)
      setLat(data.coord.lon);
      setLog(data.coord.lon);
      setCityNotFound(false)
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon)


    } catch (error) {
      console.log("An error occurred : ", error.message)
    } finally {
      setLoading(false);
    }
  }
  const handleCity = (e) => {
    setText(e.target.value)
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  }

  useEffect(function(){
    search();
  },[]
);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" className='cityInput' placeholder='search city' onChange={handleCity} value={text} onKeyDown={handleKeyDown} />

          <div className='search-icon'>
            <img src={searchIcon} alt="search" onClick={() => search()} />
          </div>

        </div>
        <div>
          {cityNotFound ? <p className='not-found'>* City Not Found</p> : ""}
        </div>
        {!cityNotFound && !loading && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} wind={wind} humidity={humidity} />}

        <p className="copyright">Designed by <span>Kishore</span></p>
      </div>

    </>
  )
}

export default App
