import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateWorkOrderRequest, createWorkOrderRequestSchema, WorkOrder } from "@/lib/validators";
import { useCreateWorkOrder } from "@/api/workOrders";
import { DialogFooter } from "@/components/ui/dialog";

interface CreateWorkOrderFormProps {
  onSuccess: (workOrder: WorkOrder) => void;
  initialData?: Partial<CreateWorkOrderRequest>;
}

export function CreateWorkOrderForm({ onSuccess, initialData }: CreateWorkOrderFormProps) {
  const form = useForm<CreateWorkOrderRequest>({
    resolver: zodResolver(createWorkOrderRequestSchema),
    defaultValues: {
      renovationCaseId: initialData?.renovationCaseId || "",
      turnoverId: initialData?.turnoverId || "",
      apartmentId: initialData?.apartmentId || "",
      scopeSummary: initialData?.scopeSummary || "",
      accessDetails: initialData?.accessDetails || "",
      materialsList: initialData?.materialsList || "",
      nextActorEmail: initialData?.nextActorEmail || "",
    },
  });

  const { mutate: createWorkOrder, isPending } = useCreateWorkOrder();

  const onSubmit = (values: CreateWorkOrderRequest) => {
    createWorkOrder(values, {
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
          name="renovationCaseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Renovation Case ID</FormLabel>
              <FormControl>
                <Input {...field} />
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
          name="scopeSummary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scope Summary</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accessDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Details</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="materialsList"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Materials List</FormLabel>
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
            {isPending ? "Creating..." : "Create Work Order"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}