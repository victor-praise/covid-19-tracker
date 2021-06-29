import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import { useEffect, useState } from 'react';
import { Infobox } from './Infobox';
import { Map } from './Map';
import { Table } from './Table';
import { sortData } from './util';
import { Linegraph } from './LineGraph';

function App() {
  const [countries, setCountries] = useState(['usa', 'india', 'test']);
  const [country, setCountry] = useState('Worlwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const onCountryChange = async (e) => {
      const countryCode = e.target.value;
      // displays all data or specific data
      const url = countryCode === 'Worlwide' ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url).then(
          response=>response.json()
        ).then(
            data=>{
              //console.log(data);
              // all of the data from the country response
              setCountryInfo(data);
              // updates input field
              setCountry(countryCode);
            }
    )
  }
  // calls covid data for all countries at page load
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all').then(
      response => response.json()
    ).then(
      data=>{
          setCountryInfo(data);
      }
    )
  }, [])

  //  gets all countries for country dropdown
  useEffect(() => {
    const getCountriesData = async () => {  
      await fetch("https://disease.sh/v3/covid-19/countries").then(response=>response.json()).then((data) => {
        const countries = data.map((country) => (
          {
            name:country.country,
            value: country.countryInfo.iso2
          }
        ))
        const sortedData = sortData(data)
        setTableData(sortedData);
        setCountries(countries);
      })
  
    }
    getCountriesData();
  }, [])
  return (
    <div className="App">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="Worlwide">Worldwide</MenuItem>
              {
                countries.map(country =>
                  <MenuItem value={country.value}>
                    {country.name}
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <Infobox title="Coronavirus Cases" total={countryInfo.cases} cases={countryInfo.todayCases} />
          <Infobox title="Recovered" total={countryInfo.recovered} cases={countryInfo.todayRecovered} />
          <Infobox title="Deaths" total={countryInfo.deaths} cases={countryInfo.todayDeaths} />
        </div>
        <Map />
      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          <Linegraph/>
        </CardContent>
      </Card>
   
  
    </div>
  );
}

export default App;
