// app/actions/actions.ts
"use server";
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createUser(prevState: any, formData: FormData) {

    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const name = formData.get('name')?.toString();

    if (!email || !password) {
        return "Email and password are required.";
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return "User already exists.";
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        },
    });

    if (user) {
        redirect("/login");
    }
}

export async function createReservation(prevState: any, formData: FormData) {
    const id = formData.get('field_reservation_id')?.toString();
    const userId = formData.get('user_id')?.toString();
    const name = formData.get('reservation_name')?.toString();
    const reservationStart = formData.get('reservation_start')?.toString();
    const reservationEnd = formData.get('reservation_end')?.toString();

    if (!id || !name || !reservationStart || !reservationEnd || !userId) {
        return "Missing required reservation fields.";
    }

    const existingReservation = await prisma.fieldReservation.findFirst({
        where: {
          reservationStartTime: reservationStart,
          fieldReservationId: id,
        },
    });
      
    if(existingReservation){
        return "A reservation already exists for that date. Someone has probably booked that date in the meantime. Please refresh the page to see all available dates."
    }
      
    const reservation = await prisma.fieldReservation.create({
        data: {
            user: {
                connect: {
                    id: userId
                }
            },
            reservationName: name,
            reservationStartTime: reservationStart,
            reservationEndTime: reservationEnd,
            facilityFields: {
                connect: {
                    fieldId: id,
                },
            },
        },
    });

    if (reservation) {
        return "Reservation successful";
    }

}

export async function deleteReservation(prevState: any, formData: FormData) {
    const id = formData.get('reservation_id')?.toString();

    if (!id) {
        return "Missing required reservation fields.";
    }

    const deleteReservation = await prisma.fieldReservation.delete({
        where: {
            reservationId: id
        },
    });

    if (deleteReservation) {
        return "success";
    }

}