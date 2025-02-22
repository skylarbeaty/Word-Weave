import { prisma } from "@/app/lib/db"

export async function POST(req: Request) {
    try {
        const { email, name } = await req.json()

        if (!email || !name) {
            return new Response(JSON.stringify({ error: "Name and Email are required." }), { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return new Response(JSON.stringify({ error: "User already exists." }), { status: 400 })
        }

        const newUser = await prisma.user.create({
            data: { email, name },
        })

        return new Response(JSON.stringify(newUser), {status: 201})
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal server error." }), { status: 500 })
    }
}

// export async function GET() {
//     try {
//         const users = await prisma.user.findMany()
//         return new Response(JSON.stringify(users), {status: 201})
//     } catch (error) {
//         return new Response(JSON.stringify({ error: "Internal server error." }), { status: 500 })
//     }
// }