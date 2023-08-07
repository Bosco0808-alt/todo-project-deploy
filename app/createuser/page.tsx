"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import cookie from "js-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
interface ReqBody {
  username: string;
  password: string;
  todos: string;
  authkey: string;
}

const CreateUser = () => {
  const swal = withReactContent(Swal);
  useEffect(() => {
    if (cookie.get("username") && cookie.get("password")) {
      router.replace("/todo");
    }
  }, []);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const reqbody: ReqBody = {
    username,
    password,
    todos: "",
    authkey: process.env.NEXT_PUBLIC_AUTHKEY || "",
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      swal.fire({ text: "Username or password not provided" });
      return;
    }

    const res = await fetch("/api/createuser", {
      method: "POST",
      body: JSON.stringify(reqbody),
    });
    const { status, hash } = await res.json();
    if (!status) {
      swal.fire({ text: "User with the same name already exists" });
      return;
    }
    swal.fire({ text: "user successfully created!", icon: "success" });
    cookie.set("password", hash, {
      expires: 1, // Expires in 1 day
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    cookie.set("username", username, {
      expires: 1, // Expires in 1 day
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    router.replace(`/todo`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username" className="m-2">
          Username
        </label>
        <input
          type="text"
          className="form-control m-2"
          name="username"
          value={username}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password" className="m-2">
          Password
        </label>
        <input
          type="password"
          className="form-control m-2"
          name="password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary m-2">
        Create User
      </button>
      <br />
      <br />
      <span className="m-2">Already have an account?</span>{" "}
      <Link href="/login">Login</Link>
    </form>
  );
};

export default CreateUser;
