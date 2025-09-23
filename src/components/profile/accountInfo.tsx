import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Badge from "../badge";
import { toast } from "sonner";
import Spinner from "../spinner";
import { Input } from "../ui/input";
import { User } from "@/types/user";
import { Button } from "../ui/button";
import formatDate from "@/utils/formatDate";
import UserRoleBadge from "../users/userRoleBadge";
import { Check, TestTubeDiagonal, X } from "lucide-react";
import { PasswordValidationResult } from "@/types/password";
import { userUpdatePassword } from "@/services/authServices";
import {
  passwordValidationMessage,
  validatePassword,
} from "@/utils/passwordValidation";
import { getUserProfile, updateUserProfile } from "@/services/userServices";

export default function AccountInfo() {
  const [user, setUser] = useState<User>();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    expertise: "",
    yearsOfExperience: "",
    password: "",
    confirmPassword: "",
  });

  const fetchUserProfile = () => {
    setIsLoading(true);

    getUserProfile()
      .then((data) => {
        setUser(data);
        setFormValues({
          ...formValues,
          firstName: data.firstName,
          lastName: data.lastName,
          expertise: data.expertise,
          yearsOfExperience: data.yearsOfExperience,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setHasError(true);
      });
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const passwordValidation: PasswordValidationResult = useMemo(() => {
    return validatePassword(formValues.password);
  }, [formValues]);

  const isButtonDisabled = useMemo(() => {
    const {
      firstName,
      lastName,
      expertise,
      yearsOfExperience,
      password,
      confirmPassword,
    } = formValues;

    if (
      !password &&
      firstName === user?.firstName &&
      lastName === user?.lastName &&
      expertise === user?.expertise &&
      yearsOfExperience === user?.yearsOfExperience
    )
      return true;
    if (isSubmitting) return true;
    if (!firstName) return true;
    if (!lastName) return true;
    if (!expertise) return true;
    if (password && !confirmPassword) return true;
    if (!password && confirmPassword) return true;
    if (password !== confirmPassword) return true;
    if (
      password &&
      Object.values(passwordValidation).some((isFulfilled) => !isFulfilled)
    )
      return true;

    return false;
  }, [user, formValues, isSubmitting, passwordValidation]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    e.preventDefault();

    const {
      firstName,
      lastName,
      expertise,
      yearsOfExperience,
      password,
      confirmPassword,
    } = formValues;

    if (password) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setIsSubmitting(false);
        return;
      }

      userUpdatePassword({ newPassword: password })
        .then(({ error }) => {
          if (error) throw error.message;
          setIsSubmitting(false);

          updateUserProfile({
            firstName,
            lastName,
            expertise,
            yearsOfExperience,
          })
            .then(() => {
              setIsSubmitting(false);
              fetchUserProfile();
              toast.success("Profile updated successfully");
            })
            .catch((error) => {
              toast.error(error);
              setIsSubmitting(false);
            });
        })
        .catch((error) => {
          setIsSubmitting(false);
          toast.error(error);
          return;
        });
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      {/* User Details Card */}
      <div className="bg-white shadow-sm rounded-sm px-6 lg:px-8 py-5 border flex sm:flex-col gap-5 items-center sm:text-center w-full sm:w-[280px]">
        <div
          className="text-lg size-12 sm:size-16 rounded-full grid place-items-center font-semibold text-gray-600 uppercase shrink-0 shadow-md"
          style={{
            backgroundColor: user?.organizations?.colourCode || "lightgrey",
          }}
        >
          {user?.firstName?.substring(0, 1)}
        </div>

        <div className="flex flex-col gap-1 sm:gap-2 items-start sm:items-center w-full">
          {isLoading ? (
            <>
              <div className="bg-gray-200 h-4 sm:h-6 w-full rounded-sm"></div>
              <div className="bg-gray-200 h-4 w-full rounded-sm"></div>
              <div className="bg-gray-200 h-4 w-full rounded-sm my-2 sm:my-3"></div>
              <div className="flex sm:flex-col gap-2">
                <div className="bg-gray-200 h-4 w-20 rounded-sm"></div>
                <div className="bg-gray-200 h-4 w-28 rounded-sm"></div>
              </div>
            </>
          ) : (
            <>
              <p className="sm:text-[16px] font-semibold line-clamp-2">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs font-medium">{user?.email}</p>
              <p className="text-[10px] font-medium my-2 sm:my-3 text-gray-500">
                {user?.organizations?.name}
              </p>
              {user && (
                <div className="flex sm:flex-col gap-2 items-center">
                  <UserRoleBadge user={user} />
                  <div>
                    <Badge variant="info">
                      <TestTubeDiagonal />
                      Joined since{" "}
                      {user?.joinedAt ? formatDate(user?.joinedAt) : "-"}
                    </Badge>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Profile Card */}
      <div className="bg-white w-full shadow-sm rounded-sm px-8 py-6 border flex flex-col gap-5 flex-1">
        <h2>Edit Profile</h2>
        <hr />

        {hasError ? (
          <p className="text-center text-gray-600 text-xs py-4">
            Unable to fetch profile. Please try again later.
          </p>
        ) : isLoading ? (
          <Spinner className="my-4" />
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full flex flex-col gap-2">
                <label>First Name</label>
                <Input
                  name="firstName"
                  value={formValues.firstName}
                  onChange={onInputChange}
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <label>Last Name</label>
                <Input
                  name="lastName"
                  value={formValues.lastName}
                  onChange={onInputChange}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full flex flex-col gap-2">
                <label>Expertise</label>
                <Input
                  name="expertise"
                  value={formValues.expertise}
                  onChange={onInputChange}
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <label>Years of Experience</label>
                <Input
                  name="yearsOfExperience"
                  type="number"
                  value={formValues.yearsOfExperience}
                  onChange={onInputChange}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full flex flex-col gap-2">
                <label>Password</label>
                <Input
                  type="password"
                  name="password"
                  onChange={onInputChange}
                />
                {formValues.password && (
                  <div className="text-[10px] flex flex-col gap-0.5">
                    {(
                      Object.entries(passwordValidation) as [
                        keyof PasswordValidationResult,
                        boolean,
                      ][]
                    ).map(([key, isFulfilled]) => (
                      <p
                        key={key}
                        className={`${isFulfilled ? "text-green-700" : "text-red-700"} flex gap-2 items-center px-1`}
                      >
                        {isFulfilled ? (
                          <Check className="size-3" />
                        ) : (
                          <X className="size-3" />
                        )}
                        {passwordValidationMessage[key]}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col gap-2">
                <label>Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  onChange={onInputChange}
                />
                {formValues.confirmPassword &&
                  formValues.password !== formValues.confirmPassword && (
                    <p className="text-red-700 text-[10px] px-1">
                      Passwords do not match
                    </p>
                  )}
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <Button disabled={isButtonDisabled}>Update Profile</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
