import {
	flip,
	offset as foffset,
	shift,
	useFloating,
} from "@floating-ui/react-dom";
import { Menu } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineChevronDown } from "react-icons/hi";
import type { DropdownOptions } from "~/utils/models";
import { scaleUp } from "~/utils/transitions";

export default function Dropdown({
	text,
	offset = 16,
	options,
}: {
	text: string;
	offset?: number;
	options: DropdownOptions;
}) {
	const { x, y, reference, floating, strategy } = useFloating({
		middleware: [foffset(offset), flip(), shift({ padding: offset })],
	});

	return (
		<Menu>
			{({ open }) => {
				return (
					<>
						<Menu.Button
							className="dropdown-trigger focus-inline flex items-center"
							ref={reference}
						>
							{text}
							<div className="pl-2">
								<HiOutlineChevronDown />
							</div>
						</Menu.Button>
						<AnimatePresence>
							{open && (
								<Menu.Items
									ref={floating}
									static
									className="dropdown-content origin-top outline-none"
									{...scaleUp()}
									as={motion.div}
									style={{
										position: strategy,
										top: y ?? 0,
										left: x ?? 0,
									}}
								>
									{options.map((option, index) =>
										option === "divider" ? (
											<hr
												className=" border-gray-700"
												key={index}
											/>
										) : typeof option === "function" ? (
											option()
										) : (
											<Menu.Item key={option.id}>
												{({ active, disabled }) => (
													<Link
														className={`${
															active
																? " bg-brand text-white"
																: ""
														} dropdown-item`}
														to={option.href ?? "/"}
													>
														{option.text}
													</Link>
												)}
											</Menu.Item>
										)
									)}
								</Menu.Items>
							)}
						</AnimatePresence>
					</>
				);
			}}
		</Menu>
	);
}
