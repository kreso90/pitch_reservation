// app/actions/actions.ts
"use server";
import { prisma } from '@/lib/prisma';
import { createDateFromStringAndNumber, formatToISODateTime } from '@/utils/formatUtils';
import bcrypt from 'bcryptjs';
import { format, parse } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createUser(prevState: any, formData: FormData) {

    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const confirmPassword = formData.get('confirm_password')?.toString();
    const name = formData.get('name')?.toString();

    if (!email || !password) {
        return "Please fill in all fields.";
    }

    if(confirmPassword != password){
        return "Passwords do not match.";
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


export async function editWrokingHours(prevState: any, formData: FormData) {
    const id = formData.get('id')?.toString();
    const startTime = formData.get('start_time')?.toString();
    const endTime = formData.get('end_time')?.toString();
    const isClosed = formData.get('is_closed') === '1';

    if (!id) {
        return "Missing required reservation fields.";
    }

    const updatedWorkingHours = await prisma.workingHours.update({
        where: {
          id: id, 
        },
        data: {
          startTime: startTime,
          endTime: endTime,
          isClosed: isClosed ?? false,
        },
    });
      

    if (updatedWorkingHours) {
        return "Working hours has been updated";
    }
}

export async function createHoursAction(prevState: any, formData: FormData) {
    const facilityId = formData.get('facility_id')?.toString();
    const field_id = formData.get('field_id')?.toString();
    const weekDay = formData.get('week_day')?.toString();
    const date = formData.get('date')?.toString();
    const startTime = formData.get('start_time')?.toString();
    const endTime = formData.get('end_time')?.toString();
    const isClosed = formData.get('is_closed') === '1';

    const parsedDate = date ? parse(date, 'MM/dd/yyyy', new Date()) : null;
    const isoString = parsedDate != null ? parsedDate.toISOString() : null; 

    if (!facilityId) {
        return "Something went wrong.";
    }

    const createWorkingHours = await prisma.workingHours.create({
        data: {
            facilityId: facilityId,
            fieldId: field_id && field_id !== '' ? field_id : null,
            startTime: startTime ?? '',
            endTime: endTime ?? '',
            isClosed: isClosed ?? false,
            date: isoString ?? null,
            dayOfWeek: weekDay !== undefined ? parseInt(weekDay) : null,
        },
    });
      

    if (createWorkingHours) {
        return "Working hours have been created.";
    }
}

export async function deleteWorkingHours(prevState: any, formData: FormData) {
    const id = formData.get('id')?.toString();

    if (!id) {
        return "Missing required id.";
    }

    const deleteWorkingHours = await prisma.workingHours.delete({
        where: {
            id: id
        },
    });

    if (deleteWorkingHours) {
        return "Working hours has been deleted";
    }
}