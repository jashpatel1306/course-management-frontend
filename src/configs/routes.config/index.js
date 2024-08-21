import authRoute from './authRoute'
import appsRoute from './appsRoute'
import pagesRoute from './pagesRoute'

export const publicRoutes = [
    ...authRoute
]

export const protectedRoutes = [
    ...appsRoute,
    ...pagesRoute,
]