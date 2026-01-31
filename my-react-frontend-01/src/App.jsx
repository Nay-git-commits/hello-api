import { Routes, Route } from "react-router-dom";
import Items from "./pages/Item.jsx";
import ItemDetail from "./pages/ItemDetails.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Items />} />
      <Route path="/items" element={<Items />} />
      <Route path="/items/:id" element={<ItemDetail />} />
    </Routes>
  );
}

export default App;




/* import { useEffect, useState } from 'react'; 
import './App.css'

function App() { 
  const [message, setMessage] = useState("...Loading..."); 

  async function fetchData() { 
    const result = await fetch('http://localhost:3000/api/hello'); 
    const data = await result.json(); 
    setMessage(data.message); 
  } 

  useEffect(()=>{ 
    fetchData(); 
  },[]); 

  return ( 
    <div>
      Message: {message}
    </div>
  ) 
} 

export default App
 */