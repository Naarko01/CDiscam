import type { InferResponseType } from "hono/client";
import { api } from "./api";
import { createUserSchema as createUserBody, type CreateUserInput } from "@cdiscam/shared";

export class HttpError extends Error {
	constructor(public status: number) {
		super(`HTTP ${status}`);
	}
}

export type User = InferResponseType<typeof api.auth.me.$get, 200>;
export type UserCreated = InferResponseType<typeof api.users.$post, 201>;

export async function fetchMe(): Promise<User | null> {
	const res = await api.auth.me.$get();
	if (res.status === 401) return null;
	if (!res.ok) throw new HttpError(res.status);
	return res.json();
}

export async function login(data: { email: string; password: string }): Promise<User> {
	const res = await api.auth.login.$post({ json: data });
	if (!res.ok) throw new HttpError(res.status);
	return res.json();
}

export async function logout(): Promise<void> {
	const res = await api.auth.logout.$post();
	if (!res.ok) throw new HttpError(res.status);
}

export async function signup(data: CreateUserInput): Promise<UserCreated> {
	const res = await api.users.$post({ json: data });
	if (!res.ok) throw new HttpError(res.status);
	return res.json();
}
