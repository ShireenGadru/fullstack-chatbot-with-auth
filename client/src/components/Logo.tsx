import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export const Logo = () => {
  return (
    <Link to={"/"} className="w-fit block">
      <div className="flex gap-3 jusify-center items-center">
        <div>
          <img src={logo} alt="" />
        </div>
        <div className="text-xl">Clem AI</div>
      </div>
    </Link>
  );
};
