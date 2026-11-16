import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";

export default function LoginPage() {
	const { mutate, isPending } = useLogin();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (email === "" || password === "") {
			setError("Vérifiez que tous les champs sont remplis");
			return;
		}
		mutate(
			{ email, password },
			{
				onSuccess: () => navigate("/", { replace: true }),
				onError: () => setError("Identifiants invalides"),
			},
		);
	};

	const updateField = (event: ChangeEvent<HTMLInputElement>) => {
		event.currentTarget.id === "usermail" ?
			setEmail(event.currentTarget.value)
		:	setPassword(event.currentTarget.value);
		setError(null);
	};

	return (
		<main>
			<section className='flex flex-col justify-center items-center gap-2 text-center m-10'>
				<h1>Login</h1>
				<form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-2 w-1/2'>
					<div className='w-1/3 justify-self-center'>
						<label htmlFor='usermail'></label>
						<input onChange={updateField} type='email' id='usermail' className='border-2' />
					</div>
					<div className='w-1/3 justify-self-center'>
						<label htmlFor='password'></label>
						<input onChange={updateField} type='password' id='password' className='border-2' />
					</div>
					<div>
						<label htmlFor='remember-me'>Remember me</label>
						<input type='checkbox' id='remember-me' />
					</div>
					{error && <p role='alert'>{error}</p>}
					<button type='submit' disabled={isPending} className='border-2 px-2'>
						Se connecter
					</button>
				</form>
			</section>
		</main>
	);
}
