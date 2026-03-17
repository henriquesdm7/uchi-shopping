declare module '#auth-utils' {
  interface User {
    id: string,
    name: string,
    email: string,
  }

  interface UserSession {
    user: User,
  }

  // interface SecureSessionData {
  //   // Add your own fields
  // }
}

export {}
