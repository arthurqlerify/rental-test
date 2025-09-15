import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllRenovationCases } from "@/api/renovations";
import { RenovationCase } from "@/lib/validators";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateRenovationReportForm } from "./forms/CreateRenovationReportForm";
import { RequestRenovationEstimateForm } from "./forms/RequestRenovationEstimateForm";
import { ProvideRenovationEstimateForm } from "./forms/ProvideRenovationEstimateForm";
import { SelectRenovationPlanForm } from "./forms/SelectRenovationPlanForm";

export function RenovationCaseList() {
  const { data: renovationCases, isLoading, isError } = useGetAllRenovationCases();
  const [isCreateReportFormOpen, setIsCreateReportFormOpen] = useState(false);
  const [isRequestEstimateFormOpen, setIsRequestEstimateFormOpen] = useState(false);
  const [isProvideEstimateFormOpen, setIsProvideEstimateFormOpen] = useState(false);
  const [isSelectPlanFormOpen, setIsSelectPlanFormOpen] = useState(false);
  const [selectedRenovationCase, setSelectedRenovationCase] = useState<Partial<RenovationCase> | null>(null);

  const columns = [
    { accessorKey: "id", header: "Case ID" },
    { accessorKey: "turnoverId", header: "Turnover ID" },
    { accessorKey: "apartmentId", header: "Apartment ID" },
    { accessorKey: "requestedLevels", header: "Requested Levels" },
    { accessorKey: "targetReadyDate", header: "Target Ready" },
    { accessorKey: "costGood", header: "Cost (Good)" },
    { accessorKey: "selectedLevel", header: "Selected Level" },
    { accessorKey: "expectedCompletionDate", header: "Expected Completion" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: RenovationCase) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedRenovationCase(row);
              setIsRequestEstimateFormOpen(true);
            }}
          >
            Request Estimate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedRenovationCase(row);
              setIsProvideEstimateFormOpen(true);
            }}
            disabled={!row.requestedLevels || !!row.costGood} // Only provide if requested and not already provided
          >
            Provide Estimate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedRenovationCase(row);
              setIsSelectPlanFormOpen(true);
            }}
            disabled={!row.costGood || !!row.selectedLevel} // Only select if estimates provided and not already selected
          >
            Select Plan
          </Button>
        </div>
      ),
    },
  ];

  const handleFormSuccess = () => {
    setIsCreateReportFormOpen(false);
    setIsRequestEstimateFormOpen(false);
    setIsProvideEstimateFormOpen(false);
    setIsSelectPlanFormOpen(false);
    setSelectedRenovationCase(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Renovation Management"
        description="Track and manage renovation cases for rental properties."
        actions={
          <Dialog open={isCreateReportFormOpen} onOpenChange={setIsCreateReportFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8" onClick={() => setSelectedRenovationCase(null)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Renovation Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Renovation Report</DialogTitle>
              </DialogHeader>
              <CreateRenovationReportForm onSuccess={handleFormSuccess} initialData={selectedRenovationCase || {}} />
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable columns={columns} data={renovationCases} isLoading={isLoading} isError={isError} />

      <Dialog open={isRequestEstimateFormOpen} onOpenChange={setIsRequestEstimateFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Renovation Estimate</DialogTitle>
          </DialogHeader>
          {selectedRenovationCase && (
            <RequestRenovationEstimateForm onSuccess={handleFormSuccess} initialData={selectedRenovationCase} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isProvideEstimateFormOpen} onOpenChange={setIsProvideEstimateFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Provide Renovation Estimate</DialogTitle>
          </DialogHeader>
          {selectedRenovationCase && (
            <ProvideRenovationEstimateForm onSuccess={handleFormSuccess} initialData={selectedRenovationCase} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isSelectPlanFormOpen} onOpenChange={setIsSelectPlanFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Renovation Plan</DialogTitle>
          </DialogHeader>
          {selectedRenovationCase && (
            <SelectRenovationPlanForm onSuccess={handleFormSuccess} initialData={selectedRenovationCase} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}