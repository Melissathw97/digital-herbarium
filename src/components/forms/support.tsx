"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { getUserProfile } from "@/services/userServices";
import { postSupport } from "@/services/supportServices";
import SupportSentModal from "../modals/supportSent";

export default function ContactSupportForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    category: "",
    subject: "",
    name: "",
    email: "",
    description: "",
  });

  const [ticketId, setTicketId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    {
      label: "My organization is not registered in this system",
      value: "My organization is not registered in this system",
    },
    {
      label: "My account is linked to the wrong organization",
      value: "My account is linked to the wrong organization",
    },
    {
      label: "My role is incorrect for my organization",
      value: "My role is incorrect for my organization",
    },
    {
      label: "Issue signing up or logging in",
      value: "Issue signing up or logging in",
    },
    {
      label: "Feedback on a feature in the system",
      value: "Feedback on a feature in the system",
    },
    {
      label: "Technical issue or bug in the system",
      value: "Technical issue or bug in the system",
    },
    { label: "Others", value: "Others" },
  ];

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    postSupport(formValues)
      .then((response) => {
        setTicketId(response.ticket_id);
        setIsLoading(false);
        setIsModalOpen(true);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setFormValues({
          ...formValues,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
        });
      })
      .catch((error) => {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 items-center">
        <button
          onClick={() => router.back()}
          className="hover:bg-gray-200 -ml-2 -mt-1 p-1 pr-2 rounded-full flex gap-1 text-xs text-lime-700 mr-auto -mb-3"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back
        </button>
        <form onSubmit={onSubmit} className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-1 text-center">
            <h1>How can we help?</h1>
            <p className="text-gray-500">
              Provide us with more details so we can better help you.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label>Category</label>
              <Select
                value={formValues.category ?? ""}
                onValueChange={(value) =>
                  setFormValues({ ...formValues, category: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label>Subject</label>
              <Input name="subject" onChange={onInputChange} />
            </div>
            <div className="flex flex-col gap-2">
              <label>Name</label>
              <Input
                name="name"
                defaultValue={formValues.name}
                onChange={onInputChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Email</label>
              <Input
                type="email"
                name="email"
                defaultValue={formValues.email}
                onChange={onInputChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Description</label>
              <Textarea
                name="description"
                value={formValues.description}
                onChange={onTextAreaChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 font-medium text-center">
            <Button
              type="submit"
              disabled={
                Object.values(formValues).some((value) => !value) || isLoading
              }
            >
              {isLoading ? "Submitting" : "Submit"}
            </Button>
          </div>
        </form>
      </div>

      <SupportSentModal
        open={isModalOpen}
        ticketId={ticketId}
        onConfirm={() => {
          setIsModalOpen(false);
          router.back();
        }}
      />
    </>
  );
}
