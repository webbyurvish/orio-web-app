import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import { ScrollToTop } from "./components/ScrollToTop";
import OrioAppShell from "./components/OrioAppShell";
import { AppRouteFallback } from "./components/AppRouteFallback";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminApp = lazy(() => import("./pages/admin/AdminApp"));
const AuthRelayDebugPage = lazy(() => import("./pages/AuthRelayDebugPage"));
const AuthDesktopCompletePage = lazy(
  () => import("./pages/AuthDesktopCompletePage"),
);
const AffordableInterviewAssistantsPage = lazy(
  () => import("./pages/AffordableInterviewAssistantsPage"),
);
const ParakeetAlternativePage = lazy(
  () => import("./pages/ParakeetAlternativePage"),
);
const FinalRoundAlternativePage = lazy(
  () => import("./pages/FinalRoundAlternativePage"),
);
const InterviewWarmupAlternativePage = lazy(
  () => import("./pages/InterviewWarmupAlternativePage"),
);
const LockedInAlternativePage = lazy(
  () => import("./pages/LockedInAlternativePage"),
);
const TermsAndConditionsPage = lazy(
  () => import("./pages/TermsAndConditionsPage"),
);
const DeliveryPolicyPage = lazy(() => import("./pages/DeliveryPolicyPage"));
const RefundsCancellationPage = lazy(
  () => import("./pages/RefundsCancellationPage"),
);
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  // After logout we want users back on the landing page (not the login screen).
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function ShellSuspense({ children }: { children: React.ReactNode }) {
  return (
    <OrioAppShell>
      <Suspense fallback={<AppRouteFallback />}>{children}</Suspense>
    </OrioAppShell>
  );
}

export default function App() {
  console.log({"App"});
  
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <OrioAppShell>
              <LoginPage />
            </OrioAppShell>
          }
        />
        <Route
          path="/auth"
          element={
            <ShellSuspense>
              <AuthRelayDebugPage />
            </ShellSuspense>
          }
        />
        <Route
          path="/auth/desktop"
          element={
            <ShellSuspense>
              <AuthRelayDebugPage />
            </ShellSuspense>
          }
        />
        <Route
          path="/auth/desktop-complete"
          element={
            <ShellSuspense>
              <AuthDesktopCompletePage />
            </ShellSuspense>
          }
        />
        <Route
          path="/signup"
          element={
            <OrioAppShell>
              <SignupPage />
            </OrioAppShell>
          }
        />
        <Route
          path="/affordable-interview-assistants"
          element={
            <ShellSuspense>
              <AffordableInterviewAssistantsPage />
            </ShellSuspense>
          }
        />
        <Route
          path="/alternatives/parakeet-ai"
          element={
            <ShellSuspense>
              <ParakeetAlternativePage />
            </ShellSuspense>
          }
        />
        <Route
          path="/alternatives/final-round-ai"
          element={
            <ShellSuspense>
              <FinalRoundAlternativePage />
            </ShellSuspense>
          }
        />
        <Route
          path="/alternatives/interview-warmup"
          element={
            <ShellSuspense>
              <InterviewWarmupAlternativePage />
            </ShellSuspense>
          }
        />
        <Route
          path="/alternatives/lockedin-ai"
          element={
            <ShellSuspense>
              <LockedInAlternativePage />
            </ShellSuspense>
          }
        />
        <Route
          path="/terms"
          element={
            <ShellSuspense>
              <TermsAndConditionsPage />
            </ShellSuspense>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <ShellSuspense>
              <PrivacyPolicyPage />
            </ShellSuspense>
          }
        />
        <Route
          path="/delivery-policy"
          element={
            <ShellSuspense>
              <DeliveryPolicyPage />
            </ShellSuspense>
          }
        />
        <Route
          path="/refunds-cancellation"
          element={
            <ShellSuspense>
              <RefundsCancellationPage />
            </ShellSuspense>
          }
        />
        <Route
          path="/contact"
          element={
            <ShellSuspense>
              <ContactUsPage />
            </ShellSuspense>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <ShellSuspense>
                <DashboardPage />
              </ShellSuspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <ShellSuspense>
                <AdminApp />
              </ShellSuspense>
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <OrioAppShell>
              <NotFoundPage />
            </OrioAppShell>
          }
        />
      </Routes>
    </>
  );
}
