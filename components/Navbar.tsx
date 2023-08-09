"use client";
import Link from "next/link";
import cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { FC } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
interface NavbarProps {
  loginStatus: boolean;
}

const Navbar: FC<NavbarProps> = ({ loginStatus }: NavbarProps) => {
  const swal = withReactContent(Swal);
  const router = useRouter();
  return (
    <nav className={`navbar navbar-light bg-light fixed-top`}>
      <Link href={"/"} className="navbar-brand m-2">
        Todo-app
      </Link>
      <Link href={"/createuser"} className="nav-item nav-link m-2">
        Create User
      </Link>
      <div className="nav-item nav-link m-2">
        <span style={{ paddingRight: 50, pointerEvents: "none" }}>
          {cookie.get("username") ? cookie.get("username") : ""}
        </span>
        <button
          onClick={async () => {
            if (cookie.get("username") || cookie.get("password")) {
              const result = await swal.fire({
                title: "Are you sure you want to logout?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Logout",
                cancelButtonText: "Cancel",
              });

              if (result.isConfirmed) {
                cookie.remove("username");
                cookie.remove("password");
                router.push("/");
              }
            } else {
              router.push("/login");
            }
          }}
          className="btn btn-primary"
        >
          <span>{loginStatus ? "logout" : "login"}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
