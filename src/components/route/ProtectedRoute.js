import React from 'react'
import appConfig from 'configs/app.config'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from 'utils/hooks/useAuth'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = () => {

	const { authenticated } = useAuth()


	if (!authenticated) {
		return <Navigate to={`${unAuthenticatedEntryPath}`} replace />;
	}

	return <Outlet />
}

export default ProtectedRoute