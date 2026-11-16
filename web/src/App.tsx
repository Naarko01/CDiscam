import { useQuery } from "@tanstack/react-query";
import { api } from "./lib/api";

export default function App() {
	const { data, isPending, isError } = useQuery({
		queryKey: ["health"],
		queryFn: async () => (await api.health.$get()).json(),
		staleTime: 0,
	});

	return (
		<main className='min-h-screen flex flex-col items-center justify-center gap-2 bg-slate-50'>
			<h1 className='text-4xl font-bold text-slate-900'>cdiscam</h1>
			<p className='text-slate-600'>
				API :{" "}
				{isPending ?
					"…"
				: isError ?
					"injoignable"
				:	data.status}
			</p>
		</main>
	);
}
