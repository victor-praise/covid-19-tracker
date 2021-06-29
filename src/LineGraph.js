import React, { useEffect, useState } from 'react';
import { Line } from "react-chartjs-2";

export function Linegraph(props) {
    const [data, setData] = useState({})
    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120').then(response => response.json()).then(
            data=>{
                console.log(data);
            }
        )
    }, [])
    return (
        <>
            <div>
                <Line 
                    data
                    options
                />
            </div>
        </>
    )
}
