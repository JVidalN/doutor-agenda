"use client";

import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [from, setFrom] = useQueryState(
    "from",
    parseAsIsoDate.withDefault(dayjs().toDate()),
  );
  const [to, setTo] = useQueryState(
    "to",
    parseAsIsoDate.withDefault(dayjs(new Date()).add(1, "month").toDate()),
  );
  const handleDateSelect = (dateRange: DateRange | undefined) => {
    if (dateRange?.from) {
      setFrom(dateRange.from, { shallow: false });
    }
    if (dateRange?.to) {
      setTo(dateRange.to, { shallow: false });
    }
  };
  const date = {
    from,
    to,
  };
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <div>
                  {dayjs(date.from).format("MMM DD, YYYY")} -{" "}
                  {dayjs(date.to).format("MMM DD, YYYY")}
                </div>
              ) : (
                dayjs(date.from).format("MMM DD, YYYY")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" asChild>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
