import { useEffect, useState } from 'react'
import './App.css'
import { useCurrency } from './useCurrency';
import Decimal from 'decimal.js';

const calculation = (amount, firstRate, secondRate) => {
  if(!amount) return '';
  if(parseFloat(amount) < 0) return;
  return new Decimal(amount).times(firstRate).dividedBy(secondRate).toFixed(2);
}
const blockInvalidChar = (e) => ['e', 'E', '-', '+'].includes(e.key) && e.preventDefault();




function App() {
  const {rates, updateDate, isLoading} = useCurrency();

  const [theme, setTheme] = useState('light');
  
  const [rate1, setRate1] = useState({});
  const [rate2, setRate2] = useState({});
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');

  useEffect(() => {
    if(rates.length > 0){
      setRate1(rates.find(r => r.cc === 'USD'));
      setRate2(rates.find(r => r.cc === 'UAH'));
    }
  }, [rates]);

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);
  
  const handleAmount1 = (value) =>{
    setAmount1(value);
    setAmount2(calculation(value, rate1.rate, rate2.rate));
  };
  const handleAmount2 = (value) =>{
    setAmount2(value);
    setAmount1(calculation(value, rate2.rate, rate1.rate));
  };

  const handChange1 = (e) =>{
    const selectedCode = e.target.value;
    const selectedObject = rates.find(item => item.cc === selectedCode);
    setRate1(selectedObject);

    if(amount1){
      setAmount2(calculation(amount1, selectedObject.rate, rate2.rate));
    }
  }
  const handChange2 = (e) =>{
    const selectedCode = e.target.value;
    const selectedObject = rates.find(item => item.cc === selectedCode);
    setRate2(selectedObject);

    if(amount1){
      setAmount2(calculation(amount1, rate1.rate, selectedObject.rate));
    }
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const truncate = (num, digits) => {
    const factor = Math.pow(10, digits);
    return Math.floor(num * factor) / factor;
  };

  const inputClear = () => {
    setAmount1('');
    setAmount2('');
  }

  return (
    <>
      <header className='header'>
        <div className='title'>
          <h2>Rates carrency</h2>
        </div>
        <div className='header_text'>
          {isLoading ? (<p>Loading...</p>) :
            (
              <div className='rates'>
                {rates.slice(0, -1).map((item) => (
                  <p key={item.cc}>
                   <strong>{item.cc}</strong> - {truncate(item.rate, 2)} UAH
                  </p>
                ))}
            
              </div>
            )
          }
        <p className='update_text'>Update Date: {updateDate}</p>
        </div>
        
        <button className='theme_button' onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <main>
        <div className='converter'>
          <div className='input-group'>
            <select className='currency-select' value={rate1?.cc} onChange={handChange1}>
              {rates.map((item) => (
                <option key={item.cc} value={item.cc}>{item.cc}</option>
              ))}
            </select>
            <input 
              className='amount-input' 
              type='number' 
              value={amount1} 
              onChange={(e) => handleAmount1(e.target.value)}
              onKeyDown={blockInvalidChar}
            />
          </div>
          <div className='input-group'>
            <select className='currency-select' value={rate2?.cc} onChange={handChange2}>
              {rates.map((item) => (
                <option key={item.cc} value={item.cc}>{item.cc}</option>
              ))}
            </select>
            <input 
              className='amount-input' 
              type='number' 
              value={amount2} 
              onChange={(e) => handleAmount2(e.target.value)}
              onKeyDown={blockInvalidChar}
            />
          </div>
        </div>
        
        <button className='clearButton' onClick={inputClear}>Clear</button>
      </main>
    </>
  )
}

export default App;
