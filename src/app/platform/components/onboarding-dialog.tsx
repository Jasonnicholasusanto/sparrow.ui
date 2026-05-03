"use client";

import { useEffect } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, AtSign, UserRound, MapPin } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/phone-number-input";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import { countries } from "countries-list";

const countriesList = Object.entries(countries)
  .map(([code, country]) => ({
    code,
    name: country.name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const onboardingSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    dateOfBirth: z.date({
      error: "Date of birth is required",
    }),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be 30 characters or less")
      .regex(
        /^[a-zA-Z0-9._]+$/,
        "Username can only contain letters, numbers, dots, and underscores",
      ),
    phoneNumber: z.string().trim().min(1, "Phone number is required"),
    location: z.string().trim().min(1, "Location is required"),
  })
  .refine(
    (data) => {
      const today = new Date();
      const dob = new Date(data.dateOfBirth);
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
      path: ["dateOfBirth"],
    },
  );

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

type OnboardingDialogProps = {
  open: boolean;
  isSubmitting?: boolean;
  defaultValues?: Partial<OnboardingFormValues>;
  onSubmit: (values: OnboardingFormValues) => Promise<void> | void;
};

export default function OnboardingDialog({
  open,
  isSubmitting = false,
  defaultValues,
  onSubmit,
}: OnboardingDialogProps) {
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      username: defaultValues?.username ?? "",
      phoneNumber: defaultValues?.phoneNumber ?? "",
      location: defaultValues?.location ?? "",
      dateOfBirth: defaultValues?.dateOfBirth,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
  } = form;

  const submitting = isSubmitting || formSubmitting;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        dialogOverlayClassName="bg-background/60 backdrop-blur-md"
        className="flex max-h-2xl min-w-2xl max-w-3xl flex-col overflow-hidden p-0"
      >
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Complete your profile
          </DialogTitle>
          <DialogDescription>
            Welcome to Sparrow. Let&apos;s set up your account before you
            continue.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fullName">
                  Full name <span className="text-red-500">*</span>
                </FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    id="fullName"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    {...register("fullName")}
                  />
                  <InputGroupAddon>
                    <InputGroupText>
                      <UserRound className="h-4 w-4" />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>

                <FieldDescription>
                  This will be used for your public profile and account details.
                </FieldDescription>

                {errors.fullName?.message && (
                  <FieldError>{errors.fullName.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="dateOfBirth">
                  Date of birth <span className="text-red-500">*</span>
                </FieldLabel>

                <Controller
                  control={control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="dateOfBirth"
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select your date of birth</span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />

                <FieldDescription>
                  You must be at least 13 years old to use Sparrow.
                </FieldDescription>

                {errors.dateOfBirth?.message && (
                  <FieldError>{errors.dateOfBirth.message}</FieldError>
                )}
              </Field>

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

              <Field>
                <FieldLabel htmlFor="phoneNumber">
                  Phone number <span className="text-red-500">*</span>
                </FieldLabel>

                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <PhoneInput
                      defaultCountry="AU"
                      international
                      placeholder="Enter phone number"
                      value={field.value}
                      onChange={(value) => field.onChange(value ?? "")}
                    />
                  )}
                />

                <FieldDescription>
                  Include your mobile number for account-related updates.
                </FieldDescription>

                {errors.phoneNumber?.message && (
                  <FieldError>{errors.phoneNumber.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="location">
                  Country <span className="text-red-500">*</span>
                </FieldLabel>

                <Controller
                  control={control}
                  name="location"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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

          <Separator />

          <div className="shrink-0 px-6 py-4">
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
