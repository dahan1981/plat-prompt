export const mockUser = {
  name: "Nina",
  email: "cliente@exemplo.com",
  role: "admin",
  hasAccess: true
};

export function canAccessProduct() {
  return mockUser.hasAccess;
}
