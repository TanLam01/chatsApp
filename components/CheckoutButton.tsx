'use client'

import { db } from "@/firebase";
import { useSubscriptionStore } from "@/store/store";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react"
import { useState } from "react";
import ManageAccountButton from "./ManageAccountButton";
import LoadingSpinner from "./LoadingSpinner";

function CheckoutButton() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const subscription = useSubscriptionStore((state) => state.subscription);

    const isLoadingSubscription = subscription === undefined;
    const isSubscribed = subscription?.status === "active" && subscription?.role === "pro";

    const createCheckoutSession = async () => {
        if (!session?.user.id) return;

        // Push a doc into firestore db
        setLoading(true);

        const docRef = await addDoc(
            collection(db, "customers", session.user.id, "checkout_sessions"),
            {
                price: "price_1PGBLYA39CLVfFA1PAJ8MBCS",
                success_url: window.location.origin,
                cancel_url: window.location.origin,
            }
        );

        return onSnapshot(docRef, snap => {
            const data = snap.data();
            const url = data?.url;
            const error = data?.error;

            console.log(data);

            if (error) {
                alert(`An error occurred: ${error.message}`);
                setLoading(false);
            }

            if (url) {
                window.location.assign(url);
                setLoading(false);
            }
        });
    }

    return (
        <div className="flex flex-col space-y-2">
            {isSubscribed && (
                <>
                    <hr className="mt-5" />
                    <p className="pt-5 text-center text-xs text-indigo-600">
                        You are subscribed to the Pro plan
                    </p>
                </>
            )}

            <div className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center 
                text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline 
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                cursor-pointer disabled:text-white disabled:opacity-80 disabled:bg-indigo-600/50 disabled:cursor-default">
                {isSubscribed ? (
                    <ManageAccountButton />
                ) : isLoadingSubscription || loading
                    ? <LoadingSpinner />
                    : <button onClick={() => createCheckoutSession()} >
                        Sign Up
                    </button>
                }
            </div>
        </div>
    )
}

export default CheckoutButton