import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
    const url = req.url.split("/");
    const id = url[url.length - 1];
    
    const session = await getServerSession(authOptions);
    
    try {
        const facility = await prisma.facility.findUnique({
            where: { facilityId: id },
            include: {
              workingHours: true,
              hourlyPricing: true,
              facilityFields: {
                include: {
                  fieldReservation: true,
                },
              },
            },
        });

        const user = await prisma.user.findUnique({
            where: { id: session!.user.id },
            include: { fieldReservation: true }
        });

        if (!facility) {
            return NextResponse.json(
                { message: 'No facility data found' },
                { status: 404 }
            );
        }

        return NextResponse.json({facility, user});
    } catch (error) {
        console.error('Error fetching facility data:', error);

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}


export async function POST() {
    try {
        const facility = await prisma.facility.findFirst();

        if (!facility) {
            return NextResponse.json(
                { message: 'No facility data found' },
                { status: 404 }
            );
        }

        return NextResponse.json(facility);
    } catch (error) {
        console.error('Error fetching facility data:', error);

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}