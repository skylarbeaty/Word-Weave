import { prisma } from "@/app/lib/db"

export async function GET(req: Request, { params }: { params: { userID: string } }) {
    try {
        const { userID: id } = await params

        if (!id) {
            return new Response(JSON.stringify({ error: "User ID is required."}), { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { id }
        })

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found."}), { status: 404 })
        }

        return new Response(JSON.stringify(user), { status: 200 })
    } catch(error) {
        return new Response(JSON.stringify({ error: "Internal server error."}), { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { userID: string } }) {
    try {
        const { userID: id } = await params
        const { name, email } = await req.json()

        if (!id) {
            return new Response(JSON.stringify({ error: "User ID is required."}), { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { email, name }
        })

        return new Response(JSON.stringify(updatedUser), { status: 200 })
    } catch(error) {
        return new Response(JSON.stringify({ error: "Internal server error."}), { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { userID: string } }){
    try {
        const { userID: id } = await params

        if (!id) {
            return new Response(JSON.stringify({ error: "User ID is required."}), { status: 400 })
        }

        await prisma.user.delete({
            where: { id },
          })

          return new Response(JSON.stringify({ message: "User deleted successfully." }), { status: 200 })
    } catch(error) {
        return new Response(JSON.stringify({ error: "Internal server error."}), { status: 500 })
    }
}