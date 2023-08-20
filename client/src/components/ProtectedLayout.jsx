import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header";

const ProtectedLayout = () => {
  const { token } = useSelector((store) => store.user);
  if (!token) {
    return <Navigate to={"/login"} replace />;
  }
  return (
    <div>
      <Header />
      <div className="w-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
