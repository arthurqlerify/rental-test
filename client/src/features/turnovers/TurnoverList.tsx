import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllTurnovers } from "@/api/turnovers";
import { Turnover } from "@/lib/validators";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateTurnoverForm } from "./forms/CreateTurnoverForm";
import { RecordApartmentVacatedForm } from "./forms/RecordApartmentVacatedForm";
import { CompleteTurnoverForm } from "./forms/CompleteTurnoverForm";

export function TurnoverList() {
  const { data: turnovers, isLoading, isError } = useGetAllTurnovers();
  const [isCreateTurnoverFormOpen, setIsCreateTurnoverFormOpen] = useState(false);
  const [isRecordApartmentVacatedFormOpen, setIsRecordApartmentVacatedFormOpen] = useState(false);
  const [isCompleteTurnoverFormOpen, setIsCompleteTurnoverFormOpen] = useState(false);
  const [selectedTurnover, setSelectedTurnover] = useState<Partial<Turnover> | null>(null);

  const columns = [
    { accessorKey: "id", header: "Turnover ID" },
    { accessorKey: "leaseId", header: "Lease ID" },
    { accessorKey: "apartmentId", header: "Apartment ID" },
    { accessorKey: "propertyId", header: "Property ID" },
    { accessorKey: "targetReadyDate", header: "Target Ready Date" },
    { accessorKey: "vacatedAt", header: "Vacated At" },
    { accessorKey: "keysReturned", header: "Keys Returned" },
    { accessorKey: "readyToRentDate", header: "Ready to Rent Date" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: Turnover) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedTurnover(row);
              setIsRecordApartmentVacatedFormOpen(true);
            }}
            disabled={!!row.vacatedAt} // Disable if already vacated
          >
            Record Vacated
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedTurnover(row);
              setIsCompleteTurnoverFormOpen(true);
            }}
            disabled={!!row.readyToRentDate} // Disable if already completed
          >
            Complete Turnover
          </Button>
        </div>
      ),
    },
  ];

  const handleFormSuccess = () => {
    setIsCreateTurnoverFormOpen(false);
    setIsRecordApartmentVacatedFormOpen(false);
    setIsCompleteTurnoverFormOpen(false);
    setSelectedTurnover(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Turnover Management"
        description="Oversee the process of apartments transitioning between tenants."
        actions={
          <Dialog open={isCreateTurnoverFormOpen} onOpenChange={setIsCreateTurnoverFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8" onClick={() => setSelectedTurnover(null)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Turnover
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Turnover</DialogTitle>
              </DialogHeader>
              <CreateTurnoverForm onSuccess={handleFormSuccess} initialData={selectedTurnover || {}} />
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable columns={columns} data={turnovers} isLoading={isLoading} isError={isError} />

      <Dialog open={isRecordApartmentVacatedFormOpen} onOpenChange={setIsRecordApartmentVacatedFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Apartment Vacated</DialogTitle>
          </DialogHeader>
          {selectedTurnover && (
            <RecordApartmentVacatedForm onSuccess={handleFormSuccess} initialData={selectedTurnover} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleteTurnoverFormOpen} onOpenChange={setIsCompleteTurnoverFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Turnover</DialogTitle>
          </DialogHeader>
          {selectedTurnover && (
            <CompleteTurnoverForm onSuccess={handleFormSuccess} initialData={selectedTurnover} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}