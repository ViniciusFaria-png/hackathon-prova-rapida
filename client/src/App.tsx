import { useEffect, useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState("Conectando ao servidor...");

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    fetch(`${apiUrl}/`) 
      .then(res => res.json())
      .then(data => setStatus(data.message)) 
      .catch(err => {
        console.error("Erro:", err);
        setStatus("Erro ao conectar com o backend 😢");
      });
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card" style={{ border: '2px solid #646cff', padding: '1rem', marginBottom: '1rem' }}>
        <h3>Status do Backend:</h3>
        <p>{status}</p>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
