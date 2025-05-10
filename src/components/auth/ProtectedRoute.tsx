import { ReactNode } from 'react';

interface ProtectedRouteProps {
	children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	// Temporarily bypass auth checks
	return <>{children}</>;
};
