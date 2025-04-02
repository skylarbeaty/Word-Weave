import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/db"


interface Params {
    userID: string;
}

export async function GET(req: NextRequest, { params } : { params: Promise<{ userID: string }>}) {
    try {
        const userID = (await params).userID

        if (!userID) {
            return NextResponse.json({ error: "User ID is required."}, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { id: userID }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found."}, { status: 404 })
        }

        return NextResponse.json(user, { status: 200 })
    } catch(error) {
        return NextResponse.json({ error: "Internal server error."}, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params } : { params: Promise<{ userID: string }>}) {
    try {
        const userID = (await params).userID
        const { name, email } = await req.json()

        if (!userID) {
            return NextResponse.json({ error: "User ID is required."}, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: userID },
            data: { email, name }
        })

        return NextResponse.json(updatedUser, { status: 200 })
    } catch(error) {
        return NextResponse.json({ error: "Internal server error."}, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params } : { params: Promise<{ userID: string }> }){
    try {
        const userID = (await params).userID

        if (!userID) {
            return NextResponse.json({ error: "User ID is required."}, { status: 400 })
        }

        await prisma.user.delete({
            where: { id: userID },
          })

          return NextResponse.json({ message: "User deleted successfully." }, { status: 200 })
    } catch(error) {
        return NextResponse.json({ error: "Internal server error."}, { status: 500 })
    }
}