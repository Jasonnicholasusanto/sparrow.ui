"use client";

import * as React from "react";
import { useFormikContext } from "formik";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  return !!date && !isNaN(date.getTime());
}

export function BirthDate({
  name,
  label = "Date of birth",
}: {
  name: string;
  label?: string;
}) {
  const formik = useFormikContext<any>();
  const fieldValue = formik?.values?.[name];
  const [open, setOpen] = React.useState(false);

  const date =
    fieldValue instanceof Date
      ? fieldValue
      : fieldValue
      ? new Date(fieldValue)
      : undefined;
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  const handleChange = (date: Date | undefined) => {
    setValue(formatDate(date));
    if (formik) {
      formik.setFieldValue(name, date ? date.toISOString() : "");
      formik.setFieldTouched(name, true, false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={name} className="px-1">
        {label}
      </Label>
      <div className="relative flex gap-2">
        <Input
          id={name}
          value={value}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          onChange={(e) => {
            const manualDate = new Date(e.target.value);
            setValue(e.target.value);
            if (isValidDate(manualDate)) {
              handleChange(manualDate);
              setMonth(manualDate);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={`${name}-picker`}
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(selectedDate) => {
                handleChange(selectedDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
