import type { User } from "../models/usersModel";

// Accepte un document hydraté comme un objet .lean() : on se base sur _id, jamais sur le virtual `id`
type WithId = { _id: { toString(): string } };
type UserLike = Pick<User, "email" | "firstName" | "lastname" | "role"> & WithId;
type UserProfileLike = Omit<User, "passwordHash"> & WithId;

export const toPublicUser = (user: UserLike) => ({
	id: user._id.toString(),
	email: user.email,
	firstName: user.firstName,
	lastname: user.lastname,
	role: user.role,
});

// Profil complet : même base (`id`) que toPublicUser, sans jamais exposer passwordHash
export const toUserProfile = (user: UserProfileLike) => ({
	...toPublicUser(user),
	phone: user.phone,
	age: user.age,
	addresses: user.addresses,
	preferences: user.preferences,
	isActive: user.isActive,
	emailVerified: user.emailVerified,
	lastLoginAt: user.lastLoginAt,
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
});
