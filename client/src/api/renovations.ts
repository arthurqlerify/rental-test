import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RenovationCase, RenovationReport, CreateRenovationReportRequest, RequestRenovationEstimateRequest, ProvideRenovationEstimateRequest, SelectRenovationPlanRequest } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

const RENOVATION_CASES_QUERY_KEY = "renovationCases";

export const useGetAllRenovationCases = () => {
  return useQuery<RenovationCase[], string>({
    queryKey: [RENOVATION_CASES_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await api.get<RenovationCase[]>("/get-all-renovation-cases");
      if (error) throw new Error(error);
      return data;
    },
  });
};

export const useCreateRenovationReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<RenovationReport, string, CreateRenovationReportRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<RenovationReport>("/create-renovation-report", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RENOVATION_CASES_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Renovation report created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating renovation report",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const useRequestRenovationEstimate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<RenovationCase, string, RequestRenovationEstimateRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<RenovationCase>("/request-renovation-estimate", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RENOVATION_CASES_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Renovation estimate requested successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error requesting renovation estimate",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const useProvideRenovationEstimate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<RenovationCase, string, ProvideRenovationEstimateRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<RenovationCase>("/provide-renovation-estimate", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RENOVATION_CASES_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Renovation estimate provided successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error providing renovation estimate",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const useSelectRenovationPlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<RenovationCase, string, SelectRenovationPlanRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<RenovationCase>("/select-renovation-plan", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RENOVATION_CASES_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Renovation plan selected successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error selecting renovation plan",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};