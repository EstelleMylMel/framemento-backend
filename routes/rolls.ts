var express = require('express');
var router = express.Router();
import * as mongoose from 'mongoose';

// IMPORT MODULES
const Camera = require('../models/cameras');
const Roll = require('../models/rolls');
const UserProfile = require('../models/userProfiles');
const Frame = require('../models/frames');
const { checkBody } = require('../modules/checkBody');

// IMPORT TYPES
import { Request, Response } from 'express';    // types pour (res, req)
import { CameraType } from '../types/camera';
import { FrameType } from '../types/frame';
import { RollType } from '../types/roll';
import { UserProfileType } from '../types/userProfile';


/// AJOUT D'UNE PELLICULE - AVEC CAMERA ///

router.post('/', async (req: Request, res: Response) => {
    try {
        if (!checkBody(req.body, ['name', 'rollType', 'images'])) {
            return res.json({ result: false, error: 'Missing or empty fields' });
        }

        let camera;
        if (checkBody(req.body, ['brand', 'model'])) {
            camera = await Camera.findOne({ brand: req.body.brand, model: req.body.model });

            if (camera === null) {
                camera = new Camera({
                    brand: req.body.brand,
                    model: req.body.model,
                });
                await camera.save();

                await UserProfile.findByIdAndUpdate(
                    { _id: req.body.userId },
                    { $push: { cameras: camera._id } },
                    { new: true }
                );
            }
        }

        const existingRoll = await Roll.findOne({ name: req.body.name });
        if (existingRoll) {
            return res.json({ result: false, message: "Roll with this name already exists" });
        }

        const newRoll = new Roll({
            name: req.body.name,
            rollType: req.body.rollType,
            images: req.body.images,
            pushPull: req.body.pushPull || null,
            camera: camera ? camera._id : null,
            framesList: []
        });

        await newRoll.save();

        await UserProfile.findByIdAndUpdate(
            { _id: req.body.userId },
            { $push: { rollsList: newRoll._id } },
            { new: true }
        );
        console.log(newRoll)

        return res.json({ result: true, newRoll, id: newRoll._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: false, error: "Internal server error" });
    }
});


/// CONSULTER UNE PELLICULE EN PARTICULIER - AFFICHER LA LISTE DE PHOTOS DE LA PELLICULE (GESTION DANS LE FRONT) ///

router.get('/:rollID', (req: Request, res: Response) => {
    Roll.findById({ _id: req.params.rollID }).populate('framesList').populate('camera').then((dataRoll: RollType | null) => {
       
        if (dataRoll !== null) {
          res.json({ result: true, roll: dataRoll, frames: dataRoll.framesList })
        }
        else {
            res.json({ result: false })
        }
    })
    .catch((error: Error) => {
        res.status(500).json({ result: false, message: 'Erreur lors de la récupération de la pellicule', error: error.message });
    });
})


/// SUPPRIMER UNE PELLICULE EN PARTICULIER ///

router.delete("/:userid/:rollid", (req: Request, res: Response) => {
    const rollId = req.params.rollid;
    const userId = req.params.userid;
    

    /// Suppression de la clé étrangère chez UserProfile
    UserProfile.findOneAndUpdate({_id: userId}, {$pull: {rollsList: rollId}}, {new: true})
    .then((user: UserProfileType) => {
        if (user) {

            /// PARTIE DU CODE COMMENTEE CAR FAIT CRASHER L'APP ///
            /*
            /// Supprimer toutes les frames de cette pellicule dans la collection frames
            Roll.findOne({_id: rollId }).populate('framesList')
            .then((roll: RollType) => {

                console.log('roll : ',roll)
                console.log('roll framelist : ',roll.framesList)
                if (roll.framesList) {
                
                 for (const frameId of roll.framesList) {

                    Frame.findByIdAndDelete({_id: frameId})
                    .then( console.log('frame has been deleted'))
                 }
                } 
            })
            */
            /// Supprimer le roll
            Roll.deleteOne({ _id: rollId }).then((deletedRoll: any) => {
                if (deletedRoll) {
                res.json({ result: true, message: "Roll deleted successfully"})
                } else {
                res.json({ result: false, error: "Roll not found" });
                }
            });
        } else { res.json({ result: false, error: "User not found" })} ;
    })
      
});


/// MODIFIER LES INFORMATIONS D'UNE PELLICULE ///

router.put('/:id', async (req: Request, res: Response) => {
  try {
      // Récupérez l'ID à partir des paramètres de la requête
      const rollId = req.params.id;

      // Vérifiez si l'ID est valide
      if (!rollId) {
          return res.status(400).json({ result: false, error: 'Invalid Roll ID' });
      }

      // Utilisez findByIdAndUpdate pour modifier la roll par ID
      const updatedRoll: RollType | null = await Roll.findByIdAndUpdate(
          rollId,
          req.body, // Utilisez le corps de la requête pour les nouvelles données de la roll
          { new: true } // Renvoie la version modifiée de la roll
      );

      // Vérifiez si la roll a été trouvée et modifiée
      if (!updatedRoll) {
          return res.status(404).json({ result: false, error: 'Roll not found' });
      }

      // Renvoyez la roll mise à jour en tant que réponse JSON
      res.json({ result: true, updatedRoll });
  } catch (error) {
      // Gérez les erreurs
      console.error('Error updating roll:', error);
      res.status(500).json({ result: false, error: 'Internal Server Error' });
  }
});



module.exports = router;
