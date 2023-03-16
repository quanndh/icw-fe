import { Outlet, useLocation } from "react-router-dom";
import { useQueryParam } from "../shared/hooks/useQueryParam";
import Footer from "./Footer";
import Header from "./Header";

const Layout = () => {
  const search = useQueryParam("search");
  const location = useLocation();

  return (
    <div className="m-0">
      <Header />

      <div className={location.pathname !== "/" || search ? "pt-8" : "pt-0"}>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
