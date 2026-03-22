import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProgrammeList from './pages/ProgrammeList';
import ProgrammeDetail from './pages/ProgrammeDetail';
import LogSession from './pages/LogSession';
import Incidents from './pages/Incidents';
import IncidentForm from './pages/IncidentForm';
import History from './pages/History';
import Settings from './pages/Settings';
import './App.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="programmes" element={<ProgrammeList />} />
          <Route path="programmes/:id" element={<ProgrammeDetail />} />
          <Route path="log-session" element={<LogSession />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="incidents/new" element={<IncidentForm />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
