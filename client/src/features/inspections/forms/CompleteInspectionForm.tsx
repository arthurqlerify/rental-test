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
import { CompleteInspectionRequest, completeInspectionRequestSchema, Inspection } from "@/lib/validators";
import { useCompleteInspection } from "@/api/inspections";
import { DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface CompleteInspectionFormProps {
  onSuccess: (inspection: Inspection) => void;
  initialData: Partial<CompleteInspectionRequest>;
}

export function CompleteInspectionForm({ onSuccess, initialData }: CompleteInspectionFormProps) {
  const form = useForm<CompleteInspectionRequest>({
    resolver: zodResolver(completeInspectionRequestSchema),
    defaultValues: {
      id: initialData?.id || "",
      turnoverId: initialData?.turnoverId || "",
      apartmentId: initialData?.apartmentId || "",
      completedAt: initialData?.completedAt || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      findingsSummary: initialData?.findingsSummary || "",
      hasDamages: initialData?.hasDamages || "false",
      photosUrl: initialData?.photosUrl || "",
      nextActorEmail: initialData?.nextActorEmail || "",
    },
  });

  const { mutate: completeInspection, isPending } = useCompleteInspection();

  const onSubmit = (values: CompleteInspectionRequest) => {
    completeInspection(values, {
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
              <FormLabel>Inspection ID</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
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
          name="completedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Completed At</FormLabel>
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
          name="findingsSummary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Findings Summary</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hasDamages"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Has Damages</FormLabel>
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
          name="photosUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photos URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
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
            {isPending ? "Completing..." : "Complete Inspection"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}