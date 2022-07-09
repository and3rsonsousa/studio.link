import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ErrorBanner({ error }: { error: { message: string } }) {
	return (
		<div className="mt-2 flex items-center space-x-1 text-sm font-semibold tracking-wide text-red-700">
			<HiOutlineExclamationCircle className="text-xl" />
			<div>{error.message}</div>
		</div>
	);
}
