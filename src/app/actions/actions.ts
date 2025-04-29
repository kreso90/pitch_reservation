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

export async function editHourlyPrices(prevState: any, formData: FormData) {
    const id = formData.get('id')?.toString();
    const startTime = formData.get('start_time')?.toString();
    const endTime = formData.get('end_time')?.toString();
    const price = formData.get('price')?.toString();

    if (!id) {
        return "Missing required reservation fields.";
    }

    const updatedHourlyPrice = await prisma.hourlyPricing.update({
        where: {
          id: id, 
        },
        data: {
          startTime: startTime,
          endTime: endTime,
          price: parseFloat(price ?? '0')
        },
    });
      

    if (updatedHourlyPrice) {
        return "Hourly price has been updated";
    }
}

export async function createHourlyPrices(prevState: any, formData: FormData) {
    const facilityId = formData.get('facility_id')?.toString();
    const field_id = formData.get('field_id')?.toString();
    const weekDay = formData.get('week_day')?.toString();
    const date = formData.get('date')?.toString();
    const startTime = formData.get('start_time')?.toString();
    const endTime = formData.get('end_time')?.toString();
    const price = formData.get('price')?.toString();

    const parsedDate = date ? parse(date, 'MM/dd/yyyy', new Date()) : null;
    const isoString = parsedDate != null ? parsedDate.toISOString() : null; 

    if (!facilityId) {
        return "Something went wrong.";
    }

    const createHourlyPrice = await prisma.hourlyPricing.create({
        data: {
            facilityId: facilityId,
            fieldId: field_id && field_id !== '' ? field_id : null,
            startTime: startTime ?? '',
            endTime: endTime ?? '',
            date: isoString ?? null,
            dayOfWeek: weekDay !== undefined ? parseInt(weekDay) : null,
            price: parseFloat(price ?? '0')
        },
    });
      

    if (createHourlyPrice) {
        return "Hourly price have been created.";
    }
}

export async function deleteHourlyPrices(prevState: any, formData: FormData) {
    const id = formData.get('id')?.toString();

    if (!id) {
        return "Missing required id.";
    }

    const deleteHourlyPrice = await prisma.hourlyPricing.delete({
        where: {
            id: id
        },
    });

    if (deleteHourlyPrice) {
        return "Hourly price has been deleted";
    }
}

export async function editField(prevState: any, formData: FormData) {
    const id = formData.get('id')?.toString();
    const FieldName = formData.get('field_name')?.toString();
    const FieldType = formData.get('field_type')?.toString();
    const FieldPrice = formData.get('field_price')?.toString();

    if (!id) {
        return "Missing required reservation fields.";
    }

    const updatedField = await prisma.facilityFields.update({
        where: {
          fieldId: id, 
        },
        data: {
            fieldName: FieldName ?? '',
            fieldType: FieldType ?? '',
            fieldPrice: parseFloat(FieldPrice ?? '0'),
        },
    });
      

    if (updatedField) {
        return "Field has been updated";
    }
}

export async function createField(prevState: any, formData: FormData) {
    const facilityId = formData.get('facility_id')?.toString();
    const FieldName = formData.get('field_name')?.toString();
    const FieldType = formData.get('field_type')?.toString();
    const FieldPrice = formData.get('field_price')?.toString();

    if (!facilityId) {
        return "Something went wrong.";
    }

    const createField = await prisma.facilityFields.create({
        data: {
            facilityFieldId: facilityId,
            fieldName: FieldName ?? '',
            fieldType: FieldType ?? '',
            fieldPrice: parseFloat(FieldPrice ?? '0'),
        },
    });
      

    if (createField) {
        return "New field have been created.";
    }
}

export async function deleteField(prevState: any, formData: FormData) {
    const id = formData.get('id')?.toString();

    if (!id) {
        return "Missing required id.";
    }

    const deleteField = await prisma.facilityFields.delete({
        where: {
            fieldId: id
        },
    });

    if (deleteField) {
        return "Field has been deleted";
    }
}

export async function editFacility(prevState: any, formData: FormData) {
    const id = formData.get('id')?.toString();
    const name = formData.get('name')?.toString();
    const desc = formData.get('desc')?.toString();
    const address = formData.get('address')?.toString();
    const email = formData.get('email')?.toString();
    const telephone = formData.get('telephone')?.toString();
    const startTime = formData.get('start_time')?.toString();
    const endTime = formData.get('end_time')?.toString();
    const fieldTypes = formData.getAll('field_types') as string[];


    if (!id) {
        return "Missing required reservation fields.";
    }

    const updatedField = await prisma.facility.update({
        where: {
          facilityId: id, 
        },
        data: {
           facilityName: name,
           facilityDesc: desc,
           facilityAddress: address,
           facilityEmail: email,
           facilityTelephone: telephone,
           workingHoursStart: startTime,
           workingHoursEnd: endTime,
           facilityFieldTypes: fieldTypes
        },
    });
      

    if (updatedField) {
        return "Facility has been updated";
    }
}