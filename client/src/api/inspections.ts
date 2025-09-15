import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Inspection, ScheduleInspectionRequest, CompleteInspectionRequest, PassFinalInspectionRequest } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

const INSPECTIONS_QUERY_KEY = "inspections";

export const useGetAllInspections = () => {
  return useQuery<Inspection[], string>({
    queryKey: [INSPECTIONS_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await api.get<Inspection[]>("/get-all-inspections");
      if (error) throw new Error(error);
      return data;
    },
  });
};

export const useGetInspectionByID = (id: string | undefined) => {
  return useQuery<Inspection, string>({
    queryKey: [INSPECTIONS_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) throw new Error("Inspection ID is required");
      const { data, error } = await api.get<Inspection>(`/get-inspection-by-id/${id}`);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
};

export const useScheduleInspection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Inspection, string, ScheduleInspectionRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<Inspection>("/schedule-inspection", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INSPECTIONS_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Inspection scheduled successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error scheduling inspection",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const useCompleteInspection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Inspection, string, CompleteInspectionRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<Inspection>("/complete-inspection", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INSPECTIONS_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Inspection completed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error completing inspection",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const usePassFinalInspection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Inspection, string, PassFinalInspectionRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<Inspection>("/pass-final-inspection", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INSPECTIONS_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Final inspection passed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error passing final inspection",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};