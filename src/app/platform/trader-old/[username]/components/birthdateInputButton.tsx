"use client";

import * as React from "react";
import { useFormikContext } from "formik";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LuCalendar } from "react-icons/lu";

interface BirthDateInputProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  placeholder?: string;
}

export const BirthDateInput = React.forwardRef<
  HTMLDivElement,
  BirthDateInputProps
>(({ name, placeholder = "Select date" }, ref) => {
  const formik = useFormikContext<any>();
  const fieldValue = formik?.values?.[name];

  // Convert stored string "YYYY-MM-DD" back into a Date for UI display
  const date =
    fieldValue && typeof fieldValue === "string"
      ? new Date(fieldValue + "T00:00:00")
      : undefined;

  const [open, setOpen] = React.useState(false);

  const handleSelect = (newDate: Date | undefined) => {
    if (!newDate) return;

    // ⬇ Convert Date → timezone-free "YYYY-MM-DD"
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");

    const formatted = `${year}-${month}-${day}`;

    formik.setFieldValue(name, formatted);
    formik.setFieldTouched(name, true, false);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={name}
            className="justify-between"
            type="button"
          >
            {fieldValue ? (
              new Date(fieldValue + "T00:00:00").toLocaleDateString("en-AU")
            ) : (
              <p className="text-muted-foreground">{placeholder}</p>
            )}
            <LuCalendar />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={date}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});

BirthDateInput.displayName = "BirthDateInput";
