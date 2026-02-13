import { useEffect, useState } from 'react';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import TestApi from './components/TestApi.jsx';
import TestMongo from './components/TestMongo.jsx';
import RequireAuth from './middleware/RequireAuth.jsx';
import Profile from './components/Profile.jsx';
import Login from './components/Login.jsx';
import Logout from './components/Logout.jsx';
function App() {
 return(
 <Routes>
 <Route path='/test_api' element={<TestApi/>}/>
 <Route path='/test_mongo' element={<TestMongo/>}/>
 <Route path='/login' element={<Login/>}/>
 <Route path='/profile' element={<RequireAuth>
 <Profile/>
 </RequireAuth>
 }/>
 <Route path='/logout' element={
 <RequireAuth>
 <Logout/>
 </RequireAuth>
 }/>
 </Routes>
 );
}
export default App




/* import { Routes, Route } from "react-router-dom";
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

export default App; */


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