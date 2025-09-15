import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Property, CreatePropertyRequest, Apartment, CreateApartmentRequest } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

const PROPERTIES_QUERY_KEY = "properties";

export const useGetAllProperties = () => {
  return useQuery<Property[], string>({
    queryKey: [PROPERTIES_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await api.get<Property[]>("/get-all-propertys"); // Typo in OpenAPI: Propertys
      if (error) throw new Error(error);
      return data;
    },
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Property, string, CreatePropertyRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<Property>("/create-property", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_QUERY_KEY] });
      toast({
        title: "Success!",
        description: "Property created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating property",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const useCreateApartment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Apartment, string, CreateApartmentRequest>({
    mutationFn: async (requestData) => {
      const { data, error } = await api.post<Apartment>("/create-apartment", requestData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_QUERY_KEY] }); // Invalidate properties to reflect new apartment count, or create an "apartments" query key.
      toast({
        title: "Success!",
        description: "Apartment created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating apartment",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};