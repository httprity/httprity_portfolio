import { usePageMotion } from './hooks/usePageMotion';
import { Route, Routes } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProjectPage } from './pages/ProjectPage';
import { useHashScroll } from './hooks/useHashScroll';

export default function App() {
  useHashScroll();
  usePageMotion();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="page-guides" aria-hidden="true" />
      <div className="reading-progress" aria-hidden="true" />
      <Navigation />
      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
