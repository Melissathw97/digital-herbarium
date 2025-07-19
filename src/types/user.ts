export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  joinedAt: string;
}

export interface UserApi {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
}
