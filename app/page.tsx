"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import cookie from "js-cookie";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
    if (cookie.get("username") && cookie.get("password")) {
      router.replace("/todo");
    }
  }, []);
  return (
    <>
      <h1 className="m-2">Todo-app</h1>
      <p className="m-2">A todo app</p>
      <Link href={"/createuser"} className="m-2 btn btn-primary">
        Get started!
      </Link>
    </>
  );
}
