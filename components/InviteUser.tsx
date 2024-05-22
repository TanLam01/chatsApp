'use client'

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { addChatRef, chatMembersRef } from "@/lib/converters/ChatMembers";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getUserByEmailRef } from "@/lib/converters/User";
import { useToast } from "./ui/use-toast";
import useAdminId from "@/hooks/useAdminId";
import { PlusCircleIcon } from "lucide-react";
// import { ShareLink } from './ShareLink';
import { useSubscriptionStore } from "@/store/store";
import { ToastAction } from "./ui/toast";
import { useRouter } from "next/navigation";
import ShareLink from "./ShareLink";

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

function InviteUser({ chatId }: { chatId: string }) {
    const { data: session } = useSession();
    const { toast } = useToast();
    const adminId = useAdminId({ chatId });
    // const subscription = useSubscriptionStore((state) => state.subscription);
    // const router = useRouter();

    const [open, setOpen] = useState(false);
    const [openInviteLink, setOpenInviteLink] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!session?.user) return;

        toast({
            title: "Sending invite...",
            description: "Please wait while we send the invite to the user",
        });

        // const noOfUsersInChat = (await getDocs(chatMembersRef(chatId))).docs.map(
        //     (doc) => doc.data()
        // ).length;

        // const isPro = subscription?.role === "pro" && subscription?.status === "active";

        // if (!isPro && noOfUsersInChat >= 2) {
        //     toast({
        //         title: "Free plan limit exceeded",
        //         description: "You've exceeded the FREE plan limit of 2 users per chat. Please upgrade to the PRO plan to continue chatting.",
        //         variant: "destructive",
        //         action: (
        //             <ToastAction
        //                 altText="Upgrade"
        //                 onClick={() => router.push("/register")}
        //             >
        //                 Upgrade to PRO
        //             </ToastAction>
        //         ),
        //     });

        //     return;
        // }

        const querySnapshot = await getDocs(getUserByEmailRef(values.email));

        if (querySnapshot.empty) {
            toast({
                title: "User not found",
                description: "The user you are trying to invite does not exist",
                variant: "destructive",
            });

            return;
        } else {
            const user = querySnapshot.docs[0].data();

            await setDoc(addChatRef(chatId, user.id), {
                userId: user.id!,
                email: user.email!,
                timestamp: serverTimestamp(),
                isAdmin: false,
                chatId: chatId,
                image: user.image || "",
            }).then(() => {
                setOpen(false);
                toast({
                    title: "User added successfully",
                    description: `User ${user.email} has been added to the chat`,
                    className: "bg-green-600 text-white",
                    duration: 3000,
                });

                setOpenInviteLink(true);
            });
        }

        form.reset();
    }

    return (
        adminId === session?.user?.id && (
            <>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircleIcon className="mr-1" />
                            Add User To Chat
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add User To Chat</DialogTitle>
                            <DialogDescription>
                                Simply enter the email address of the user you would like to invite to this chat! {" "}
                                <span className="text-indigo-600 font-bold">
                                    (Note: they must be a registered user)
                                </span>
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col space-y-2"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="adc@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className="ml-auto sm:w-fit w-full" type="submit">
                                    Add To Chat
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                <ShareLink
                    isOpen={openInviteLink}
                    setIsOpen={setOpenInviteLink}
                    chatId={chatId}
                />
            </>
        )
    )
}

export default InviteUser