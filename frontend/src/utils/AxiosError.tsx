import { AxiosError } from "axios";

export const handleAxiosError = (error: unknown): string => {
    if (error instanceof AxiosError && error.response) {
        return error.response.data?.message || "An error occurred.";
    }
    return "An unexpected error occurred.";
};

