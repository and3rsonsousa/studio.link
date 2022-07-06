const Button: React.FC<{
	type?: "button" | "submit" | "reset";
	name?: string;
	value?: string;
	form?: string;
	primary?: true;
	ghost?: true;
	small?: true;
	large?: true;
	onClick?: () => void;
}> = ({
	children,
	type,
	name,
	value,
	form,
	primary,
	ghost,
	small,
	large,
	onClick,
}) => {
	return (
		<button
			className={`button whitespace-nowrap${
				primary ? " button-primary" : ""
			}${ghost ? " button-ghost" : ""}${small ? " button-small" : ""}${
				large ? " button-large" : ""
			}`}
			name={name}
			value={value}
			form={form}
			type={type}
			onClick={onClick}
		>
			{/* <Panel useWidth={true} duration={0.6}> */}
			{children}
			{/* </Panel> */}
		</button>
	);
};

export default Button;
