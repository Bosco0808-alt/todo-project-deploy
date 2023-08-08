"use client";

import Link from "next/link";

export default function Error() {
    return (
        <>
            <h1>Oops, an error occured!</h1>
            <Link href={"/"}>Back to home page</Link>
        </>
    )
}