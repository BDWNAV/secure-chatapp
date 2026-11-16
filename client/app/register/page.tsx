"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  return (
    <form className="flex flex-column" onSubmit={(async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      try {
        const dataFetch = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            username: username,
            password: password
          })
        });

        const response = await dataFetch.json();

        if(!dataFetch.ok) {
          return setError(response.error);
        }

        router.replace("/login");
        
      } catch (error) {
        console.log(error);

        setError("Could not reach the server.");
      } finally {
        setIsSubmitting(false);
      }
    })}>
      <input type="text" placeholder="name" autoComplete="name" value={name} onChange={((n) => { setName(n.target.value); })} className="outline-1 mr-2"></input>
      <input type="email" placeholder="email" autoComplete="email" value={email} onChange={((e) => { setEmail(e.target.value); })} className="outline-1 mr-2"></input>
      <input type="text" placeholder="username" autoComplete="username" value={username} onChange={((u) => { setUsername(u.target.value); })} className="outline-1 mr-2"></input>
      <input type="password" placeholder="password" autoComplete="new-password" value={password} onChange={((p) => { setPassword(p.target.value); })} className="outline-1"></input>
      <button type="submit" disabled={isSubmitting}>Submit</button>
      {error && <p>{error}</p>}
    </form>
  )
}