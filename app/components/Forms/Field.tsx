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
	value,
	checked = false,
}: {
	name: string;
	label: string;
	required?: true;
	type: "text" | "password" | "email" | "checkbox";
	placeholder?: string;
	autoFocus?: true | false;
	before?: React.ReactChild;
	after?: React.ReactChild;
	error?: string;
	value?: string;
	checked?: boolean;
}) {
	return type === "checkbox" ? (
		<div className="field-checkbox-holder">
			<input
				type="checkbox"
				className="field-checkbox"
				name={name}
				id={name}
				value={value}
				defaultChecked={checked}
			/>
			<label htmlFor={name} className="field-label">
				{label}
			</label>
		</div>
	) : (
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
					defaultValue={value}
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
