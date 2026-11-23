import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Public Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { CurrentFocus } from './components/CurrentFocus';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CVModal } from './components/CVModal';
import { PageTracker } from './components/PageTracker';

// Admin CMS Components
import { LoginPage } from './admin/LoginPage';
import { AdminLayout } from './admin/AdminLayout';
import { ProtectedRoute } from './admin/ProtectedRoute';
import { DashboardOverview } from './admin/DashboardOverview';
import { ProfileManager } from './admin/ProfileManager';
import { ProjectsManager } from './admin/ProjectsManager';
import { SkillsManager } from './admin/SkillsManager';
import { EducationManager } from './admin/EducationManager';
import { CVManager } from './admin/CVManager';
import { SocialLinksManager } from './admin/SocialLinksManager';
import { ContactManager } from './admin/ContactManager';
import { TranslationsManager } from './admin/TranslationsManager';
import { SettingsManager } from './admin/SettingsManager';

const PublicPortfolio: React.FC = () => {
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen flex flex-col bg-white text-slate-900 dark:bg-[#0B1120] dark:text-[#F8FAFC] transition-colors duration-300 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Navbar onOpenCVModal={() => setCvModalOpen(true)} />
      
      <main className="flex-grow">
        <Hero onOpenCVModal={() => setCvModalOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <Education />
        <CurrentFocus />
        <Contact />
      </main>

      <Footer />

      <CVModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <PageTracker />
              <Routes>
                {/* Public Portfolio Route */}
                <Route path="/" element={<PublicPortfolio />} />

                {/* Admin Auth Route */}
                <Route path="/admin/login" element={<LoginPage />} />

                {/* Protected Admin CMS Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardOverview />} />
                  <Route path="profile" element={<ProfileManager />} />
                  <Route path="projects" element={<ProjectsManager />} />
                  <Route path="skills" element={<SkillsManager />} />
                  <Route path="education" element={<EducationManager />} />
                  <Route path="cv" element={<CVManager />} />
                  <Route path="social" element={<SocialLinksManager />} />
                  <Route path="contact" element={<ContactManager />} />
                  <Route path="translations" element={<TranslationsManager />} />
                  <Route path="settings" element={<SettingsManager />} />
                </Route>

                {/* Catch-all Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
