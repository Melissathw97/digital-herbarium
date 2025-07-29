export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
  joinedAt: string;
}

export interface UserApi {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export enum UserRole {
  ADMIN = "super_admin",
  MEMBER = "member",
}
