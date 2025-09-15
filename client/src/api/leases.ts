import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Lease, ScheduleLeaseEndRequest, MarkLeaseEndedRequest, errorSchema } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

const LEASES_QUERY_KEY = "leases";

export const useGetAllLeases = () => {
  return useQuery<Lease[], string>({
    queryKey: [LEASES_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await api.get<Lease[]>("/get-all-leases");
      if (error) throw new Error(error);
      return data;
    },
  });
};

export const useGetLeaseByID = (id: string | undefined) => {
  return useQuery<Lease, string>({
    queryKey: [LEASES_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) throw new Error("Lease ID is required");
      const { data, error } = await api.get<Lease>(`/get-lease-by-id/${id}`);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
};

export const useScheduleLeaseEnd = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Lease, string, ScheduleLeaseEndRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<Lease>("/schedule-lease-end", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEASES_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Lease end scheduled successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error scheduling lease end",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const useMarkLeaseEnded = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Lease, string, MarkLeaseEndedRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<Lease>("/mark-lease-ended", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEASES_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Lease marked as ended successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error marking lease ended",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};