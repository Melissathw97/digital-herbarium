import { Pagination } from "./plant";
import { User } from "./user";

export interface SimplifiedOrganization {
  id: string;
  nid: string;
  name: string;
}

export interface Organization {
  id: string;
  nid: string;
  name: string;
  imagePath: string;
  colorCode: string;
  imageUrl: string;
  users: {
    data: User[];
    pagination: Pagination;
  };
}

export interface OrganizationApi {
  id: string;
  nid: string;
  name: string;
  image_path: string;
  color_code: string;
  image_url: string;
}

export interface OrganizationPayload {
  nid: string;
  name: string;
  image?: File;
}
