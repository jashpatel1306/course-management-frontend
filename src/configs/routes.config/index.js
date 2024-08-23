import authRoute from './authRoute'
import appsRoute from './appsRoute'
import pagesRoute from './pagesRoute'
import userProfileRoute from './userProfileRoute'

export const publicRoutes = [
    ...authRoute
]

export const protectedRoutes = [
    ...appsRoute,
    ...pagesRoute,
    ...userProfileRoute,
]