// This middleware will redirect all guests to /login and logged in users to / if they try to access /login

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const route = getRequestURL(event).pathname;

  const isLoggedIn = !!session && !!session.user;

  if (!isLoggedIn && !route.endsWith('login')) {
    return sendRedirect(event, '/login')
  } else if (isLoggedIn && route.endsWith('login')) {
    return sendRedirect(event, '/')
  }
})
