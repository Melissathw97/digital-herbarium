"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { User } from "@/types/user";
import Badge from "@/components/badge";
import Spinner from "@/components/spinner";
import formatDate from "@/utils/formatDate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Crown, User as UserIcon } from "lucide-react";
import { userUpdatePassword } from "@/services/authServices";
import { getUserProfile, updateUserProfile } from "@/services/userServices";

export default function MembersPage() {
  const [user, setUser] = useState<User>();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
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

  const isButtonDisabled = useMemo(() => {
    const { firstName, lastName, password, confirmPassword } = formValues;

    if (
      !password &&
      firstName === user?.firstName &&
      lastName === user?.lastName
    )
      return true;
    if (isSubmitting) return true;
    if (!firstName) return true;
    if (!lastName) return true;
    if (password && !confirmPassword) return true;
    if (!password && confirmPassword) return true;
  }, [user, formValues, isSubmitting]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    e.preventDefault();

    const { firstName, lastName, password, confirmPassword } = formValues;

    if (password) {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        setIsSubmitting(false);
        return;
      }

      userUpdatePassword({ newPassword: password })
        .then(({ error }) => {
          if (error) throw error.message;
          setIsSubmitting(false);
        })
        .catch((error) => {
          setIsSubmitting(false);
          alert(error);
        });
    }

    if (firstName !== user?.firstName || lastName !== user?.lastName) {
      updateUserProfile({ firstName, lastName })
        .then(() => {
          setIsSubmitting(false);
          fetchUserProfile();
        })
        .catch((error) => {
          console.error(error);
          setIsSubmitting(false);
        });
    }
  };

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>My Profile</h1>

      <div className="flex gap-4 items-start">
        <div className="bg-white shadow-sm rounded-sm px-10 py-5 border flex flex-col gap-5 items-center text-center w-[280px]">
          <div className="bg-gray-200 text-lg h-16 w-16 rounded-full grid place-items-center font-semibold text-gray-500 uppercase shrink-0">
            {user?.firstName?.substring(0, 1)}
          </div>

          <div className="flex flex-col gap-2 items-center w-full">
            {isLoading ? (
              <>
                <div className="bg-gray-200 h-6 w-full rounded-sm"></div>
                <div className="bg-gray-200 h-4 w-full rounded-sm"></div>
                <div className="bg-gray-200 h-4 w-14 rounded-sm mt-3 mx-auto"></div>
              </>
            ) : (
              <>
                <p className="text-[16px] font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs font-semibold mb-3">{user?.email}</p>
                {user &&
                  (user?.role === "super_admin" ? (
                    <Badge variant="purple">
                      <Crown />
                      Admin
                    </Badge>
                  ) : (
                    <Badge>
                      <UserIcon />
                      Member
                    </Badge>
                  ))}
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Joined at:{" "}
            <b>{user?.joinedAt ? formatDate(user?.joinedAt) : "-"}</b>
          </p>
        </div>
        <div className="bg-white shadow-sm rounded-sm px-8 py-6 border flex flex-col gap-5 flex-1">
          <h2>Edit Profile</h2>
          <hr />

          {hasError ? (
            <p className="text-center text-gray-600 text-xs py-4">
              Unable to fetch profile. Please try again later.
            </p>
          ) : isLoading ? (
            <Spinner className="my-4" />
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="flex gap-4 my-2">
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

              <div className="flex gap-4 my-2">
                <div className="w-full flex flex-col gap-2">
                  <label>Password</label>
                  <Input
                    type="password"
                    name="password"
                    onChange={onInputChange}
                  />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label>Confirm Password</label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    onChange={onInputChange}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-3">
                <Button disabled={isButtonDisabled}>Update Profile</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
