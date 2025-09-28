import Badge from "../badge";
import { User, UserRole } from "@/types/user";
import { Crown, Star, User as UserIcon } from "lucide-react";

export default function UserRoleBadge({
  user,
}: {
  user: User | Partial<User>;
}) {
  return user.role === UserRole.SUPER_ADMIN ? (
    <Badge variant="purple">
      <Crown />
      Super Admin
    </Badge>
  ) : user.role === UserRole.ADMIN ? (
    <Badge variant="indigo">
      <Crown />
      Admin
    </Badge>
  ) : user?.role === UserRole.EXPERT ? (
    <Badge variant="success">
      <Star />
      Expert
    </Badge>
  ) : (
    <Badge>
      <UserIcon />
      Member
    </Badge>
  );
}
