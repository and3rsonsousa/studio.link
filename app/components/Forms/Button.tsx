import Panel from "../Layout/Panel";

const Button: React.FC<{
	type?: "button" | "submit" | "reset";
	name?: string;
	value?: string;
	form?: string;
	primary?: true;
	ghost?: true;
	onClick?: () => void;
}> = ({ children, type, name, value, form, primary, ghost, onClick }) => {
	return (
		<button
			className={`button ${primary && "button-primary"} ${
				ghost && "button-ghost"
			} whitespace-nowrap`}
			name={name}
			value={value}
			form={form}
			type={type}
			onClick={onClick}
		>
			<Panel useWidth={true} duration={0.6}>
				{children}
			</Panel>
		</button>
	);
};

export default Button;
