// The single owner email allowed to sign in to the admin dashboard.
// The database role check (is_admin) is the real gate; this only stops other emails early.
export const ADMIN_EMAIL = "adnexadmin@gmail.com";

export function isAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
