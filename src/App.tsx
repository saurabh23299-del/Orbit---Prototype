import { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/shell/AppShell';
import { ToastViewport } from './components/Toast';
import { applyTheme, useAppStore } from './store/appStore';
import Analytics from './pages/Analytics';
import ComponentsPage from './pages/ComponentsPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const theme = useAppStore((s) => s.theme);
  useEffect(() => applyTheme(theme), [theme]);

  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastViewport />
    </MotionConfig>
  );
}
