// 📁 src/core/entities/User.ts
export interface User {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  phone: string | null;
  profile_photo_url: string | null;
  is_active: boolean | null;
  last_login_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserWithRoles extends User {
  roles: {
    id: string;
    name: string;
    display_name: string;
    level: string;
    color: string | null;
  }[];
}
