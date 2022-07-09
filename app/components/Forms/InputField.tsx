import { HiOutlineExclamationCircle } from "react-icons/hi";
import ErrorBanner from "../Layout/ErrorBanner";

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
	disabled?: boolean;
	opaque?: boolean;
	darker?: boolean;
};

export default function InputField({
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
	disabled,
	opaque = false,
	darker = false,
}: FieldType) {
	return (
		<div className="field">
			{label && (
				<label htmlFor={name} className="field-label">
					{label}
				</label>
			)}
			<div
				className={`field-input-holder${opaque ? " opaque" : ""}${
					darker ? " darker" : ""
				}${disabled ? " field-disabled" : ""}${
					error ? " field-error" : ""
				}`}
			>
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
					disabled={disabled}
				/>
				{after}
			</div>
			{error ? <ErrorBanner error={{ message: error }} /> : null}
		</div>
	);
}
