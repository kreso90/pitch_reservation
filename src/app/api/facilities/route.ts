import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
    const session = await getServerSession(authOptions);
        
    try {
       
        const facilities = await prisma.facility.findMany({});

        const user = await prisma.user.findUnique({
            where: { id: session!.user.id },
            include: { fieldReservation: true }
        });
   
        if (!facilities) {
            return NextResponse.json(
                { message: 'No facility data found' },
                { status: 404 }
            );
        }

        return NextResponse.json({facilities, user});

    } catch (error) {
        console.error('Error fetching facility data:', error);

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}