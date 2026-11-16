import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, signup } from "../lib/apiCalls";
import type { CreateUserInput } from "@cdiscam/shared";
import { ME_KEY } from "./useAuth";

export default function useSignup() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateUserInput) => {
			await signup(data);
			return login({ email: data.email, password: data.password });
		},
		onSuccess: (user) => queryClient.setQueryData(ME_KEY, user),
	});
}
