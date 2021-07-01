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
import { sortData, prettyPrintStat } from './util';
import Linegraph from './LineGraph';
import numeral from "numeral";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState(['usa', 'india', 'test']);
  const [country, setCountry] = useState('Worlwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
        //console.log(mapCenter);
      });
  };
  // calls covid data for all countries at page load
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all').then(
      response => response.json()
    ).then(
      data => {
        //console.log(data);
        setCountryInfo(data);
      }
    )
  }, [])

  //  gets all countries for country dropdown
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries").then(response => response.json()).then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ))
        //console.log(data);
        const sortedData = sortData(data)
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
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
          <Infobox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <Infobox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <Infobox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <Linegraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>


    </div>
  );
}

export default App;
