"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import cookie from "js-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import React from "react";

const Login = () => {
  const swal = withReactContent(Swal);
  useEffect(() => {
    if (cookie.get("username") && cookie.get("password")) {
      router.replace("/todo");
    }
  }, []);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      swal.fire({ text: "username and password required!" });
      return;
    }
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        authkey: process.env.NEXT_PUBLIC_AUTHKEY || "",
      }),
    });
    const { status, hash }: { status: boolean; hash: string } =
      await res.json();
    if (!status) {
      swal.fire({ text: "Username or password incorrect!" });
      return;
    }
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
        />
        <label htmlFor="password" className="m-2">
          Password
        </label>
        <input
          type="password"
          className="form-control m-2"
          name="password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary m-2">
        Login
      </button>
      <br />
      <br />
      <span className="m-2">Don't have an account?</span>{" "}
      <Link href="/createuser">Create user</Link>
    </form>
  );
};

export default Login;
