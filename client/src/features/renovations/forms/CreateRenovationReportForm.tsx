import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateRenovationReportRequest, createRenovationReportRequestSchema, RenovationReport } from "@/lib/validators";
import { useCreateRenovationReport } from "@/api/renovations";
import { DialogFooter } from "@/components/ui/dialog";

interface CreateRenovationReportFormProps {
  onSuccess: (report: RenovationReport) => void;
  initialData?: Partial<CreateRenovationReportRequest>;
}

export function CreateRenovationReportForm({ onSuccess, initialData }: CreateRenovationReportFormProps) {
  const form = useForm<CreateRenovationReportRequest>({
    resolver: zodResolver(createRenovationReportRequestSchema),
    defaultValues: {
      turnoverId: initialData?.turnoverId || "",
      inspectionId: initialData?.inspectionId || "",
      apartmentId: initialData?.apartmentId || "",
      damageSeverity: initialData?.damageSeverity || "medium",
      estimatedRepairCost: initialData?.estimatedRepairCost || "",
      damageSummary: initialData?.damageSummary || "",
      nextActorEmail: initialData?.nextActorEmail || "",
    },
  });

  const { mutate: createRenovationReport, isPending } = useCreateRenovationReport();

  const onSubmit = (values: CreateRenovationReportRequest) => {
    createRenovationReport(values, {
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
          name="inspectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inspection ID</FormLabel>
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
          name="damageSeverity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Damage Severity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estimatedRepairCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Repair Cost</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="damageSummary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Damage Summary</FormLabel>
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
            {isPending ? "Creating..." : "Create Renovation Report"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}