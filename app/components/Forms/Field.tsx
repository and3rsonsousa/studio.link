import * as Select from "@radix-ui/react-select";
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
	options,
	checked = false,
}: {
	name: string;
	label: string;
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
	before?: React.ReactChild;
	after?: React.ReactChild;
	error?: string;
	value?: string;
	options?: { id: string; text: string; value: string }[];
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
	) : type === "select" ? (
		<div className="field relative">
			<label htmlFor={name} className="field-label">
				{label}
			</label>
			<div className="field-input-holder relative">
				{before}
				<Select.Root>
					<Select.Trigger className="field-input">
						<Select.Value />
					</Select.Trigger>

					<Select.Content className="dropdown-content relative">
						{/* <Select.ScrollUpButton />
						<Select.Viewport> */}
						<Select.Item
							className="dropdown-item relative"
							value=""
						>
							<Select.ItemText>selecione</Select.ItemText>
						</Select.Item>
						<Select.Item
							className="dropdown-item relative"
							value="1"
						>
							<Select.ItemText>teste</Select.ItemText>
						</Select.Item>
						{/* </Select.Viewport>
						<Select.ScrollDownButton /> */}
					</Select.Content>
				</Select.Root>
				{/* <select name={name} id={name} className="field-input">
					{<option value="">Selecione</option>}
					{options?.map((option) => (
						<option key={option.id} value={option.value}>
							{option.text}
						</option>
					))}
				</select> */}
				{after}
			</div>
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
					id={name}
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
