import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import ApplicationsPage from '@/components/pages/ApplicationsPage';
import ApplicationDetailPage from '@/components/pages/ApplicationDetailPage';
import AddApplicationPage from '@/components/pages/AddApplicationPage';
import EditApplicationPage from '@/components/pages/EditApplicationPage';
import ResumesPage from '@/components/pages/ResumesPage';
import AddResumePage from '@/components/pages/AddResumePage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "applications",
        element: <ApplicationsPage />,
      },
      {
        path: "applications/new",
        element: <AddApplicationPage />,
      },
      {
        path: "applications/:id",
        element: <ApplicationDetailPage />,
      },
      {
        path: "applications/:id/edit",
        element: <EditApplicationPage />,
      },
      {
        path: "resumes",
        element: <ResumesPage />,
      },
      {
        path: "resumes/new",
        element: <AddResumePage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
