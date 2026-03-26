"use client";

import { Formik, Form, Field } from "formik";
import { userProfileSchema } from "../functions/validationSchema";
import { updateProfile } from "@/services/api/modules/me";
import { useAppContext } from "@/contexts/app-context-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import BioInput from "./bioInput";
import { PhoneInput } from "./phoneInput";
import { LuPencil } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { BirthDateInput } from "./birthdateInputButton";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { User } from "@/schemas/user";

export default function EditProfileModal({
  triggerClassName,
}: {
  triggerClassName?: string;
}) {
  const { user, refreshUser } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const parsedUser = user ? User.fromJSON(user) : null;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className={triggerClassName || "text-sm rounded-md p-4 transition"}
        >
          <LuPencil />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="mb-3">
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>* Indicates a required field</DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{
            username: parsedUser?.profile?.username || "",
            full_name: parsedUser?.profile?.full_name || "",
            display_name: parsedUser?.profile?.display_name || "",
            bio: parsedUser?.profile?.bio || "",
            birth_date: parsedUser?.profile?.birth_date || "",
            phone_number: parsedUser?.profile?.phone_number || "",
          }}
          validationSchema={userProfileSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            await toast.promise(
              (async () => {
                await updateProfile(values);
                await refreshUser();
                resetForm({ values });
                setDialogOpen(false);
              })(),
              {
                loading: "Saving changes...",
                success: "Profile updated successfully.",
                error: (err) => ({
                  message: "Failed to update profile.",
                  description: err?.message || "Please try again later.",
                }),
              },
            );
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className="grid gap-4">
              <Field name="username">
                {({ field, meta }: any) => (
                  <div className="grid gap-3">
                    <Label htmlFor="username" className="px-1">
                      Username*
                    </Label>
                    <div className="flex flex-col gap-0.5">
                      <Input
                        id="username"
                        placeholder="Username"
                        {...field}
                        className={cn(
                          "rounded-lg",
                          meta.touched && meta.error && "border-destructive",
                        )}
                      />
                      {meta.touched && meta.error && (
                        <p className="text-xs text-destructive">{meta.error}</p>
                      )}
                    </div>
                  </div>
                )}
              </Field>

              <Field name="full_name">
                {({ field, meta }: any) => (
                  <div className="grid gap-3">
                    <Label htmlFor="full_name" className="px-1">
                      Full name*
                    </Label>
                    <div className="flex flex-col gap-0.5">
                      <Input
                        id="full_name"
                        placeholder="Full name"
                        {...field}
                        className={cn(
                          "rounded-lg",
                          meta.touched && meta.error && "border-destructive",
                        )}
                      />
                      {meta.touched && meta.error && (
                        <p className="text-xs text-destructive">{meta.error}</p>
                      )}
                    </div>
                  </div>
                )}
              </Field>

              <Field name="display_name">
                {({ field, meta }: any) => (
                  <div className="grid gap-3">
                    <Label htmlFor="display_name" className="px-1">
                      Display name
                    </Label>
                    <div className="flex flex-col gap-0.5">
                      <Input
                        id="display_name"
                        placeholder="Display name"
                        {...field}
                        className={cn(
                          "rounded-lg",
                          meta.touched && meta.error && "border-destructive",
                        )}
                      />
                      {meta.touched && meta.error && (
                        <p className="text-xs text-destructive">{meta.error}</p>
                      )}
                    </div>
                  </div>
                )}
              </Field>
              <div className="grid md:grid-cols-2 gap-4">
                <Field name="phone_number">
                  {({ field, meta }: any) => (
                    <div className="grid gap-3">
                      <Label htmlFor="phone_number" className="px-1">
                        Phone number
                      </Label>
                      <div className="flex flex-col gap-0.5">
                        <PhoneInput
                          id="phone_number"
                          name="phone_number"
                          {...field}
                          className={
                            meta.touched && meta.error
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {meta.touched && meta.error && (
                          <p className="text-xs text-destructive">
                            {meta.error}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </Field>

                <Field name="birth_date">
                  {({ meta }: any) => (
                    <div className="grid gap-3">
                      <Label htmlFor="birth_date" className="px-1">
                        Date of birth
                      </Label>
                      <BirthDateInput
                        id="birth_date"
                        name="birth_date"
                        className={cn(
                          "rounded-lg",
                          meta.touched && meta.error && "border-destructive",
                        )}
                      />
                      {meta.touched && meta.error && (
                        <p className="text-xs text-destructive">{meta.error}</p>
                      )}
                    </div>
                  )}
                </Field>
              </div>

              <Field name="bio">
                {({ field, meta }: any) => (
                  <div className="grid gap-3">
                    <Label htmlFor="bio" className="px-1">
                      Bio
                    </Label>
                    <div className="flex flex-col gap-0.5">
                      <BioInput
                        name="bio"
                        {...field}
                        className={cn(
                          "rounded-lg",
                          meta.touched && meta.error && "border-destructive",
                        )}
                      />
                      {meta.touched && meta.error && (
                        <p className="text-xs text-destructive">{meta.error}</p>
                      )}
                    </div>
                  </div>
                )}
              </Field>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button" className="w-25">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  variant={isSubmitting ? "loading" : "default"}
                  className="w-35"
                >
                  {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
