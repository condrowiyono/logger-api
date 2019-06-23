import express from 'express';

const router = express.Router();

//Check API Status
router.get('/healthz', (req, res) => {
	res.status(200).send(`OK`);
});

export default router;
