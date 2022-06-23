import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function Field({
	name,
	label,
	required,
	type,
	placeholder,
	autoFocus = false,
	before,
	after,
	error,
}: {
	name: string;
	label: string;
	required?: true;
	type: "text" | "password" | "email";
	placeholder?: string;
	autoFocus?: true | false;
	before?: React.ReactChild;
	after?: React.ReactChild;
	error?: string;
}) {
	return (
		<div className="field">
			<label htmlFor={name} className="field-label">
				{label}
			</label>
			<div className="field-input-holder">
				{before}
				<input
					type={type}
					name={name}
					placeholder={placeholder}
					required={required}
					className={`field-input ${before ? "pl-2" : ""} ${
						after ? "pr-2" : ""
					}`}
					autoFocus={autoFocus}
				/>
				{after}
			</div>
			{error ? (
				<div className="mt-2 flex items-center space-x-1 text-sm font-semibold tracking-wide text-red-700">
					<HiOutlineExclamationCircle className="text-xl" />
					<div>{error}</div>
				</div>
			) : null}
		</div>
	);
}
