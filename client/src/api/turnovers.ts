import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Turnover, CreateTurnoverRequest, RecordApartmentVacatedRequest, CompleteTurnoverRequest } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

const TURNOVERS_QUERY_KEY = "turnovers";

export const useGetAllTurnovers = () => {
  return useQuery<Turnover[], string>({
    queryKey: [TURNOVERS_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await api.get<Turnover[]>("/get-all-turnovers");
      if (error) throw new Error(error);
      return data;
    },
  });
};

export const useCreateTurnover = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Turnover, string, CreateTurnoverRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<Turnover>("/create-turnover", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TURNOVERS_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Turnover created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating turnover",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const useRecordApartmentVacated = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Turnover, string, RecordApartmentVacatedRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<Turnover>("/record-apartment-vacated", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TURNOVERS_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Apartment vacated recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error recording apartment vacated",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const useCompleteTurnover = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Turnover, string, CompleteTurnoverRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<Turnover>("/complete-turnover", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TURNOVERS_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Turnover completed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error completing turnover",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};