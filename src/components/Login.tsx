import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

// TODO: add pending state
export default function Login({
  setSelected,
}: {
  setSelected: (selected: "LOGIN" | "REGISTER") => void;
}) {
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log(res);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <form className="rounded px-8 pt-6 pb-8 mb-4" noValidate>
      <h2 className="block text-center text-2xl font-bold mb-5">
        Login your account
      </h2>

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
        onClick={() => setSelected("REGISTER")}
        type="button"
      >
        Don&rsquo;t have an account?{" "}
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <button
        className="bg-blue-500 mt-5 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded active:scale-90 transition-all mx-auto block"
        formAction={handleSubmit}
      >
        Login
      </button>
    </form>
  );
}
