import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

// This component is now a "controlled component". It receives its state and state-updating functions via props.
const BookingWidget = ({
  onDateChange,
  onGuestsChange,
  initialDateRange,
  initialGuestCount,
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold text-center mb-4">
        Select Dates & Guests
      </h2>
      <div className="grid gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !initialDateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {initialDateRange.from ? (
                initialDateRange.to ? (
                  <>
                    {format(initialDateRange.from, "LLL dd, y")} -{" "}
                    {format(initialDateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(initialDateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick check-in & check-out dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={initialDateRange}
              onSelect={onDateChange} // Use the function from props
              numberOfMonths={2}
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>

        <div>
          <Label htmlFor="guests">Number of guests</Label>
          <Input
            id="guests"
            type="number"
            value={initialGuestCount}
            onChange={(e) => onGuestsChange(Number(e.target.value))} // Use the function from props
            min="1"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">
        Select your dates and guest count, then choose a room to reserve.
      </p>
    </div>
  );
};

export default BookingWidget;
