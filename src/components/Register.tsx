import { axios } from "@/lib/axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";

export default function Register({
  setSelected,
}: {
  setSelected: (selected: "LOGIN" | "REGISTER") => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // BUG: The `pending` state is not working
  async function handleSubmit(data: FormData) {
    setPending(true);

    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      await axios.post("/auth/register", { name, email, password });

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setPending(false);
      router.refresh();
    } catch (error: any) {
      console.error("The error: ", error);

      setError(error.response.data.error);
      setPending(false);
    }
  }

  return (
    <form className="rounded px-8 pt-6 pb-8 mb-4" noValidate>
      <h2 className="block text-center text-2xl font-bold mb-5">
        Register an account
      </h2>

      <div className="mb-4">
        <label className="block font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight bg-transparent border-slate-600 focus:outline-none"
          type="text"
          id="name"
          name="name"
        />
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight bg-transparent border-slate-600 focus:outline-none"
          type="email"
          id="email"
          name="email"
        />
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-300 mb-3 leading-tight border-slate-600 bg-transparent focus:outline-none"
          type="password"
          id="password"
          name="password"
        />
      </div>

      <button
        className="text-blue-400 text-center w-full hover:text-blue-500"
        onClick={() => setSelected("LOGIN")}
        type="button"
      >
        Already have an account?{" "}
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <button
        className="bg-blue-500 mt-5 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded active:scale-90 transition-all mx-auto block"
        formAction={handleSubmit}
      >
        {pending ? (
          <RotatingLines strokeColor="#fff" strokeWidth="5" width="30" />
        ) : (
          "Register"
        )}
      </button>
    </form>
  );
}
