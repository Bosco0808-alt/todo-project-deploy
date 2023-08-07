"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import cookie from "js-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import React from "react";

const Todo = () => {
  const router = useRouter();
  const username = cookie.get("username");
  const password = cookie.get("password");
  const [Loading, setLoading] = useState(true);
  const swal = withReactContent(Swal);

  useEffect(() => {
    router.refresh();
    setLoading(true);
    (async () => {
      if (!username || !password) {
        router.replace("/login");
      } else {
        const res = await fetch("/api/authuser", {
          method: "POST",
          body: JSON.stringify({
            username,
            password,
            authkey: process.env.NEXT_PUBLIC_AUTHKEY || "",
          }),
        });
        const { redirect } = await res.json();
        if (redirect) {
          router.replace("/login");
        }
        setLoading(false);
      }
    })();
  }, [username, password]);
  const [todos, setTodos] = useState<string[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch("/api/gettodos", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
          authkey: process.env.NEXT_PUBLIC_AUTHKEY || "",
        }),
      });
      const { todos } = await res.json();
      setTodos(todos);
    };

    fetchTodos();
  }, [username, password]);
  const [todo, setTodo] = useState("");
  const [keysUsed, setKeysUsed] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      await fetch("/api/updatetodos", {
        method: "PUT",
        body: JSON.stringify({
          username,
          password,
          todos: JSON.stringify(todos),
          authkey: process.env.NEXT_PUBLIC_AUTHKEY || "",
        }),
      });
    })();
  }, [todos]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todo === "") {
      swal.fire({ text: "Please enter a todo" });
      return;
    }
    if (keysUsed.includes(todo)) {
      swal.fire({ text: "You already entered this todo" });
      return;
    }
    setTodos((prevTodos) => {
      setKeysUsed((prevKeysUsed) => [...prevKeysUsed, todo]);
      const updatedTodos = [...prevTodos, todo];
      return updatedTodos;
    });
    setTodo("");
  };

  return (
    <>
      {Loading === true ? (
        <div className="display-4 m-2">Loading...</div>
      ) : (
        <>
          <ul>
            {todos.map((todo, id) => (
              <div key={todo}>
                <li style={{ whiteSpace: "nowrap" }}>
                  {todo}{" "}
                  <button
                    className="btn btn-danger m-2"
                    onClick={async () => {
                      const confirmed = await Swal.fire({
                        title: "Confirmation",
                        text: "Are you sure you want to remove this item?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, remove it!",
                        cancelButtonText: "No, cancel",
                        reverseButtons: true,
                      });

                      if (confirmed.isConfirmed) {
                        setTodos((prevTodos) => {
                          setKeysUsed((prevKeysUsed) =>
                            prevKeysUsed.filter((_, key) => key !== id)
                          );
                          return prevTodos.filter((_, index) => index !== id);
                        });
                      }
                    }}
                  >
                    remove todo
                  </button>
                </li>
              </div>
            ))}
          </ul>
          <form className="m-2" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="m-2">Enter todo:</label>
              <input
                type="text"
                className="form-control m-2"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
              ></input>
            </div>
            <button type="submit" className="btn btn-primary m-2">
              submit
            </button>
          </form>
        </>
      )}
    </>
  );
};

export default Todo;
