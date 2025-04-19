import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from "./pages/login"
import AdminNavPage from './pages/adminNav'
import Profile from "./pages/profile"
import External from './pages/external'
import ExternalNav from './pages/externalNav'
import Template from './pages/template'
import ContactData from './pages/contactData'
import InternalNav from './pages/internalNav'
import Submitted from './pages/submitted'
import NoPage from "./pages/nopage"
import UserNav from './pages/userNav'
import Viewform from './pages/viewform'
import Points from './pages/points'
import Match from './pages/match'
import './App.css';
import './output.css';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/adminnav" element={<AdminNavPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/submitted" element={<Submitted />} />
          <Route path="/internalNav" element={<InternalNav />} />
          <Route path="/external" element={<External />} />
          <Route path="/externalnav" element={<ExternalNav />} />
          <Route path="/template" element={<Template />} />
          <Route path="/contactdata" element={<ContactData />} />
          <Route path="/userNav" element={<UserNav />} />
          <Route path="/viewform" element={<Viewform />} />
          <Route path="/points" element={<Points />} />
          <Route path="/match" element={<Match />} />

          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App