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
import { ScheduleInspectionRequest, scheduleInspectionRequestSchema, Inspection } from "@/lib/validators";
import { useScheduleInspection } from "@/api/inspections";
import { DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ScheduleInspectionFormProps {
  onSuccess: (inspection: Inspection) => void;
  initialData?: Partial<ScheduleInspectionRequest>;
}

export function ScheduleInspectionForm({ onSuccess, initialData }: ScheduleInspectionFormProps) {
  const form = useForm<ScheduleInspectionRequest>({
    resolver: zodResolver(scheduleInspectionRequestSchema),
    defaultValues: {
      turnoverId: initialData?.turnoverId || "",
      apartmentId: initialData?.apartmentId || "",
      scheduledAt: initialData?.scheduledAt || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      assignedToEmail: initialData?.assignedToEmail || "",
      locationNotes: initialData?.locationNotes || "",
      nextActorEmail: initialData?.nextActorEmail || "",
    },
  });

  const { mutate: scheduleInspection, isPending } = useScheduleInspection();

  const onSubmit = (values: ScheduleInspectionRequest) => {
    scheduleInspection(values, {
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
          name="apartmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apartment ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Scheduled At</FormLabel>
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
          name="assignedToEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned To Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="locationNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
            {isPending ? "Scheduling..." : "Schedule Inspection"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}