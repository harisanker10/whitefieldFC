import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function DatePicker({
  value,
  onChange,
}: {
  value: Date;
  onChange: (date: Date) => void;
}) {
  const setSpecificDate = (daysOffset: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysOffset);
    onChange(newDate);
  };

  return (
    <>
      <Calendar
        mode="single"
        selected={value || new Date()}
        onSelect={(date) => {
          date && onChange(date);
        }}
        showOutsideDays={false}
        today={new Date()}
        initialFocus
      />
      <div className="flex flex-col p-2 space-y-2 w-36">
        <Button
          variant="ghost"
          onClick={() => setSpecificDate(-1)}
          className={cn(
            "justify-start",
            value &&
              new Date(value).toDateString() ===
                new Date(
                  new Date().setDate(new Date().getDate() - 1),
                ).toDateString() &&
              "rounded border border-gray-400",
          )}
        >
          Yesterday
        </Button>
        <Button
          variant="ghost"
          onClick={() => setSpecificDate(0)}
          className={cn(
            "justify-start",
            value &&
              new Date(value).toDateString() === new Date().toDateString() &&
              "rounded border border-gray-400",
          )}
        >
          Today
        </Button>
        <Button
          variant="ghost"
          onClick={() => setSpecificDate(1)}
          className={cn(
            "justify-start",
            value &&
              new Date(value).toDateString() ===
                new Date(
                  new Date().setDate(new Date().getDate() + 1),
                ).toDateString() &&
              "rounded border border-gray-400",
          )}
        >
          Tomorrow
        </Button>
      </div>
    </>
  );
}

export function DatePickerButton({
  buttonClassName,
  value,
  onChange,
}: {
  buttonClassName?: string;
  value: Date;
  onChange: (date: Date) => void;
}) {
  const [datePopoverIsOpen, setDatePopoverIsOpen] = useState(false);
  return (
    <Popover
      open={datePopoverIsOpen}
      onOpenChange={(isOpen) => setDatePopoverIsOpen(isOpen)}
      modal={true}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start w-auto min-w-48  text-center font-normal",
            !value && "text-muted-foreground",
            buttonClassName,
          )}
        >
          <CalendarIcon className="mr-1 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50 bg-background border flex rounded shadow-lg">
        <DatePicker
          value={value}
          onChange={(date) => {
            setDatePopoverIsOpen(false);
            onChange(date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
