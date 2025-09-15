import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { WorkOrder, CreateWorkOrderRequest, ScheduleWorkOrderRequest, CompleteWorkOrderRequest } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

const WORK_ORDERS_QUERY_KEY = "workOrders";

export const useGetAllWorkOrders = () => {
  return useQuery<WorkOrder[], string>({
    queryKey: [WORK_ORDERS_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await api.get<WorkOrder[]>("/get-all-work-orders");
      if (error) throw new Error(error);
      return data;
    },
  });
};

export const useCreateWorkOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<WorkOrder, string, CreateWorkOrderRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<WorkOrder>("/create-work-order", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORK_ORDERS_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Work order created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating work order",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const useScheduleWorkOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<WorkOrder, string, ScheduleWorkOrderRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<WorkOrder>("/schedule-work-order", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORK_ORDERS_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Work order scheduled successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error scheduling work order",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const useCompleteWorkOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<WorkOrder, string, CompleteWorkOrderRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<WorkOrder>("/complete-work-order", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORK_ORDERS_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Work order completed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error completing work order",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};