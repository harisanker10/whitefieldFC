import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  value: Date;
  onChange: (value: Date) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const totalHours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const totalMinutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  const isPM = value.getHours() >= 12;
  const formattedHour = (value.getHours() % 12 || 12).toString();
  const formattedMinute = value.getMinutes().toString().padStart(2, "0");

  const handleHourChange = (newHour: string) => {
    const date = new Date(value);
    let adjustedHour = parseInt(newHour, 10);
    if (isPM) adjustedHour += 12;
    if (adjustedHour === 24) adjustedHour = 12;
    date.setHours(adjustedHour);
    onChange(date);
  };

  const handleMinuteChange = (newMinute: string) => {
    const date = new Date(value);
    date.setMinutes(parseInt(newMinute, 10));
    onChange(date);
  };

  const handlePeriodChange = (period: "AM" | "PM") => {
    const date = new Date(value);
    let currentHour = date.getHours();

    if (period === "AM" && currentHour >= 12) {
      date.setHours(currentHour - 12);
    } else if (period === "PM" && currentHour < 12) {
      date.setHours(currentHour + 12);
    }

    onChange(date);
  };

  return (
    <div className="flex items-center gap-1">
      <Select value={formattedHour} onValueChange={handleHourChange}>
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {totalHours.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span>:</span>
      <Select value={formattedMinute} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent>
          {totalMinutes.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={isPM ? "PM" : "AM"} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="AM/PM" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
