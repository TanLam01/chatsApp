'use client'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { MessageSquarePlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useSubscriptionStore } from '@/store/store'
import { useToast } from './ui/use-toast'
import { v4 as uuidv4 } from 'uuid';
import { getDocs, serverTimestamp, setDoc } from 'firebase/firestore'
import { addChatRef, chatMembersCollectionGroupsRef } from '@/lib/converters/ChatMembers'
import { ToastAction } from './ui/toast'

function CreateChatButton({ isLarge }: { isLarge?: boolean }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    // const subscription = useSubscriptionStore((state) => state.subscription);

    const createNewChat = async () => {
        if (!session) return;
        setLoading(true);
        toast({
            title: 'Creating new chat...',
            description: 'Please wait while we create your new chat...',
            duration: 3000,
        });

        // const noOfChats = (await getDocs(chatMembersCollectionGroupsRef(session.user.id))).docs.map(doc => doc.data()).length;

        // const isPro = subscription?.status === "active" && subscription?.role === "pro";

        // if (!isPro && noOfChats >= 3) {
        //     toast({
        //         title: "Free plan limit exceeded",
        //         description: "You've'exceeded the FREE plan limit of 20 messages per chat. Please upgrade to the PRO plan to continue chatting.",
        //         variant: "destructive",
        //         action: (
        //             <ToastAction
        //                 altText="Upgrade"
        //                 onClick={() => router.push("/register")}
        //             >
        //                 Upgrade to PRO
        //             </ToastAction>
        //         )
        //     });

        //     setLoading(false);

        //     return;
        // }

        const chatId = uuidv4();

        await setDoc(addChatRef(chatId, session.user.id), {
            userId: session.user.id!,
            email: session.user.email!,
            timestamp: serverTimestamp(),
            isAdmin: true,
            chatId: chatId,
            image: session.user.image || "",
        }).then(() => {
            toast({
                title: 'Success',
                description: 'Your new chat has been created successfully!',
                className: "bg-green-600 text-white",
                duration: 2000,
            });
            router.push(`/chat/${chatId}`);
        }).catch(() => {
            toast({
                title: 'Error',
                description: 'There was an error creating your chat. Please try again.',
                variant: "destructive",
            });
        }).finally(() => {
            setLoading(false);
        });
    };

    if (isLarge) {
        return (
            <div>
                <Button onClick={createNewChat} variant={'default'}>
                    {loading ? 'Creating chat...' : 'Create a new chat'}
                </Button>
            </div>
        );
    };

    return (
        <Button onClick={createNewChat} variant={'ghost'}>
            <MessageSquarePlusIcon />
        </Button>
    )
}

export default CreateChatButton