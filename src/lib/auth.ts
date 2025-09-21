
import { mockUsers } from './data';

export function authenticateUser(email: string, password_provided: string) {
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (user && user.password === password_provided) {
    // In a real app, you would not return the password.
    // This is simplified for mock purposes.
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}
