import { Combobox } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useState } from "react";
import { scaleUp } from "~/utils/transitions";

type Option = { id: string; text: string; value: string };

export default function ComboboxField({
	options,
	label,
	name,
	placeholder,
	required,
	opaque,
	callBack,
	value,
	autoComplete = true,
}: {
	options: Array<Option>;
	label?: string;
	name?: string;
	placeholder?: string;
	required?: boolean;
	opaque?: boolean;
	callBack?: (value: string) => void;
	value?: string;
	autoComplete?: boolean;
}) {
	const [selectedOption, setSelected] = useState<Option | undefined>(
		value ? options.find((o) => o.id === value) : undefined
	);
	const [query, setQuery] = useState("");

	const filteredOptions = options.filter((option) =>
		option.text.toLowerCase().includes(query.toLowerCase())
	);

	return (
		<>
			{label ? (
				<label htmlFor={name} className="field-label">
					{label}
				</label>
			) : null}
			<div className="field-input-holder relative">
				<Combobox
					value={selectedOption}
					onChange={(value) => {
						if (value) {
							setQuery("");
							setSelected(value);
							if (callBack) callBack(value.id);
						}
					}}
				>
					<Combobox.Input
						onChange={(event) => setQuery(event.target.value)}
						className="field-input"
						autoComplete={autoComplete ? "off" : "on"}
						name={name}
						id={name}
						displayValue={(option: Option) =>
							option ? option.text : ""
						}
						placeholder={placeholder}
						required={required}
					/>
					<AnimatePresence>
						{query.length > 0 && (
							<Combobox.Options
								className={`dropdown-content ${
									opaque ? "opaque" : ""
								} absolute top-12 w-full origin-top`}
								as={motion.div}
								{...scaleUp()}
								static
							>
								{filteredOptions.length === 0 && (
									<div className="default-spacing text-sm text-gray-300">
										Nenhum resultado encontrado
									</div>
								)}
								{filteredOptions.map((option) => (
									<Combobox.Option
										key={option.id}
										value={option}
										as={Fragment}
									>
										{({ active }) => (
											<div
												className={`dropdown-item ${
													active
														? "bg-brand text-white"
														: ""
												}`}
											>
												{option.text}
											</div>
										)}
									</Combobox.Option>
								))}
							</Combobox.Options>
						)}
					</AnimatePresence>
				</Combobox>
			</div>
		</>
	);
}
