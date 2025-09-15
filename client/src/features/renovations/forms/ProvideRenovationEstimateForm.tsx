import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProvideRenovationEstimateRequest, provideRenovationEstimateRequestSchema, RenovationCase } from "@/lib/validators";
import { useProvideRenovationEstimate } from "@/api/renovations";
import { DialogFooter } from "@/components/ui/dialog";

interface ProvideRenovationEstimateFormProps {
  onSuccess: (renovationCase: RenovationCase) => void;
  initialData: Partial<ProvideRenovationEstimateRequest>;
}

export function ProvideRenovationEstimateForm({ onSuccess, initialData }: ProvideRenovationEstimateFormProps) {
  const form = useForm<ProvideRenovationEstimateRequest>({
    resolver: zodResolver(provideRenovationEstimateRequestSchema),
    defaultValues: {
      id: initialData?.id || "",
      costGood: initialData?.costGood || "",
      costBetter: initialData?.costBetter || "",
      costPremium: initialData?.costPremium || "",
      leadDaysGood: initialData?.leadDaysGood || "",
      leadDaysBetter: initialData?.leadDaysBetter || "",
      leadDaysPremium: initialData?.leadDaysPremium || "",
      nextActorEmail: initialData?.nextActorEmail || "",
    },
  });

  const { mutate: provideRenovationEstimate, isPending } = useProvideRenovationEstimate();

  const onSubmit = (values: ProvideRenovationEstimateRequest) => {
    provideRenovationEstimate(values, {
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
          name="costGood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost (Good)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="costBetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost (Better)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="costPremium"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost (Premium)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="leadDaysGood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lead Days (Good)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="leadDaysBetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lead Days (Better)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="leadDaysPremium"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lead Days (Premium)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
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
            {isPending ? "Providing..." : "Provide Estimate"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}