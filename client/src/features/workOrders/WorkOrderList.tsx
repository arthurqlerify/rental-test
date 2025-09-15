import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllWorkOrders } from "@/api/workOrders";
import { WorkOrder } from "@/lib/validators";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateWorkOrderForm } from "./forms/CreateWorkOrderForm";
import { ScheduleWorkOrderForm } from "./forms/ScheduleWorkOrderForm";
import { CompleteWorkOrderForm } from "./forms/CompleteWorkOrderForm";

export function WorkOrderList() {
  const { data: workOrders, isLoading, isError } = useGetAllWorkOrders();
  const [isCreateWorkOrderFormOpen, setIsCreateWorkOrderFormOpen] = useState(false);
  const [isScheduleWorkOrderFormOpen, setIsScheduleWorkOrderFormOpen] = useState(false);
  const [isCompleteWorkOrderFormOpen, setIsCompleteWorkOrderFormOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<Partial<WorkOrder> | null>(null);

  const columns = [
    { accessorKey: "id", header: "Work Order ID" },
    { accessorKey: "renovationCaseId", header: "Renovation Case ID" },
    { accessorKey: "apartmentId", header: "Apartment ID" },
    { accessorKey: "scopeSummary", header: "Scope" },
    { accessorKey: "crewName", header: "Crew" },
    { accessorKey: "assignedToEmail", header: "Assigned To" },
    { accessorKey: "startDate", header: "Planned Start" },
    { accessorKey: "endDate", header: "Planned End" },
    { accessorKey: "actualStartDate", header: "Actual Start" },
    { accessorKey: "actualEndDate", header: "Actual End" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: WorkOrder) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedWorkOrder(row);
              setIsScheduleWorkOrderFormOpen(true);
            }}
            disabled={!!row.startDate} // Disable if already scheduled
          >
            Schedule
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedWorkOrder(row);
              setIsCompleteWorkOrderFormOpen(true);
            }}
            disabled={!!row.actualEndDate} // Disable if already completed
          >
            Complete
          </Button>
        </div>
      ),
    },
  ];

  const handleFormSuccess = () => {
    setIsCreateWorkOrderFormOpen(false);
    setIsScheduleWorkOrderFormOpen(false);
    setIsCompleteWorkOrderFormOpen(false);
    setSelectedWorkOrder(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Order Management"
        description="Manage work orders for property maintenance and renovations."
        actions={
          <Dialog open={isCreateWorkOrderFormOpen} onOpenChange={setIsCreateWorkOrderFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8" onClick={() => setSelectedWorkOrder(null)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Work Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Work Order</DialogTitle>
              </DialogHeader>
              <CreateWorkOrderForm onSuccess={handleFormSuccess} initialData={selectedWorkOrder || {}} />
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable columns={columns} data={workOrders} isLoading={isLoading} isError={isError} />

      <Dialog open={isScheduleWorkOrderFormOpen} onOpenChange={setIsScheduleWorkOrderFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Work Order</DialogTitle>
          </DialogHeader>
          {selectedWorkOrder && (
            <ScheduleWorkOrderForm onSuccess={handleFormSuccess} initialData={selectedWorkOrder} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleteWorkOrderFormOpen} onOpenChange={setIsCompleteWorkOrderFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Work Order</DialogTitle>
          </DialogHeader>
          {selectedWorkOrder && (
            <CompleteWorkOrderForm onSuccess={handleFormSuccess} initialData={selectedWorkOrder} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}