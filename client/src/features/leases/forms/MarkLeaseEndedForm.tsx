import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MarkLeaseEndedRequest, markLeaseEndedRequestSchema, Lease } from "@/lib/validators";
import { useMarkLeaseEnded } from "@/api/leases";
import { DialogFooter } from "@/components/ui/dialog";

interface MarkLeaseEndedFormProps {
  onSuccess: (lease: Lease) => void;
  initialData: Partial<MarkLeaseEndedRequest>;
}

export function MarkLeaseEndedForm({ onSuccess, initialData }: MarkLeaseEndedFormProps) {
  const form = useForm<MarkLeaseEndedRequest>({
    resolver: zodResolver(markLeaseEndedRequestSchema),
    defaultValues: {
      id: initialData?.id || "",
      apartmentId: initialData?.apartmentId || "",
      endDate: initialData?.endDate || "",
      moveOutConfirmedAt: initialData?.moveOutConfirmedAt || format(new Date(), "yyyy-MM-dd'T'HH:mm"), // Default to now
      turnoverId: initialData?.turnoverId || "",
      nextActorEmail: initialData?.nextActorEmail || "",
    },
  });

  const { mutate: markLeaseEnded, isPending } = useMarkLeaseEnded();

  const onSubmit = (values: MarkLeaseEndedRequest) => {
    markLeaseEnded(values, {
      onSuccess: (data) => {
        onSuccess(data);
        form.reset();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lease ID</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apartmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apartment ID</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="moveOutConfirmedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Move Out Confirmed At</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(new Date(field.value), "PPP HH:mm") : "Pick a date and time"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const existingDateTime = field.value ? new Date(field.value) : new Date();
                        existingDateTime.setFullYear(date.getFullYear());
                        existingDateTime.setMonth(date.getMonth());
                        existingDateTime.setDate(date.getDate());
                        field.onChange(format(existingDateTime, "yyyy-MM-dd'T'HH:mm"));
                      } else {
                        field.onChange("");
                      }
                    }}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Input
                      type="time"
                      value={field.value ? format(new Date(field.value), "HH:mm") : ""}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(":");
                        const existingDateTime = field.value ? new Date(field.value) : new Date();
                        existingDateTime.setHours(parseInt(hours));
                        existingDateTime.setMinutes(parseInt(minutes));
                        field.onChange(format(existingDateTime, "yyyy-MM-dd'T'HH:mm"));
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="turnoverId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turnover ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nextActorEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Next Actor Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Marking..." : "Mark Lease Ended"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}