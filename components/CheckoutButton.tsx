'use client'

import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useSession } from "next-auth/react"
import { useState } from "react";

function CheckoutButton() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    const createCheckoutSession = async () => {
        if (!session?.user.id) return;

        setLoading(true);

        const docRef = await addDoc(collection(db, "customers", session.user.id, "checkout_sessions"), {
            price: "price_1J3QX9B6Q7h7v3k5B2Q7",
            success_url: window.location.origin,
            cancel_url: window.location.origin,
        });
        // Push a document into firestore db

    }

    return (
        <div className="flex flex-col space-y-2">
            <button onClick={() => createCheckoutSession()} className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center 
                text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline 
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                cursor-pointer disabled:text-white disabled:opacity-80 disabled:bg-indigo-600/50 disabled:cursor-default">
                Sign Up
            </button>
        </div>
    )
}

export default CheckoutButton