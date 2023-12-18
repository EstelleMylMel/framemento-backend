var express = require('express');
var router = express.Router();

// IMPORT MODULES
const Camera = require('../models/cameras');
const Lens = require('../models/lenses');
const UserProfile = require('../models/userProfiles');
const { checkBody } = require('../modules/checkBody');

// IMPORT TYPES
import { Request, Response } from 'express';
import { CameraType } from '../types/camera';
import { LensType } from '../types/lens';
import { UserProfileType } from '../types/userProfile';


/// VOIR LA LISTE DES CAMERAS SUR MYMATERIEL ///

router.get('/camera/:id', (req: Request, res: Response) => {
  const userId = req.params.id;

  UserProfile.findById(userId)
    .populate('cameras')
    .then((userProfile: UserProfileType | null) => {
      // Vérifiez si le profil utilisateur a été trouvé
      if (!userProfile) {
        return res.status(404).json({ result: false, message: "User profile not found" });
      }
      // Renvoyez la liste des caméras associées à l'utilisateur
      res.json({ result: true, cameras: userProfile.cameras });
    })
  })

/// AJOUTER UNE CAMERA ///

router.post('/camera/:id', async (req: Request, res: Response) => {
  try {
      if (!checkBody(req.body, ['brand', 'model'])) {
          return res.json({ result: false, error: 'Missing or empty fields' });
      }

      const existingCamera = await Camera.findOne({ brand: req.body.brand, model : req.body.model });
      console.log(existingCamera)
      if (existingCamera) {
          return res.json({ result: false, message: "Camera with this name already exists" });
      }

      const newCamera = new Camera({
          brand: req.body.brand,
          model: req.body.model,
      });

      await newCamera.save()
      .then ( async (camera : CameraType) => {
           await UserProfile.findByIdAndUpdate(
          { _id: req.params.id },
          { $push: { cameras: camera._id } },
          { new: true }
      );
      console.log(newCamera)

      return res.json({ result: true, newCamera, id: camera._id });
      });

   
  } catch (error) {
      console.error(error);
      return res.status(500).json({ result: false, error: "Internal server error" });
  }
});


/// SUPPRIMER UNE CAMERA ///

router.delete('/camera/:id', (req: Request, res: Response) => {
  const cameraId = req.params.id;

  Camera.deleteOne({ _id: cameraId })
    .then((deletedCamera: any) => {
      console.log(deletedCamera)
      if (deletedCamera.deletedCount > 0) {
        return UserProfile.updateOne(
          { cameras: cameraId },
          { $pull: { cameras: cameraId } }
        );
      } else {
        res.json({ result : false, error: "Camera not found" })
      }
    })
    .then((result: any) => {
      if (result.modifiedCount > 0) {
        // Si au moins un document a été modifié, cela signifie que la caméra a été retiré avec succès
        res.json({ result: true, message: "Camera deleted successfully" });
        console.log(result)
      } else {
            // Si aucun document n'a été modifié, cela signifie que la caméra n'a pas été trouvée dans le profil utilisateur
        res.json({ result: false, error: "Camera not found" });
        console.log(result)
      }
    })
    .catch((error: Error) => {
      // Gérer les erreurs ici
      console.error("Error deleting camera:", error);
      res.status(500).json({ result: false, error: "Internal server error" });
    });
});


/// VOIR LA LISTE DES OBJECTIFS SUR MYMATERIEL ///

router.get('/lens/:id', (req: Request, res: Response) => {
  const userId = req.params.id;

  UserProfile.findById(userId)
    .populate('lenses')
    .then((userProfile: UserProfileType | null) => {
      // Vérifiez si le profil utilisateur a été trouvé
      if (!userProfile) {
        return res.status(404).json({ result: false, message: "User profile not found" });
      }
      // Renvoyez la liste des objectifs associées à l'utilisateur
      res.json({ result: true, lenses: userProfile.lenses });
    })
  })

/// AJOUTER UN OBJECTIF ///

router.post('/lenses/:id', async (req: Request, res: Response) => {
  try {
      if (!checkBody(req.body, ['brand', 'model'])) {
          return res.json({ result: false, error: 'Missing or empty fields' });
      }

      const existingLens = await Lens.findOne({ brand: req.body.brand, model : req.body.model });
      console.log(existingLens)
      if (existingLens) {
          return res.json({ result: false, message: "Lens with this name already exists" });
      }

      const newLens = new Lens({
          brand: req.body.brand,
          model: req.body.model,
      });

      await newLens.save()
      .then ( async (lens : LensType) => {
           await UserProfile.findByIdAndUpdate(
          { _id: req.params.id },
          { $push: { lenses: lens._id } },
          { new: true }
      );
      console.log(newLens)

      return res.json({ result: true, newLens, id: lens._id });
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ result: false, error: "Internal server error" });
  }
});

/// SUPPRIMER UN OBJECTIF ///

router.delete('/lens/:id', (req: Request, res: Response) => {
  const lensId = req.params.id;

  Lens.deleteOne({ _id: lensId })
    .then((deletedLens: any) => {
      console.log(deletedLens)
      if (deletedLens.deletedCount > 0) {
        return UserProfile.updateOne(
          { lenses: lensId },
          { $pull: { lenses: lensId } }
        );
      } else {
        res.json({ result : false, error: "Lens not found" })
      }
    })
    .then((result: any) => {
      if (result.modifiedCount > 0) {
        // Si au moins un document a été modifié, cela signifie que la caméra a été retirée avec succès
        res.json({ result: true, message: "Lens deleted successfully" });
        console.log(result)
      } else {
            // Si aucun document n'a été modifié, cela signifie que la caméra n'a pas été trouvée dans le profil utilisateur
        res.json({ result: false, error: "Lens not found" });
        console.log(result)
      }
    })
    .catch((error: Error) => {
      // Gérer les erreurs ici
      console.error("Error deleting camera:", error);
      res.status(500).json({ result: false, error: "Internal server error" });
    });
});

  
module.exports = router;
