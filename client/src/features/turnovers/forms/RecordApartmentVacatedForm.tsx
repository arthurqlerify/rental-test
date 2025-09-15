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
import { RecordApartmentVacatedRequest, recordApartmentVacatedRequestSchema, Turnover } from "@/lib/validators";
import { useRecordApartmentVacated } from "@/api/turnovers";
import { DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RecordApartmentVacatedFormProps {
  onSuccess: (turnover: Turnover) => void;
  initialData: Partial<RecordApartmentVacatedRequest>;
}

export function RecordApartmentVacatedForm({ onSuccess, initialData }: RecordApartmentVacatedFormProps) {
  const form = useForm<RecordApartmentVacatedRequest>({
    resolver: zodResolver(recordApartmentVacatedRequestSchema),
    defaultValues: {
      id: initialData?.id || "",
      apartmentId: initialData?.apartmentId || "",
      vacatedAt: initialData?.vacatedAt || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      keysReturned: initialData?.keysReturned || "false",
      notes: initialData?.notes || "",
      nextActorEmail: initialData?.nextActorEmail || "",
    },
  });

  const { mutate: recordApartmentVacated, isPending } = useRecordApartmentVacated();

  const onSubmit = (values: RecordApartmentVacatedRequest) => {
    recordApartmentVacated(values, {
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
              <FormLabel>Turnover ID</FormLabel>
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
          name="vacatedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Vacated At</FormLabel>
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
          name="keysReturned"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Keys Returned</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "true"}
                  onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
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
            {isPending ? "Recording..." : "Record Vacated"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}