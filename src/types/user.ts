export interface User {
  id: string;
  profileId?: string;
  firstName: string;
  lastName: string;
  expertise: string;
  yearsOfExperience: string;
  role: UserRole;
  email: string;
  joinedAt: string;
  organization?: {
    id: string;
    nid: string;
    name: string;
    colourCode: string;
  };
  organizations?: {
    id: string;
    nid: string;
    name: string;
    colourCode: string;
  };
}

export interface UserApi {
  user_id: string;
  profile_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  organization?: {
    id: string;
    nid: string;
    name: string;
    colour_code: string;
  };
  organizations?: {
    id: string;
    nid: string;
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

export enum LogAction {
  ADD = "add",
  UPDATE = "update",
  DELETE = "delete",
  IMPORT = "import",
}

export interface Log {
  id: string;
  actionDate: string;
  action: LogAction;
  actionBy: string;
  name: string;
  updateType: string;
  changes?: FieldChange[];
  dataId: string;
}

export interface FieldChange {
  field: string;
  from: string;
  to: string;
}

export interface LogApi {
  id: string;
  action_date: string;
  action: LogAction;
  action_by: LogAction;
  update_type?: string;
  changes: FieldChange[];
  name: string;
  data_id: string;
}

export interface LogItemApi {
  family_id: string;
  family_name: string;
  total_herbarium: number;
}

export interface UserActivitySummary {
  totalHerbarium: number;
  topFamily: string;
  data: {
    familyId: string;
    familyName: string;
    totalHerbarium: number;
  }[];
}
