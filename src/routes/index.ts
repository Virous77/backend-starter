import express from 'express';
import { userSchema, validateBodyData } from '../validations/validation';

const router = express.Router();

router.post('/test', validateBodyData(userSchema), (req, res) => {
  console.log(req.body);
});

export default router;
