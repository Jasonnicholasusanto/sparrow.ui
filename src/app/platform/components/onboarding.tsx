"use client";

import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, AtSign, UserRound, Phone } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/phone-number-input";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

type OnboardingProps = {
  open: boolean;
  isSubmitting?: boolean;
  defaultValues?: Partial<OnboardingFormValues>;
  onSubmit: (values: OnboardingFormValues) => Promise<void> | void;
};

export default function Onboarding({
  open,
  isSubmitting = false,
  defaultValues,
  onSubmit,
}: OnboardingProps) {
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      username: defaultValues?.username ?? "",
      phoneNumber: defaultValues?.phoneNumber ?? "",
      dateOfBirth: defaultValues?.dateOfBirth,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
  } = form;

  if (!open) return null;

  const submitting = isSubmitting || formSubmitting;

  return (
    <div className="fixed inset-0 z-51 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md" />

      <div className="relative z-52 w-full max-w-lg px-4">
        <Card className="border-border/70 bg-card/95 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Complete your profile
            </CardTitle>
            <CardDescription>
              Welcome to Sparrow. Let&apos;s set up your account before you
              continue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="fullName">Full name</FieldLabel>

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
                    This will be used for your public profile and account
                    details.
                  </FieldDescription>

                  {errors.fullName?.message && (
                    <FieldError>{errors.fullName.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="dateOfBirth">Date of birth</FieldLabel>

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

                        <PopoverContent
                          className="z-55 w-auto p-0"
                          align="start"
                        >
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
                  <FieldLabel htmlFor="username">Username</FieldLabel>

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
                  <FieldLabel htmlFor="phoneNumber">Phone number</FieldLabel>

                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <div className="hidden">
                          <InputGroup>
                            <InputGroupAddon>
                              <InputGroupText>
                                <Phone className="h-4 w-4" />
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>

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

                  <FieldDescription>
                    Include your mobile number for account-related updates.
                  </FieldDescription>

                  {errors.phoneNumber?.message && (
                    <FieldError>{errors.phoneNumber.message}</FieldError>
                  )}
                </Field>
              </FieldGroup>

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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
