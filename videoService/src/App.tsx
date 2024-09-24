// src/App.tsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@gravity-ui/uikit';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { useSelector } from 'react-redux';
import { RootState } from './store/Store';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { NotFoundPage } from './pages/NotFound';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { VideoSocketPage } from './pages/VideoSocketPage';

function App() {
  const theme = useSelector((state: RootState) => state.themeStore.theme);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />  
            <Route path="about" element={<AboutPage />} /> 
            <Route path="profile" element={<Profile />} /> 
            <Route path="settings" element={<Settings />} /> 
            <Route path="admin" element={<Admin />} /> 
            <Route path="video/:roomId" element={<VideoSocketPage/>}/>
            <Route path="*" element={<NotFoundPage />} /> {/* Страница 404 */}
          </Route>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
