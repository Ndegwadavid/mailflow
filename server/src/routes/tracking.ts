import { Router } from 'express';
import { TrackingController } from '../controllers/TrackingController';

const router = Router();
const trackingController = new TrackingController();

// Public tracking endpoints (no auth required)
router.get('/pixel/:campaignId/:subscriberId', (req, res) => 
    trackingController.trackPixel(req, res)
);

router.get('/click/:campaignId/:subscriberId', (req, res) => 
    trackingController.trackClick(req, res)
);

// Protected metrics endpoints
router.get('/campaigns/:campaignId/metrics', (req, res) => 
    trackingController.getMetrics(req, res)
);

router.get('/organizations/:organizationId/metrics', (req, res) => 
    trackingController.getOrganizationMetrics(req, res)
);

export default router;