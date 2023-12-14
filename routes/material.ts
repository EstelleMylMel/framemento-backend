var express = require('express');
var router = express.Router();

// IMPORT MODULES
const Camera = require('../models/cameras');
const Lens = require('../models/lenses');

// IMPORT TYPES
import { Request, Response } from 'express';
import { CameraType } from '../types/camera';
import { LensType } from '../types/lens';


/// VOIR LA LISTE DES CAMERAS SUR MYMATERIEL ///

router.get('/camera', (req: Request, res: Response) => {
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

/// SUPPRIMER UNE CAMERA ///

router.delete("/camera/:id", (req: Request, res: Response) => {
    const cameraId = req.params.id;
  
    Camera.deleteOne({ _id: cameraId }).then((deletedCamera: any) => {
        if (deletedCamera) {
          res.json({ result: true, message: "Camera deleted successfully"})
        } else {
          res.json({ result: false, error: "Camera not found" });
        }
    });
      
  });

/// VOIR LA LISTE DES OBJECTIFS SUR MYMATERIEL ///

router.get('/lens', (req: Request, res: Response) => {
	Lens.find()
    .then((data: LensType[] | null) => {
        if (data !== null) {
            res.json({ result: true, lenses: data });
        }
		else {
            res.json({ result: false })
        }
	});
});

/// SUPPRIMER UN OBJECTIF ///

router.delete("/lens/:id", (req: Request, res: Response) => {
    const lensId = req.params.id;
  
    Lens.deleteOne({ _id: lensId }).then((deletedLens: any) => {
        if (deletedLens) {
          res.json({ result: true, message: "Lens deleted successfully"})
        } else {
          res.json({ result: false, error: "Lens not found" });
        }
    });
      
  });

module.exports = router;
