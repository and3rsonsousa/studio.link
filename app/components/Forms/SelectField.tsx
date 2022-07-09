import { flip, offset, shift, useFloating } from "@floating-ui/react-dom";
import { Listbox } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { HiCheckCircle } from "react-icons/hi";
import { scaleUp } from "~/utils/transitions";

const SelectField = ({
	name,
	label,
	before,
	after,
	error,
	value,
	options,
	opaque = false,
	callBack,
}: {
	name?: string;
	label?: string;
	before?: React.ReactChild;
	after?: React.ReactChild;
	error?: string;
	value?: string;
	options: { id: string; text: string; value: string }[];
	opaque?: boolean;
	callBack?: (value: string) => void;
}) => {
	const [selectedOption, setSelected] = useState(
		value ? options.filter((option) => option.id === value)[0] : options[0]
	);
	const { x, y, reference, floating, strategy } = useFloating({
		middleware: [offset(8), flip(), shift({ padding: 8 })],
	});

	return options.length > 0 ? (
		<div className="field">
			{label && (
				<label htmlFor={name} className="field-label">
					{label}
				</label>
			)}
			<div className="field-input-holder relative">
				{before}
				<Listbox
					value={selectedOption}
					onChange={(value) => {
						setSelected(value);
						if (callBack) callBack(value.id);
					}}
					name={name}
				>
					{({ open }) => (
						<>
							<Listbox.Button
								className="field-input default-spacing w-full text-left outline-none"
								ref={reference}
							>
								{selectedOption.text}
							</Listbox.Button>

							<AnimatePresence>
								{open && (
									<Listbox.Options
										static
										as={motion.div}
										{...scaleUp()}
										ref={floating}
										className={`dropdown-content ${
											opaque ? "opaque" : ""
										} no-scroll-bars max-h-40 w-full ${
											y && y > 0
												? "origin-top"
												: "origin-bottom"
										}`}
										style={{
											top: y ?? 0,
											left: x ?? 0,
											position: strategy,
										}}
									>
										{options?.map((option) => (
											<Listbox.Option
												as="div"
												value={option}
												key={option.id}
											>
												{({ active, selected }) => (
													<div
														className={`dropdown-item justify-between ${
															active
																? "bg-brand text-white"
																: ""
														}`}
													>
														<span>
															{option.text}
														</span>
														{selected && (
															<HiCheckCircle className="text-xl" />
														)}
													</div>
												)}
											</Listbox.Option>
										))}
									</Listbox.Options>
								)}
							</AnimatePresence>
						</>
					)}
				</Listbox>

				{after}
			</div>
		</div>
	) : (
		<pre>No options</pre>
	);
};

export default SelectField;
