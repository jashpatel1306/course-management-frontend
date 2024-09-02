import authRoute from './authRoute'
import appsRoute from './appsRoute'
import pagesRoute from './pagesRoute'
import userProfileRoute from './userProfileRoute'
import studentRoute from './studentRoute'
import instructorRoute from './instructorRoute'

export const publicRoutes = [
    ...authRoute
]

export const protectedRoutes = [
    ...appsRoute,
    ...pagesRoute,
    ...userProfileRoute,
    ...studentRoute,
    ...instructorRoute
]