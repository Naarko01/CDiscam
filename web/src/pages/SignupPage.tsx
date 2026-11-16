import { availableCountries, type Country } from "@cdiscam/shared";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";

export default function SignupPage() {
	const { mutate, isPending } = useSignup();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [firstname, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [age, setAge] = useState<number | null>(null);
	const [label, setLabel] = useState("");
	const [street, setStreet] = useState("");
	const [postalCode, setPostalCode] = useState("");
	const [country, setCountry] = useState<Country | null>(null);
	const navigate = useNavigate();

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
	};
	return (
		<main>
			<section>
				<h1>Signup</h1>
				<form action=''>
					<article className='flex flex-col justify-center items-center gap-7 mb-7'>
						<h2>Informations</h2>
						<div className='flex flex-col'>
							<label htmlFor='email'>Email</label>
							<input type='email' id='email' className='border' />
							<label htmlFor='password'>Password</label>
							<input type='password' id='password' className='border' />
							<label htmlFor='firstname'>First name</label>
							<input type='text' id='firstname' className='border' />
							<label htmlFor='lastname'> Last name</label>
							<input type='text' id='lastname' className='border' />
							<label htmlFor='phone'>Phone number</label>
							<input type='tel' id='phone' className='border' />
							<label htmlFor='age'>Age</label>
							<input type='number' id='age' className='border' />
						</div>
					</article>
					<article className='flex flex-col justify-center items-center gap-7'>
						<h2>Adresse</h2>
						<div className='flex flex-col'>
							<label htmlFor='label'>Label</label>
							<input type='text' id='label' className='border' />
							<label htmlFor='street'>Street</label>
							<input type='text' id='street' className='border' />
							<label htmlFor='postalcode'>Postal Code</label>
							<input type='text' id='postalcode' className='border' />
							<label htmlFor='country'>Country</label>
							<select name='country' id='country' className='border'>
								<option value=''>--Please, choose an option--</option>
								{availableCountries.map((item: Country) => (
									<option value={item}>{item}</option>
								))}
							</select>
						</div>
						<div>
							<input type='checkbox' id='newsletter' />
							<label htmlFor='newsletter'>Check to subscribe to our newsletter</label>
						</div>
					</article>
				</form>
			</section>
		</main>
	);
}
