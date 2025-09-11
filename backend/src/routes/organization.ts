import express from 'express';
import { getOrganizations } from '../controllers/organization';
const router = express.Router();

router.get('/', (req, res) => {
  getOrganizations()
    .then((organizations) => {
      res.status(200).json({ success: true, data: organizations });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, error: { message: error.message } });
    });
});
export default router;
