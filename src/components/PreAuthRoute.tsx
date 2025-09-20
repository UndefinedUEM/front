import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type PreAuthRouteProps = {
  children: ReactNode;
};

const PreAuthRoute = ({ children }: PreAuthRouteProps) => {
  const isDeviceAuthorized =
    localStorage.getItem('deviceAuthorized') === 'true';

  if (!isDeviceAuthorized) {
    return <Navigate to="/authorize" replace />;
  }

  return children || <Outlet />;
};

export default PreAuthRoute;
