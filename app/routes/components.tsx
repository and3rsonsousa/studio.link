import type { MetaFunction } from "@remix-run/node";
import { Button, InputField } from "~/components/Forms";

export const meta: MetaFunction = () => {
	return {
		title: "Components > STUDIO",
	};
};

export default function ComponentsPage() {
	return (
		<div className="container mx-auto flex">
			<div className="min-h-screen w-1/2 p-8">
				<Components />
			</div>
			<div className="dark min-h-screen w-1/2 bg-gray-900 p-8">
				<Components />
			</div>
		</div>
	);
}

function Components() {
	return (
		<>
			<div className="space-y-4">
				<h2 className="mb-8">Button</h2>
				<div className="space-x-2">
					<Button>Simple Button</Button>

					<Button primary>Primary Button</Button>

					<Button ghost>Ghost Button</Button>
				</div>
				<div className="space-x-2">
					<Button small>Small Button</Button>
					<Button small primary>
						Primary Small Button
					</Button>

					<Button small ghost>
						Ghost Small Button
					</Button>
				</div>
				<div className="space-x-2">
					<Button large>Large Button</Button>
					<Button large primary>
						Primary
					</Button>
					<Button large ghost>
						Ghost
					</Button>
				</div>
			</div>
			<hr className="border-line my-16" />
			<div className="space-y-4">
				<h2 className="mb-8">Forms</h2>
				<div className="bg-gray-100 p-4">
					<InputField name="name" type="text" label="Input" />
					<InputField
						name="name"
						type="text"
						label="Disabled Input"
						value="I am disabled"
						disabled
					/>

					<InputField
						name="name"
						type="text"
						label="Opaque Input"
						value="I am opaque"
						opaque
					/>
					<InputField
						name="name"
						type="text"
						label="Darker Input"
						value="I am darker than the others"
						darker
					/>
				</div>
			</div>
		</>
	);
}
