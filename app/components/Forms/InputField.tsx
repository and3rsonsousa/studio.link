import { HiOutlineExclamationCircle } from "react-icons/hi";

type FieldType = {
	name: string;
	label?: string;
	required?: true;
	type:
		| "text"
		| "password"
		| "email"
		| "checkbox"
		| "datetime-local"
		| "select";
	placeholder?: string;
	autoFocus?: true | false;
	autoComplete?: "off";
	before?: React.ReactChild;
	after?: React.ReactChild;
	error?: string;
	value?: string;
	options?: { id: string; text: string; value: string }[];
	checked?: boolean;
};

export default function Field({
	name,
	label,
	required,
	type,
	placeholder,
	autoFocus = false,
	autoComplete,
	before,
	after,
	error,
	value,
	options,
	checked = false,
}: FieldType) {
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
			{label && (
				<label htmlFor={name} className="field-label">
					{label}
				</label>
			)}
		</div>
	) : (
		<div className="field">
			{label && (
				<label htmlFor={name} className="field-label">
					{label}
				</label>
			)}
			<div className="field-input-holder">
				{before}
				<input
					type={type}
					name={name}
					id={name}
					placeholder={placeholder}
					required={required}
					className={`field-input ${before ? "pl-2" : ""} ${
						after ? "pr-2" : ""
					}`}
					autoFocus={autoFocus}
					defaultValue={value}
					autoComplete={autoComplete}
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
