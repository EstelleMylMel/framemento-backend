var express = require('express');
var router = express.Router();
import * as mongoose from 'mongoose';

// IMPORT MODULES
const Camera = require('../models/cameras');
const Roll = require('../models/rolls');
const UserProfile = require('../models/userProfiles');
const { checkBody } = require('../modules/checkBody');

// IMPORT TYPES
import { Request, Response } from 'express';    // types pour (res, req)
import { CameraType } from '../types/camera';
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
                    model: req.body.model
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


/// VOIR LA LISTE DES PELLICULES SUR L'ACCUEIL ///

router.get('/', (req: Request, res: Response) => {
	Roll.find()
    .then((data: RollType[] | null) => {
        if (data !== null) {
            res.json({ result: true, rolls: data });
        }
		else {
            res.json({ result: false })
        }
	});
});


/// CONSULTER UNE PELLICULE EN PARTICULIER - AFFICHER LA LISTE DE PHOTOS DE LA PELLICULE (GESTION DANS LE FRONT) ///

router.get('/:name', (req: Request, res: Response) => {
    Roll.findOne({ name: req.params.name })
    .then((data: RollType | null) => {
        if (data !== null) {
            res.json({ result: true, roll: data })
        }
        else {
            res.json({ result: false })
        }
    })
    .catch((error: Error) => {
        res.status(500).json({ result: false, message: 'Erreur lors de la récupération de la pellicule', error: error.message });
    });
})


/// SUPPRIMER UNE PELLICULE EN PARTICULIER - SUPPRIMER LES IMAGES AUSSI ? ///

router.delete("/:id", (req: Request, res: Response) => {
    const rollId = req.params.id;

    Roll.deleteOne({ _id: rollId }).then((deletedRoll: any) => {
        if (deletedRoll) {
          res.json({ result: true, message: "Roll deleted successfully"})
        } else {
          res.json({ result: false, error: "Roll not found" });
        }
    });
      
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


/// QUELQUES SOLUTIONS POUR LES TYPES ///

/*import { Document } from 'mongoose';
interface RollType extends Document {
    name: string;
    rollType: string;
    images: string[];
    // ... d'autres propriétés si nécessaire
}*/

/*type RollType = Document & {
  name: string;
  rollType: string;
  images: string[];
  // ... d'autres propriétés si nécessaire
};*/




/* SANS CAMERA 

router.post('/', (req: Request, res: Response) => {
    if (!checkBody(req.body, ['name', 'rollType', 'images'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    Roll.findOne({ name: req.body.name })
    .then((data: RollType | null) => {
        if (data === null) {
            const newRoll = new Roll({
                name: req.body.name,
                rollType: req.body.rollType,
                images: req.body.images,
            });
        
            newRoll.save().then((newDoc: RollType) => {
            res.json({ result: true, newRoll: newDoc, id: newDoc._id });
            });
        }
        else {
            res.json({ result: false, message: "Roll with this name already exists"})
        }
    })
});

*/


/*router.post('/', (req: Request, res: Response) => {
    if (!checkBody(req.body, ['name', 'rollType', 'images'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    if (checkBody(req.body, ['brand', 'model'])) {
        Camera.findOne({ brand: req.body.brand, model: req.body.model })
        .then((data: CameraType | null) => {
            if (data === null) {
                const newCamera = new Camera({
                    brand: req.body.brand,
                    model: req.body.model
                })

                newCamera.save().then((newDoc: CameraType) => {
                    UserProfile.findByIdAndUpdate(
                        { _id: req.body.userId },
                        { $push: { cameras: newDoc._id} },
                        { new: true }
                    )
                    .then((data: UserProfileType) => {
                        if (data !== null) {
                            res.json({ result: true, newUser: newDoc })
                        }
                    })

                    Roll.findOne({ name: req.body.name })
                    .then((data: RollType | null) => {
                        if (data === null) {
                            const newRoll = new Roll({
                                name: req.body.name,
                                rollType: req.body.rollType,
                                images: req.body.images,
                                pushPull: req.body.pushPull || null,
                                camera: newDoc._id,
                                framesList: []  // Aucune photo dans la pellicule au moment de sa création
                            });
                        
                            newRoll.save().then((newDoc: RollType) => {
                                res.json({ result: true, newRoll: newDoc, id: newDoc._id });
                                UserProfile.findByIdAndUpdate(
                                    { _id: req.body.userId },
                                    { $push: { rollsList: newDoc._id} },
                                    { new: true }
                                )
                                .then((data: UserProfileType) => {
                                    if (data !== null) {
                                        res.json({ result: true, newUser: newDoc })
                                    }
                                })
                            });
                        }
                        else {
                            res.json({ result: false, message: "Roll with this name already exists"})
                        }
                    })
                })
            }
            else {
                UserProfile.findByIdAndUpdate(
                    { _id: req.body.userId },
                    { $push: { cameras: data._id} },
                    { new: true }
                )
                .then((data: UserProfileType) => {
                    if (data !== null) {
                        res.json({ result: true })
                    }
                })
                
                Roll.findOne({ name: req.body.name })
                    .then((data: RollType | null) => {
                        if (data === null) {
                            const newRoll = new Roll({
                                name: req.body.name,
                                rollType: req.body.rollType,
                                images: req.body.images,
                                pushPull: req.body.pushPull || null,
                                camera: data,
                                framesList: []  
                            });
                        
                            newRoll.save().then((newDoc: RollType) => {
                                res.json({ result: true, newRoll: newDoc, id: newDoc._id });
                                UserProfile.findByIdAndUpdate(
                                    { _id: req.body.userId },
                                    { $push: { rollsList: newDoc._id} },
                                    { new: true }
                                )
                                .then((data: UserProfileType) => {
                                    if (data !== null) {
                                        res.json({ result: true })
                                    }
                                })
                            });
                        }
                        else {
                            res.json({ result: false, message: "Roll with this name already exists"})
                        }
                    })

            }
        })
    }
});*/