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



/// TROUVER UNE CAMÉRA EN PARTICULIER ///

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

/// AJOUTER UNE CAMERA ///

router.post('/cameras/:id', async (req: Request, res: Response) => {
  try {
    if (!checkBody(req.body, ['brand', 'model'])) {
      return res.json({ result: false, error: 'Missing or empty fields' });
    }

    const existingCamera = await Camera.findOne({ brand: req.body.brand, model: req.body.model });

    if (existingCamera) {
      const userProfile = await UserProfile.findById(req.params.id);

      if (!userProfile.cameras.includes(existingCamera._id)) {
        // Si la camera existe dans la collection Camera mais pas dans userProfile.cameras
        await UserProfile.findByIdAndUpdate(
          { _id: req.params.id },
          { $push: { cameras: existingCamera._id } },
          { new: true }
        );

        return res.json({ result: true, message: "Camera added to user profile", camera: {id: existingCamera._id, brand: existingCamera.brand, model: existingCamera.model} });
      } else {
        // Si la camera existe déjà dans userProfile.cameras
        return res.json({ result: false, message: "Camera already exists in user profile" });
      }
    }

    // Si la camera n'existe pas du tout, on la crée
    const newCamera= new Camera({
      brand: req.body.brand,
      model: req.body.model,
    });

    await newCamera.save();

    await UserProfile.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { cameras: newCamera._id } },
      { new: true }
    );

    return res.json({ result: true, message: "New camera added to user profile", camera: { id: newCamera._id, brand: newCamera.brand, model: newCamera.model } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: false, error: "Internal server error" });
  }
});


/// SUPPRIMER UNE CAMERA ///

router.delete('/camera/:id', async (req: Request, res: Response) => {
  const cameraId = req.params.id;

  try {
    const updatedUserProfile = await UserProfile.updateOne(
      { cameras: cameraId },
      { $pull: { cameras: cameraId } }
    );

    if (updatedUserProfile.modifiedCount > 0) {
      // Si au moins un document a été modifié, cela signifie que la caméra a été retirée avec succès du userprofile
      return res.json({ result: true, message: "Camera deleted successfully from userprofile" });
    } else {
      // Si aucun document n'a été modifié, cela signifie que la caméra n'a pas été trouvée dans le profil utilisateur
      return res.json({ result: false, error: "Camera not found in userprofile" });
    }
  } catch (error) {
    // Gérer les erreurs ici
    console.error("Error deleting camera from userprofile:", error);
    return res.status(500).json({ result: false, error: "Internal server error" });
  }
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


/// TROUVER UN OBJECTIF EN PARTICULIER ///

router.get('/lenses/:id', (req: Request, res: Response) => {
  console.log("get lenses :", req.params.id)
  Lens.findOne({_id: req.params.id})
  .then((data: LensType[] | null) => {
      if (data !== null) {
          res.json({ result: true, lens: data });
      }
  else {
          res.json({ result: false })
      }
  });
})


/// AJOUTER UN OBJECTIF ///

router.post('/lenses/:id', async (req: Request, res: Response) => {
  try {
    if (!checkBody(req.body, ['brand', 'model'])) {
      return res.json({ result: false, error: 'Missing or empty fields' });
    }

    const existingLens = await Lens.findOne({ brand: req.body.brand, model: req.body.model });

    if (existingLens) {
      const userProfile = await UserProfile.findById(req.params.id);

      if (!userProfile.lenses.includes(existingLens._id)) {
        // Si l'objectif existe dans la collection Lens mais pas dans userProfile.lenses
        await UserProfile.findByIdAndUpdate(
          { _id: req.params.id },
          { $push: { lenses: existingLens._id } },
          { new: true }
        );

        return res.json({ result: true, message: "Lens added to user profile", lens: {id: existingLens._id, brand: existingLens.brand, model: existingLens.model} });
      } else {
        // Si l'objectif existe déjà dans userProfile.lenses
        return res.json({ result: false, message: "Lens already exists in user profile" });
      }
    }

    // Si l'objectif n'existe pas du tout, on le crée
    const newLens = new Lens({
      brand: req.body.brand,
      model: req.body.model,
    });

    await newLens.save();

    await UserProfile.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { lenses: newLens._id } },
      { new: true }
    );

    return res.json({ result: true, message: "New lens added to user profile", lens: { id: newLens._id, brand: newLens.brand, model: newLens.model } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: false, error: "Internal server error" });
  }
});


/// SUPPRIMER UN OBJECTIF ///

router.delete('/lens/:id', async (req: Request, res: Response) => {
  const lensId = req.params.id;

  try {
    const updatedUserProfile = await UserProfile.updateOne(
      { lenses: lensId },
      { $pull: { lenses: lensId } }
    );

    if (updatedUserProfile.modifiedCount > 0) {
      // Si au moins un document a été modifié, cela signifie que la caméra a été retirée avec succès du userprofile
      return res.json({ result: true, message: "Lens deleted successfully from userprofile" });
    } else {
      // Si aucun document n'a été modifié, cela signifie que la caméra n'a pas été trouvée dans le profil utilisateur
      return res.json({ result: false, error: "Lens not found in userprofile" });
    }
  } catch (error) {
    // Gérer les erreurs ici
    console.error("Error deleting lens from userprofile:", error);
    return res.status(500).json({ result: false, error: "Internal server error" });
  }
});


 
module.exports = router;
