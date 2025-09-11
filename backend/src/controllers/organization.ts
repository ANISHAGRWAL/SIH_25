import { db } from '../db';

export const getOrganizations = async () => {
  try {
    const organizations = await db.query.organization.findMany();
    return organizations;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
