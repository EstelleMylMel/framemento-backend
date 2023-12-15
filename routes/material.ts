var express = require('express');
var router = express.Router();
import * as mongoose from 'mongoose';

// IMPORT MODULES
const Camera = require('../models/cameras');

// IMPORT TYPES
import { Request, Response } from 'express';
import { CameraType } from '../types/camera';


/// VOIR LA LISTE DES CAMERAS SUR MYMATERIEL ///

router.get('/', (req: Request, res: Response) => {
	Camera.find()
    .then((data: CameraType[] | null) => {
        if (data !== null) {
            res.json({ result: true, cameras: data });
        }
		else {
            res.json({ result: false })
        }
	});
});


router.get('/cameras/:id', (req: Request, res: Response) => {
    Camera.findOne({_id: req.params.id})
    .then((data: CameraType[] | null) => {
        if (data !== null) {
            res.json({ result: true, camera: data });
        }
		else {
            res.json({ result: false })
        }
    });
})

module.exports = router;
