import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateApartmentRequest, createApartmentRequestSchema, Apartment } from "@/lib/validators";
import { useCreateApartment } from "@/api/properties"; // Use properties API for apartment creation for now
import { DialogFooter } from "@/components/ui/dialog";

interface CreateApartmentFormProps {
  onSuccess: (apartment: Apartment) => void;
  initialData?: Partial<CreateApartmentRequest>;
}

export function CreateApartmentForm({ onSuccess, initialData }: CreateApartmentFormProps) {
  const form = useForm<CreateApartmentRequest>({
    resolver: zodResolver(createApartmentRequestSchema),
    defaultValues: {
      propertyId: initialData?.propertyId || "",
      unitNumber: initialData?.unitNumber || "",
      floorAreaSqm: initialData?.floorAreaSqm || "",
      bedrooms: initialData?.bedrooms || "",
      status: initialData?.status || "Occupied", // Default status
    },
  });

  const { mutate: createApartment, isPending } = useCreateApartment();

  const onSubmit = (values: CreateApartmentRequest) => {
    createApartment(values, {
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
          name="propertyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unitNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="floorAreaSqm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Floor Area (sqm)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Occupied">Occupied</SelectItem>
                  <SelectItem value="Vacant">Vacant</SelectItem>
                  <SelectItem value="UnderRenovation">Under Renovation</SelectItem>
                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Apartment"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}