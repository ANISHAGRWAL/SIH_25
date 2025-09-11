import { db } from '../db';
import {
  INewPhq,
  IPhq,
  phq as phqSchema,
  gad as gadSchema,
  pss as pssSchema,
} from '../db/schema';
import { IAuthUser } from '../types';

export const phqTest = async (
  user: IAuthUser,
  score: number,
): Promise<IPhq> => {
  try {
    const lastTest = await db.query.phq.findFirst({
      where: (phq, { eq }) => eq(phq.studentId, user.id),
      orderBy: (phq, { desc }) => [desc(phq.takenOn)],
    });
    if (lastTest) {
      const lastTestDate = new Date(lastTest.takenOn);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - lastTestDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        throw new Error('Phq test can be taken only once in 7 days');
      }
    }
    const phqPayload = {
      studentId: user.id,
      score: score,
    };
    const phqTest = await db.insert(phqSchema).values(phqPayload).returning();
    if (!phqTest) {
      throw new Error('Phq test data not stored');
    }
    return phqTest[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const gadTest = async (user: IAuthUser, score: number) => {
  try {
    const lastTest = await db.query.gad.findFirst({
      where: (gad, { eq }) => eq(gad.studentId, user.id),
      orderBy: (gad, { desc }) => [desc(gad.takenOn)],
    });
    if (lastTest) {
      const lastTestDate = new Date(lastTest.takenOn);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - lastTestDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        throw new Error('Gad test can be taken only once in 7 days');
      }
    }
    const gadPayload = {
      studentId: user.id,
      score: score,
    };
    const gadTest = await db.insert(gadSchema).values(gadPayload).returning();
    if (!gadTest) {
      throw new Error('Gad test data not stored');
    }
    return gadTest[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const pssTest = async (user: IAuthUser, score: number) => {
  try {
    const lastTest = await db.query.pss.findFirst({
      where: (pss, { eq }) => eq(pss.studentId, user.id),
      orderBy: (pss, { desc }) => [desc(pss.takenOn)],
    });
    if (lastTest) {
      const lastTestDate = new Date(lastTest.takenOn);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - lastTestDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 30) {
        throw new Error('Pss test can be taken only once in 7 days');
      }
    }
    const pssPayload: INewPhq = {
      studentId: user.id,
      score: score,
    };
    const pssTest = await db.insert(pssSchema).values(pssPayload).returning();
    if (!pssTest) {
      throw new Error('Pss test data not stored');
    }
    return pssTest[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTests = async (user: IAuthUser) => {
  try {
    const lastPhqTest = await db.query.phq.findFirst({
      where: (phq, { eq }) => eq(phq.studentId, user.id),
      orderBy: (phq, { desc }) => [desc(phq.takenOn)],
    });
    const lastGadTest = await db.query.gad.findFirst({
      where: (gad, { eq }) => eq(gad.studentId, user.id),
      orderBy: (gad, { desc }) => [desc(gad.takenOn)],
    });
    const lastPssTest = await db.query.pss.findFirst({
      where: (pss, { eq }) => eq(pss.studentId, user.id),
      orderBy: (pss, { desc }) => [desc(pss.takenOn)],
    });
    const currentDate = new Date();
    let phqEligible = true;
    let gadEligible = true;
    let pssEligible = true;
    if (lastPhqTest) {
      const lastTestDate = new Date(lastPhqTest.takenOn);
      const diffTime = Math.abs(currentDate.getTime() - lastTestDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        phqEligible = false;
      }
    }
    if (lastGadTest) {
      const lastTestDate = new Date(lastGadTest.takenOn);
      const diffTime = Math.abs(currentDate.getTime() - lastTestDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        gadEligible = false;
      }
    }
    if (lastPssTest) {
      const lastTestDate = new Date(lastPssTest.takenOn);
      const diffTime = Math.abs(currentDate.getTime() - lastTestDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 30) {
        pssEligible = false;
      }
    }
    return {
      phq: {
        lastTest: lastPhqTest,
        eligible: phqEligible,
      },
      gad: {
        lastTest: lastGadTest,
        eligible: gadEligible,
      },
      pss: {
        lastTest: lastPssTest,
        eligible: pssEligible,
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
