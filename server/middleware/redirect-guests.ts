// filename: server/middleware/redirect-guests.ts
// This middleware will redirect all guests to /login

export default defineEventHandler(async (event) => {
  const user = await getUserSession(event);
  const route = getRequestURL(event).pathname;

  if (!user && !route.endsWith('login')) {
    return sendRedirect(event, '/login')
  } else if (user && route.endsWith('login')) {
    return sendRedirect(event, '/')
  }
})
