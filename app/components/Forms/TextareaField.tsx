const TextareaField = ({
	name,
	label,
	before,
	after,
	error,
	value,
	rows = 5,
}: {
	name: string;
	label?: string;
	before?: React.ReactChild;
	after?: React.ReactChild;
	error?: string;
	value?: string;
	rows?: number;
}) => {
	return (
		<div className="field">
			{label && (
				<label htmlFor={name} className="field-label">
					{label}
				</label>
			)}
			<div className="field-input-holder">
				{before}
				<textarea
					className="field-input"
					rows={rows}
					name={name}
					id={name}
					defaultValue={value}
				/>
				{after}
			</div>
		</div>
	);
};

export default TextareaField;
