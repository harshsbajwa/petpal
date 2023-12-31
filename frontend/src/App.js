import "./App.css";
import Login from "./pages/Login";
import SeekerRegister from "./pages/SeekerRegister";
import ShelterRegister from "./pages/ShelterRegister";
import AddPet from "./pages/AddPet";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { TokenContext } from "./context/TokenContext";
import { useState, useEffect } from "react";
import ProtectedSeekerRoutes from "./context/ProtectedSeekerRoutes";
import ProtectedShelterRoutes from "./context/ProtectedShelterRoutes";
import { IsShelterContext } from "./context/IsShelterContext";
import Search from "./pages/Search";
import ApplicationList from "./pages/ApplicationList";
import Application from "./pages/Application";
import Shelterdetail from "./pages/ShelterDetail";
import ListShelter from "./pages/ListShelter";
import SeekerDetail from "./pages/SeekerDetail";
import SeekerUpdate from "./pages/SeekerUpdate/index";
import NotFound from "./pages/NotFound";
import MainComponent from "./components/PetlistingPaginationComponent/MainComponent";
import ShelterNavComponent from "./components/ShelterNavComponent";
import ApplicationCommentsListCreate from "./components/comments/createapplicationcomments";
import ShelterBlog from "./pages/ShelterBlog";
import NotificationPage from "./pages/NotificationPage/NotificationPage";
import SeekerNavComponent from "./components/SeekerNavComponent";
import PetListingDetails from "./pages/PetListingDetail/PetListingDetail";

function App() {
  const [token, setToken] = useState(null);
  const [isShelter, setIsShelter] = useState(null);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      <IsShelterContext.Provider value={{ isShelter, setIsShelter }}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Login />} />
            <Route path="/seeker-register" element={<SeekerRegister />} />
            <Route path="/shelter-register" element={<ShelterRegister />} />
            <Route path="/shelter-register-add-pet" element={<AddPet />} />
            <Route element={<ProtectedSeekerRoutes />}>
              <Route path="/search-page" element={<Search />} />
              <Route path="/applications" element={<ApplicationList />} />
              <Route
                path="/application/:params"
                element={
                  <>
                    <Application />
                    <ApplicationCommentsListCreate />
                  </>
                }
              />
              <Route path="/seeker/detail" element={<SeekerDetail />} />
              <Route path="/seeker/update/" element={<SeekerUpdate />} />
              <Route path="/notifications" element={<><SeekerNavComponent /> <NotificationPage /></>} />
            </Route>
            <Route element={<ProtectedShelterRoutes />}>
              <Route path="/shelter-blog" element={<ShelterBlog />} />
              <Route path="/shelter-detail" element={<Shelterdetail />} />
              <Route
                path="/shelter/mypets/"
                element={
                  <>
                    <ShelterNavComponent />
                    <MainComponent addedpets={[]} />
                  </>
                }
              />
              <Route path="/notifications-shelter" element={<><ShelterNavComponent /> <NotificationPage /></>} />
            </Route>
            <Route path="/pet-listing/:pk" element={<><SeekerNavComponent /><PetListingDetails /></>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </IsShelterContext.Provider>
    </TokenContext.Provider>
  );
}

export default App;
