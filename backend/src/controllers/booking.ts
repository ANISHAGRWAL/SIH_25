import { db } from '../db';
import {
  INewSessionBooking,
  ISessionBooking,
  sessionBooking,
} from '../db/schema/sessionBooking';
import { IAuthUser } from '../types';

export const bookSession = async (
  user: IAuthUser,
  bookingData: INewSessionBooking,
): Promise<ISessionBooking> => {
  try {
    const {
      preferredDate,
      preferredTime,
      sessionType,
      additionalNotes,
      reason,
      mode,
      urgency,
    } = bookingData;
    const newBooking: INewSessionBooking = {
      preferredDate,
      preferredTime,
      sessionType,
      additionalNotes,
      studentId: user.id,
      reason,
      mode,
      urgency,
      organizationId: user.organizationId,
    };
    const booking = await db
      .insert(sessionBooking)
      .values(newBooking)
      .returning();
    if (!booking) {
      throw new Error('Booking failed');
    }
    return booking[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
