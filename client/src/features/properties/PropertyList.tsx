import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllProperties } from "@/api/properties";
import { Property } from "@/lib/validators";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreatePropertyForm } from "./forms/CreatePropertyForm";
import { CreateApartmentForm } from "./forms/CreateApartmentForm";

export function PropertyList() {
  const { data: properties, isLoading, isError } = useGetAllProperties();
  const [isCreatePropertyFormOpen, setIsCreatePropertyFormOpen] = useState(false);
  const [isCreateApartmentFormOpen, setIsCreateApartmentFormOpen] = useState(false);
  const [selectedPropertyIdForApartment, setSelectedPropertyIdForApartment] = useState<string | null>(null);

  const columns = [
    { accessorKey: "id", header: "Property ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "managerName", header: "Manager" },
    { accessorKey: "managerEmail", header: "Manager Email" },
    { accessorKey: "unitsCount", header: "Units" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: Property) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedPropertyIdForApartment(row.id);
              setIsCreateApartmentFormOpen(true);
            }}
          >
            Add Apartment
          </Button>
        </div>
      ),
    },
  ];

  const handlePropertyFormSuccess = () => {
    setIsCreatePropertyFormOpen(false);
  };

  const handleApartmentFormSuccess = () => {
    setIsCreateApartmentFormOpen(false);
    setSelectedPropertyIdForApartment(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Property Management"
        description="Manage your rental properties and associated apartments."
        actions={
          <Dialog open={isCreatePropertyFormOpen} onOpenChange={setIsCreatePropertyFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Property
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Property</DialogTitle>
              </DialogHeader>
              <CreatePropertyForm onSuccess={handlePropertyFormSuccess} />
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable columns={columns} data={properties} isLoading={isLoading} isError={isError} />

      <Dialog open={isCreateApartmentFormOpen} onOpenChange={setIsCreateApartmentFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Apartment</DialogTitle>
          </DialogHeader>
          {selectedPropertyIdForApartment && (
            <CreateApartmentForm onSuccess={handleApartmentFormSuccess} initialData={{ propertyId: selectedPropertyIdForApartment }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}