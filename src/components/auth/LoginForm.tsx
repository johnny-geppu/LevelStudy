"use client";

import { authenticate } from "@/lib/actions/authentication";
import { useActionState } from "react";

export default function LoginForm() {
    const [state, formAction] = useActionState(
        authenticate,
        undefined
    );
    return (
        <form action={formAction} >
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" required />

            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" required />
            </div>

        {state && (
            <p className="text-red-500 text-sm">
                {state}
            </p>
        )}

            <button type="submit">Login</button>
        </form>
    )
}