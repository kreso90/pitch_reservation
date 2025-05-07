import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
    
    try {
        const facility = await prisma.facility.findFirst({
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