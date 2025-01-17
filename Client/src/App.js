import React from 'react';
import './App.css';
import Home from './Components/Home/Home';
import Crud from './Components/Overview/crud';
import { Route, Routes } from 'react-router-dom';
import Update from './Components/Update/update';


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/overview" element={<Crud />} />
        <Route path="/update" element={<Update />} />
      </Routes>
    </div>
  );
}

export default App;

