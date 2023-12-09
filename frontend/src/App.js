import './App.css';
import Login from './pages/Login'
import SeekerRegister from './pages/SeekerRegister'
import ShelterRegister from './pages/ShelterRegister'
import AddPet from './pages/AddPet'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TokenContext } from './context/TokenContext';
import { useState } from 'react';
import ProtectedSeekerRoutes from './context/ProtectedSeekerRoutes';
import ProtectedShelterRoutes from './context/ProtectedShelterRoutes';
import { IsShelterContext } from './context/IsShelterContext';
import Search from './pages/Search';

function App() {
  const [token, setToken] = useState(null);
  const [isShelter, setIsShelter] = useState(null);
  return (
    <TokenContext.Provider value={{token, setToken}}>
      <IsShelterContext.Provider value={{isShelter, setIsShelter}}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Login />} />
            <Route path='/seeker-register' element={<SeekerRegister />} />
              <Route path='/shelter-register' element={<ShelterRegister />} />
              <Route path='/shelter-register-add-pet' element={<AddPet />} />
              <Route element={<ProtectedSeekerRoutes/>}>
                <Route path='/search-page' element={<Search />} /> 
              </Route>
          </Routes>
        </BrowserRouter>
      </IsShelterContext.Provider>
  </TokenContext.Provider>
  )
}

export default App;
