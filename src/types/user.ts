export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
  joinedAt: string;
  organization?: {
    id: string;
    name: string;
  };
  organizations?: {
    id: string;
    name: string;
    colourCode: string;
  };
}

export interface UserApi {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  organization?: {
    id: string;
    name: string;
  };
  organizations?: {
    id: string;
    name: string;
    colour_code: string;
  };
}

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  EXPERT = "expert",
  MEMBER = "member",
}
