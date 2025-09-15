import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllLeases } from "@/api/leases";
import { Lease } from "@/lib/validators";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScheduleLeaseEndForm } from "./forms/ScheduleLeaseEndForm";
import { MarkLeaseEndedForm } from "./forms/MarkLeaseEndedForm";

export function LeaseList() {
  const { data: leases, isLoading, isError } = useGetAllLeases();
  const [isScheduleLeaseEndFormOpen, setIsScheduleLeaseEndFormOpen] = useState(false);
  const [isMarkLeaseEndedFormOpen, setIsMarkLeaseEndedFormOpen] = useState(false);
  const [selectedLease, setSelectedLease] = useState<Partial<Lease> | null>(null);

  const columns = [
    { accessorKey: "id", header: "Lease ID" },
    { accessorKey: "apartmentId", header: "Apartment ID" },
    { accessorKey: "propertyId", header: "Property ID" },
    { accessorKey: "tenantName", header: "Tenant Name" },
    { accessorKey: "currentRent", header: "Rent" },
    { accessorKey: "endDate", header: "End Date" },
    { accessorKey: "noticeDate", header: "Notice Date" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: Lease) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedLease(row);
              setIsScheduleLeaseEndFormOpen(true);
            }}
          >
            Schedule End
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedLease(row);
              setIsMarkLeaseEndedFormOpen(true);
            }}
            disabled={!!row.moveOutConfirmedAt} // Disable if already marked ended
          >
            Mark Ended
          </Button>
        </div>
      ),
    },
  ];

  const handleFormSuccess = () => {
    setIsScheduleLeaseEndFormOpen(false);
    setIsMarkLeaseEndedFormOpen(false);
    setSelectedLease(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lease Management"
        description="Manage lease agreements, schedule end dates, and mark leases as ended."
        actions={
          <Dialog open={isScheduleLeaseEndFormOpen} onOpenChange={setIsScheduleLeaseEndFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8" onClick={() => setSelectedLease(null)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Schedule Lease End
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule Lease End</DialogTitle>
              </DialogHeader>
              <ScheduleLeaseEndForm onSuccess={handleFormSuccess} initialData={selectedLease || {}} />
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable columns={columns} data={leases} isLoading={isLoading} isError={isError} />

      <Dialog open={isMarkLeaseEndedFormOpen} onOpenChange={setIsMarkLeaseEndedFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Mark Lease Ended</DialogTitle>
          </DialogHeader>
          {selectedLease && (
            <MarkLeaseEndedForm onSuccess={handleFormSuccess} initialData={selectedLease} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}