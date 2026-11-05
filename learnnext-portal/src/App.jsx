import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { AppRoutes } from '@/routes/AppRoutes';
import { PwaUpdater } from '@/components/pwa/PwaPrompts';

/** App = providers + routes. Keep UI out of this file. */
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          {/* Installed app: registers the service worker on every page; "New version available" toast */}
          <PwaUpdater />
          <AuthProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
