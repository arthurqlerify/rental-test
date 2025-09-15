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
import { Textarea } from "@/components/ui/textarea";
import { RequestRenovationEstimateRequest, requestRenovationEstimateRequestSchema, RenovationCase } from "@/lib/validators";
import { useRequestRenovationEstimate } from "@/api/renovations";
import { DialogFooter } from "@/components/ui/dialog";

interface RequestRenovationEstimateFormProps {
  onSuccess: (renovationCase: RenovationCase) => void;
  initialData?: Partial<RequestRenovationEstimateRequest>;
}

export function RequestRenovationEstimateForm({ onSuccess, initialData }: RequestRenovationEstimateFormProps) {
  const form = useForm<RequestRenovationEstimateRequest>({
    resolver: zodResolver(requestRenovationEstimateRequestSchema),
    defaultValues: {
      turnoverId: initialData?.turnoverId || "",
      apartmentId: initialData?.apartmentId || "",
      requestedLevels: initialData?.requestedLevels || "",
      scopeNotes: initialData?.scopeNotes || "",
      targetReadyDate: initialData?.targetReadyDate || "",
      nextActorEmail: initialData?.nextActorEmail || "",
    },
  });

  const { mutate: requestRenovationEstimate, isPending } = useRequestRenovationEstimate();

  const onSubmit = (values: RequestRenovationEstimateRequest) => {
    requestRenovationEstimate(values, {
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
          name="requestedLevels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requested Levels (e.g., good,better)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scopeNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scope Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetReadyDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Target Ready Date</FormLabel>
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
            {isPending ? "Requesting..." : "Request Estimate"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}