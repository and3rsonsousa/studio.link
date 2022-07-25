import { Link } from "react-router-dom";

export default function ContextMenu() {
	return (
		<div className={`dropdown-content`}>
			<Link to="/teste" className="dropdown-item">
				Teste
			</Link>
			<Link to="/teste-2" className="dropdown-item">
				Teste
			</Link>
			<Link to="/teste-3" className="dropdown-item">
				Teste
			</Link>
			<Link to="/teste-4" className="dropdown-item">
				Teste
			</Link>
		</div>
	);
}
