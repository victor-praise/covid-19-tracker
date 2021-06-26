import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import { useEffect, useState } from 'react';

function App() {
  const [countries, setCountries] = useState(['usa', 'india', 'test']);
  useEffect(() => {
    const getCountriesData = async () => {  
      await fetch("https://disease.sh/v3/covid-19/countries").then(response=>response.json()).then((data) => {
        const countries = data.map((country) => (
          {
            name:country.country,
            value: country.countryInfo.iso2
          }
        ))
        setCountries(countries);
      })
  
    }
    getCountriesData();
  }, [])
  return (
    <div className="App">
   
     <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value="abc">
            {
              countries.map(country=>
                <MenuItem value={country.value}>
                  {country.name}
                </MenuItem>
              )
            }
            {/* <MenuItem value="worldwide"> World Wide</MenuItem>
            <MenuItem value="worldwide"> World</MenuItem>
            <MenuItem value="worldwide"> Worldkk Wide</MenuItem>
            <MenuItem value="worldwide"> World Wide</MenuItem> */}

          </Select>
        </FormControl>
     </div>
   
    </div>
  );
}

export default App;
