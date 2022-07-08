export default function CheckboxField({
	name,
	value,
	checked,
	label,
	onChange,
}: {
	name?: string;
	value?: string;
	checked?: boolean;
	label?: string;
	onChange?: (value: string) => void;
}) {
	return (
		<div className="field-checkbox-holder">
			<input
				type="checkbox"
				className="field-checkbox"
				name={name}
				id={name}
				value={value}
				defaultChecked={checked}
				onChange={(event) => {
					if (onChange) {
						onChange(event.target.value);
					}
				}}
			/>
			{label && (
				<label htmlFor={name} className="field-label">
					{label}
				</label>
			)}
		</div>
	);
}
