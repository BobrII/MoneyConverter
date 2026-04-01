import { useEffect, useState } from "react";

async function fetchRates() {
    try{
    const responce = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/uah.json');
    const data = await responce.json();

    const rawDate = new Date(data.date);

    const formattedDAte = rawDate.toLocaleDateString();

    const usdRate = 1 / data.uah.usd;
    const eurRate = 1 / data.uah.eur;
    const gbpRate = 1 / data.uah.gbp;
    const uahRate = 1;
    return {
      rates: [
        {cc: 'USD', rate: usdRate, txt: 'USA Dollar'},
        {cc: 'EUR', rate: eurRate, txt: 'Euro'},
        {cc: 'GBP', rate: gbpRate, txt: 'Great Britain Pound'},
        {cc: 'UAH', rate: 1, txt: 'Ukrainian Hryvna'},
      ],
      updateDate: formattedDAte
    }
      
  } catch(error){
    console.error('Error while retrieving data:', error);
    return { rates: [], updateDate: ''};
  }
};

export function useCurrency() {
    const [data, setData] = useState({rates: [], updateDate:''});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRates().then(res => {
            setData(res);
            setIsLoading(false)
        });
    }, []);

    return {...data, isLoading};
};