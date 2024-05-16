import { adminDb } from "@/firebase-admin";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const { chatId } = await req.json();

    const ref = adminDb.collection("chats").doc(chatId);

    const buildWriter = adminDb.bulkWriter();
    const MAX_RETRY_ATEMPTS = 5;

    buildWriter.onWriteError((error) => {
        if (error.failedAttempts < MAX_RETRY_ATEMPTS) {
            return true;
        } else {
            console.log("Failed write at document: ", error.documentRef.path);
            return false;
        }
    });

    try {
        await adminDb.recursiveDelete(ref, buildWriter);
        return NextResponse.json({
            success: true,
        }, {
            status: 200,
        })
    } catch (error) {
        console.error("Promise rejected: ", error);
        return NextResponse.json({
            success: false,
        }, { status: 500 })
    }
}