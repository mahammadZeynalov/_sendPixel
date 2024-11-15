import { useQuery, useMutation } from "@tanstack/react-query";

const GET = async (endpoint) => {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const useGET = (
  key,
  endpoint,
  enabled = true,
  refetchInterval: number | false | undefined = false
) => {
  return useQuery({
    queryKey: key,
    queryFn: () => GET(endpoint),
    enabled,
    refetchInterval,
  });
};

const POST = async (endpoint, data) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

const usePOST = (endpoint, options) => {
  return useMutation({
    mutationFn: (data) => POST(endpoint, data),
    ...options, // Optional additional options such as onSuccess, onError, etc.
  });
};

const PATCH = async (endpoint, data) => {
  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const usePATCH = (endpoint, options) => {
  return useMutation({
    mutationFn: (data) => PATCH(endpoint, data),
    ...options, // Optional additional options such as onSuccess, onError, etc.
  });
};

export { useGET, usePOST, usePATCH };
