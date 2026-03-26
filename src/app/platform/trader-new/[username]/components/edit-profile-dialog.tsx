"use client";

import { useEffect } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { countries } from "countries-list";
import {
  AtSign,
  CalendarIcon,
  Loader2,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/phone-number-input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/providers/user-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UpdateUserProfilePayload } from "@/schemas/user";
import { formatDateOnly } from "@/lib/utils/formatDates";

const countriesList = Object.entries(countries)
  .map(([code, country]) => ({
    code,
    name: country.name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const editProfileSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be 30 characters or less")
      .regex(
        /^[a-zA-Z0-9._]+$/,
        "Username can only contain letters, numbers, dots, and underscores",
      ),
    full_name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    display_name: z
      .string()
      .trim()
      .max(50, "Display name must be 50 characters or less")
      .optional()
      .or(z.literal("")),
    bio: z
      .string()
      .trim()
      .max(280, "Bio must be 280 characters or less")
      .optional()
      .or(z.literal("")),
    birth_date: z.string({
      error: "Birth date is required",
    }),
    phone_number: z.string().trim().min(1, "Phone number is required"),
    location: z.string().trim().min(1, "Location is required"),
  })
  .refine(
    (data) => {
      const today = new Date();
      const dob = new Date(data.birth_date);
      const age = today.getFullYear() - dob.getFullYear();
      const hasHadBirthdayThisYear =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
          today.getDate() >= dob.getDate());

      const actualAge = hasHadBirthdayThisYear ? age : age - 1;
      return actualAge >= 13;
    },
    {
      message: "You must be at least 13 years old",
      path: ["birth_date"],
    },
  );

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

type EditProfileDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: UpdateUserProfilePayload) => Promise<void>;
};

export default function EditProfileDialog({
  open,
  onClose,
  onSave,
}: EditProfileDialogProps) {
  const { user } = useUser();
  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user?.profile?.username ?? "",
      full_name: user?.profile?.full_name ?? "",
      display_name: user?.profile?.display_name ?? "",
      bio: user?.profile?.bio ?? "",
      birth_date: user?.profile?.birth_date ?? "",
      phone_number: user?.profile?.phone_number ?? "",
      location: user?.profile?.location ?? "AU",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (!open) return;

    reset({
      username: user?.profile?.username ?? "",
      full_name: user?.profile?.full_name ?? "",
      display_name: user?.profile?.display_name ?? "",
      bio: user?.profile?.bio ?? "",
      birth_date: user?.profile?.birth_date ?? "",
      phone_number: user?.profile?.phone_number ?? "",
      location: user?.profile?.location ?? "AU",
    });
  }, [open, user, reset]);

  const handleFormSubmit = async (values: UpdateUserProfilePayload) => {
    await onSave({
      ...values,
      username: values.username.trim(),
      full_name: values.full_name.trim(),
      display_name: values.display_name?.trim() ?? "",
      bio: values.bio?.trim() ?? "",
      birth_date: values.birth_date,
      phone_number: values.phone_number?.trim(),
      location: values.location?.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your trader profile details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              <FieldGroup className="max-h-[70vh]">
                <Field>
                  <FieldLabel htmlFor="username">
                    Username <span className="text-red-500">*</span>
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>
                        <AtSign className="h-4 w-4" />
                      </InputGroupText>
                    </InputGroupAddon>

                    <InputGroupInput
                      id="username"
                      required
                      placeholder="Choose a username"
                      autoComplete="username"
                      {...register("username")}
                    />
                  </InputGroup>

                  <FieldDescription>
                    Letters, numbers, dots, and underscores only.
                  </FieldDescription>

                  {errors.username?.message && (
                    <FieldError>{errors.username.message}</FieldError>
                  )}
                </Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="full_name">
                      Full name <span className="text-red-500">*</span>
                    </FieldLabel>

                    <InputGroup>
                      <InputGroupInput
                        id="full_name"
                        required
                        placeholder="Enter your full name"
                        autoComplete="name"
                        {...register("full_name")}
                      />
                      <InputGroupAddon>
                        <InputGroupText>
                          <UserRound className="h-4 w-4" />
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>

                    {errors.full_name?.message && (
                      <FieldError>{errors.full_name.message}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="display_name">Display name</FieldLabel>

                    <InputGroup>
                      <InputGroupInput
                        id="display_name"
                        placeholder="Your public display name"
                        {...register("display_name")}
                      />
                    </InputGroup>

                    {errors.display_name?.message && (
                      <FieldError>{errors.display_name.message}</FieldError>
                    )}
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="bio">Bio</FieldLabel>

                  <Textarea
                    id="bio"
                    placeholder="Tell people about your investing journey..."
                    className="min-h-24"
                    maxLength={280}
                    {...register("bio")}
                  />

                  {errors.bio?.message && (
                    <FieldError>{errors.bio.message}</FieldError>
                  )}
                </Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="birth_date">Birth date</FieldLabel>

                    <Controller
                      control={control}
                      name="birth_date"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="birth_date"
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="h-4 w-4" />
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Select your birth date</span>
                              )}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(date ? formatDateOnly(date) : "")
                              }
                              captionLayout="dropdown"
                              disabled={(date) => date > new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />

                    <FieldDescription>
                      You must be at least 13 years old.
                    </FieldDescription>

                    {errors.birth_date?.message && (
                      <FieldError>{errors.birth_date.message}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="phone_number">Phone number</FieldLabel>

                    <Controller
                      control={control}
                      name="phone_number"
                      render={({ field }) => (
                        <div className="space-y-2">
                          <PhoneInput
                            defaultCountry="AU"
                            international
                            placeholder="Enter phone number"
                            value={field.value}
                            onChange={(value) => field.onChange(value ?? "")}
                          />
                        </div>
                      )}
                    />

                    {errors.phone_number?.message && (
                      <FieldError>{errors.phone_number.message}</FieldError>
                    )}
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="location">Country</FieldLabel>

                  <Controller
                    control={control}
                    name="location"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="location" className="w-full">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select your country" />
                          </div>
                        </SelectTrigger>

                        <SelectContent className="max-h-72">
                          {countriesList.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <FieldDescription>
                    Select the country you currently live in.
                  </FieldDescription>

                  {errors.location?.message && (
                    <FieldError>{errors.location.message}</FieldError>
                  )}
                </Field>
              </FieldGroup>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
