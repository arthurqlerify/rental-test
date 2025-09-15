import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllInspections } from "@/api/inspections";
import { Inspection } from "@/lib/validators";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScheduleInspectionForm } from "./forms/ScheduleInspectionForm";
import { CompleteInspectionForm } from "./forms/CompleteInspectionForm";
import { PassFinalInspectionForm } from "./forms/PassFinalInspectionForm";

export function InspectionList() {
  const { data: inspections, isLoading, isError } = useGetAllInspections();
  const [isScheduleInspectionFormOpen, setIsScheduleInspectionFormOpen] = useState(false);
  const [isCompleteInspectionFormOpen, setIsCompleteInspectionFormOpen] = useState(false);
  const [isPassFinalInspectionFormOpen, setIsPassFinalInspectionFormOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<Partial<Inspection> | null>(null);

  const columns = [
    { accessorKey: "id", header: "Inspection ID" },
    { accessorKey: "turnoverId", header: "Turnover ID" },
    { accessorKey: "apartmentId", header: "Apartment ID" },
    { accessorKey: "inspectorName", header: "Inspector" },
    { accessorKey: "scheduledAt", header: "Scheduled At" },
    { accessorKey: "completedAt", header: "Completed At" },
    { accessorKey: "hasDamages", header: "Damages" },
    { accessorKey: "passedAt", header: "Passed At" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: Inspection) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedInspection(row);
              setIsCompleteInspectionFormOpen(true);
            }}
            disabled={!!row.completedAt} // Disable if already completed
          >
            Complete
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedInspection(row);
              setIsPassFinalInspectionFormOpen(true);
            }}
            disabled={!!row.passedAt} // Disable if already passed
          >
            Pass Final
          </Button>
        </div>
      ),
    },
  ];

  const handleFormSuccess = () => {
    setIsScheduleInspectionFormOpen(false);
    setIsCompleteInspectionFormOpen(false);
    setIsPassFinalInspectionFormOpen(false);
    setSelectedInspection(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inspection Management"
        description="Schedule, complete, and pass final inspections for apartments."
        actions={
          <Dialog open={isScheduleInspectionFormOpen} onOpenChange={setIsScheduleInspectionFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8" onClick={() => setSelectedInspection(null)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Schedule Inspection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule New Inspection</DialogTitle>
              </DialogHeader>
              <ScheduleInspectionForm onSuccess={handleFormSuccess} initialData={selectedInspection || {}} />
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable columns={columns} data={inspections} isLoading={isLoading} isError={isError} />

      <Dialog open={isCompleteInspectionFormOpen} onOpenChange={setIsCompleteInspectionFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Inspection</DialogTitle>
          </DialogHeader>
          {selectedInspection && (
            <CompleteInspectionForm onSuccess={handleFormSuccess} initialData={selectedInspection} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPassFinalInspectionFormOpen} onOpenChange={setIsPassFinalInspectionFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pass Final Inspection</DialogTitle>
          </DialogHeader>
          {selectedInspection && (
            <PassFinalInspectionForm onSuccess={handleFormSuccess} initialData={selectedInspection} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}