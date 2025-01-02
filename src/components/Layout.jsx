import Navbar from "./Navbar.jsx";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main className="pt-2">{children}</main>
    </div>
  );
};

export default Layout;
