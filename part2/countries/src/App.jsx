import { useState, useEffect } from 'react'
import axios from 'axios'


const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  })

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleShow = (country) => {
    setSearch(country)
  }

  const countriesToShow = search === ''
    ? []
    : countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearch} />
      </div>
      <div>
        {countriesToShow.length > 10
          ? <p>Too many matches, specify another filter</p>
          : countriesToShow.length === 1
            ? <Country country={countriesToShow[0]} />
            : countriesToShow.map(country =>
              <div key={country.name.common}>
                {country.name.common}
                <button onClick={() => handleShow(country.name.common)}>show</button>
              </div>
            )
        }
      </div>
    </div>
  )

}

const Country = ({ country }) => {
  const languages = Object.values(country.languages)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>

      <h2>languages</h2>
      <ul>
        {languages.map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>

      <img src={country.flags.png} alt={country.name} width={200}/>
      <Weather capital={country.capital} />
    </div>
  )
}

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${api_key}`)
      .then(response => setWeather(response.data))
  }, [capital])

  if (!weather) {
    return null
  }

  const temp = (weather.main.temp - 273.15).toFixed(2)

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>temperature: {temp} Celcius</p>
      <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt={weather.weather_descriptions} />
      <p>Wind speed {weather.wind.speed} m/s</p>
    </div>
  )
}


export default App
