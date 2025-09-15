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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SelectRenovationPlanRequest, selectRenovationPlanRequestSchema, RenovationCase } from "@/lib/validators";
import { useSelectRenovationPlan } from "@/api/renovations";
import { DialogFooter } from "@/components/ui/dialog";

interface SelectRenovationPlanFormProps {
  onSuccess: (renovationCase: RenovationCase) => void;
  initialData: Partial<SelectRenovationPlanRequest>;
}

export function SelectRenovationPlanForm({ onSuccess, initialData }: SelectRenovationPlanFormProps) {
  const form = useForm<SelectRenovationPlanRequest>({
    resolver: zodResolver(selectRenovationPlanRequestSchema),
    defaultValues: {
      id: initialData?.id || "",
      apartmentId: initialData?.apartmentId || "",
      selectedLevel: initialData?.selectedLevel || undefined,
      budgetApproved: initialData?.budgetApproved || "false",
      expectedCompletionDate: initialData?.expectedCompletionDate || "",
      projectedRent: initialData?.projectedRent || "",
      decisionReason: initialData?.decisionReason || "",
      nextActorEmail: initialData?.nextActorEmail || "",
    },
  });

  const { mutate: selectRenovationPlan, isPending } = useSelectRenovationPlan();

  const onSubmit = (values: SelectRenovationPlanRequest) => {
    selectRenovationPlan(values, {
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
              <FormLabel>Renovation Case ID</FormLabel>
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
          name="selectedLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selected Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select renovation level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="better">Better</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budgetApproved"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Budget Approved</FormLabel>
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
          name="expectedCompletionDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expected Completion Date</FormLabel>
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
          name="projectedRent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projected Rent</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="decisionReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Decision Reason</FormLabel>
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
            {isPending ? "Selecting..." : "Select Renovation Plan"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}