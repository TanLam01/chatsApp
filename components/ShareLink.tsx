'use client'
import { Copy } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';

function ShareLink({
    chatId,
    isOpen,
    setIsOpen
}: {
    chatId: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const { toast } = useToast();

    const host = window.location.host;
    const linkToChat =
        process.env.NODE_ENV === "development"
            ? `http://${host}/chat/${chatId}`
            : `https://${host}/chat/${chatId}`;

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(linkToChat);
            toast({
                title: "Copied Successfully",
                description: "Share this to the person you want to invite to the chat",
                className: "bg-green-600 text-white",
            });
        } catch (error) {
            console.error("Failed to copy to text", error);

        }
    }

    return (
        <Dialog
            onOpenChange={open => setIsOpen(open)}
            open={isOpen}
            defaultOpen={isOpen}
        >
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Copy className="mr-2" />
                    Share Link
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Share Link</DialogTitle>
                    <DialogDescription>
                        Any user who has been {" "}
                        <span className='text-indigo-600 font-bold'>granted access</span>{" "}
                        can use this link
                    </DialogDescription>
                </DialogHeader>

                <div className='flex items-center space-x-2'>
                    <div className='grid flex-1 gap-2'>
                        <Label className='sr-only' htmlFor='link'>
                            Link
                        </Label>
                        <Input id='link' defaultValue={linkToChat} readOnly />
                    </div>
                    <Button
                        type='submit'
                        onClick={() => copyToClipboard()}
                        size={'sm'}
                        className='px-3'
                    >
                        <span className='sr-only'>Copy</span>
                        <Copy className='h-4 w-4' />
                    </Button>
                </div>
                <DialogFooter className='sm:justify-start'>
                    <DialogClose asChild>
                        <Button type='button' variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ShareLink