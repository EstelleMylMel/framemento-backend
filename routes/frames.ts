var express = require('express');
var router = express.Router();
import * as mongoose from 'mongoose';

// IMPORT MODULES
const Lens = require('../models/lenses');
const Frame = require('../models/frames');
const { checkBody } = require('../modules/checkBody');
const UserProfile = require('../models/userProfiles');
const Roll = require('../models/rolls');
const Like = require('../models/likes')

// IMPORT TYPES
import { Request, Response } from 'express';    // types pour (res, req)
import { FrameType } from '../types/frame';
import { LensType } from '../types/lens';
import { UserProfileType } from '../types/userProfile';
import { RollType } from '../types/roll';


// CLOUDINARY //
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uniqid = require('uniqid');

// API KEY - WEATHER
const OWM_API_KEY = process.env.OWM_API_KEY;


/// API METEO POUR UNE LOCALISATION DONNEE ///

router.get('/weather/:latitude/:longitude', (req: Request, res: Response) => {

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${req.params.latitude}&lon=${req.params.longitude}&appid=${OWM_API_KEY}&units=metric&lang=fr`)
		.then(response => response.json())
		.then(apiData => {
            if (apiData !== null) {
                res.json({ result: true, weather: apiData.weather[0].description })
            }
            else {
                res.json({ result: false })
            }
        });  
})

/// ENREGISTREMENT D'UNE FRAME AVEC OU SANS LA PHOTO DU TELEPHONE ///

router.post('/', (req: Request, res: Response) => {

    if (!checkBody(req.body, [ 'userProfileID', 'rollID','numero', 'shutterSpeed', 'aperture', 'location', 'date', 'weather', 'brand', 'model'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

      Lens.findOne({ brand: req.body.brand, model: req.body.model })
      .then((data: LensType | null) => {
          if (data === null) {
              const newLens = new Lens({
                  brand: req.body.brand,
                  model: req.body.model,
                  shared: false
              })

              // Enregistrement de l'objectif dans la collection lenses
              newLens.save().then((newDoc: LensType) => {

                // Enregistrement de l'objectif dans la collection userProfiles
                UserProfile.findByIdAndUpdate({_id: req.body.userProfileID}, {$push: {lenses: newDoc._id}}, {new: true})
                .then((userProfileData: UserProfileType | null) => {});

                const newFrame = new Frame({
                    numero: req.body.numero,
                    shutterSpeed: req.body.shutterSpeed,
                    aperture: req.body.aperture,
                    exposureValue: req.body.exposureValue || null, 
                    location: req.body.location,
                    date: req.body.date,
                    weather: req.body.weather,
                    camera: req.body.camera,
                    lens: newDoc._id,
                    title: req.body.title || null,
                    comment: req.body.comment || null,
                    favorite: req.body.favorite || false,
                    shared: req.body.shared || false,
                    categories: [req.body.categories] || [],
                    likes: [req.body.likes] || [],
                    commentaries: [],
                    phonePhoto: req.body.phonePhoto || null,  // uri
                    argenticPhoto: null,
                });

                // Enregistrement dans la collection frames
            
                newFrame.save().then((newDoc: FrameType) => {

                  // Enregistrement de la frame dans la collection rolls
                    Roll.findByIdAndUpdate({_id: req.body.rollID}, {$push: {framesList: newDoc._id}}, {new: true})
                    .then((rollData: RollType) => {
                      UserProfile.findByIdAndUpdate({_id : req.body.userProfileID}, {$push: {framesList: newDoc._id}}, {new: true})
                      .then((userProfileData: UserProfileType) => {
                        res.json({ result: true, newFrame: newDoc, id: newDoc._id });
                      }) 
                    })
                }); 
              })

             
          }
          else {

            /// Vérifier que le user possède déjà cette lens ou pas 
            UserProfile.findOne({_id: req.body.userProfileID})
            .then((userProfileData: UserProfileType) => {
              userProfileData.lenses?.includes(data._id) ?
              undefined : UserProfile.findByIdAndUpdate({_id : req.body.userProfileID}, {$push: {lenses: data._id}}, {new: true});
            })

              const newFrame = new Frame({
                  numero: req.body.numero,
                  shutterSpeed: req.body.shutterSpeed,
                  aperture: req.body.aperture,
                  exposureValue: req.body.exposureValue || null, 
                  location: req.body.location,
                  date: req.body.date,
                  weather: req.body.weather,
                  camera: req.body.camera, 
                  lens: data._id,
                  title: req.body.title || null,
                  comment: req.body.comment || null,
                  favorite: req.body.favorite || false,
                  shared: req.body.shared || false,
                  categories: [req.body.categories] || [],
                  likes: [req.body.likes] || [],
                  commentaries: [],
                  phonePhoto: req.body.phonePhoto || null,  // uri
                  argenticPhoto: null,
            });

            // Enregistrement dans la collection frames
              newFrame.save().then((newDoc: FrameType) => {
                // Enregistrement de la frame dans la collection rolls
                Roll.findByIdAndUpdate({_id: req.body.rollID}, {$push: {framesList: newDoc._id}}, {new: true})
                .then((rollData: RollType) => {
                  // ajouter Frame id à userProfile ici
                  UserProfile.findByIdAndUpdate({_id : req.body.userProfileID}, {$push: {framesList: newDoc._id}}, {new: true})
                  .then((userProfileData: UserProfileType) => {
                    res.json({ result: true, newFrame: newDoc, id: newDoc._id });
                  }) 
                })
              });       

          }
      })
})

/// AJOUTER LA PHOTO DU TELEPHONE SUR CLOUDINARY ///

router.post('/upload', async (req: any, res: Response) => {
  
  console.log('body: ', req.files.photoFromFront)
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if(!resultMove) {
    //
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    fs.unlinkSync(photoPath);

    res.json({ result: true, url: resultCloudinary.secure_url });      
  } else {
    res.json({ result: false, error: 'error' });
  }
})


/// CONSULTER UNE IMAGE EN PARTICULIER  ///

router.get('/:id', (req: Request, res: Response) => {
    Frame.findOne({ _id: req.params.id })
    .populate('camera')
    .populate('lens')
    .then((data: FrameType | null) => {
        if (data !== null) {
            res.json({ result: true, frame: data })
        }
        else {
            res.json({ result: false })
        }
    })
    .catch((error: Error) => {
        res.status(500).json({ result: false, message: "Erreur lors de la récupération de l'image", error: error.message });
    });
})


/// CONSULTER TOUTES LES IMAGES PARTAGEES A LA COMMUNAUTE ///

router.get('/shared/true', (req: Request, res: Response) => {
  Frame.find({ shared: true })
  .then((data: FrameType[]) => {
      if (data.length > 0) {
          res.json({ result: true, frames: data })
      }
      else {
          res.json({ result: false })
      }
  })
  .catch((error: Error) => {
      res.status(500).json({ result: false, message: "Erreur lors de la récupération des images", error: error.message });
  });
})


/// SUPPRIMER UNE IMAGE EN PARTICULIER ///

router.delete("/:userid/:rollid/:frameid", (req: Request, res: Response) => {

  const frameId = req.params.frameid;
  const userId = req.params.userid;
  const rollId = req.params.rollId;

  // supprimer la frame dans la collection UserProfile
  UserProfile.findOneAndUpdate({ _id: userId }, {$pull: {framesList: frameId}}, {new: true})
  .then((userProfile: UserProfileType)=> {

    console.log(userProfile);
    if (userProfile) {

    // supprimer la frame dans la collection rolls
    Roll.findOneAndUpdate({ _id: rollId }, {$pull: {framesList: frameId}}, {new: true})
    .then((roll: RollType)=> {

      // supprimer la frame dans la collection frames
      Frame.deleteOne({ _id: frameId }).then((deletedFrame: any) => {
        if (deletedFrame) {
          res.json({ result: true, message: "Frame deleted successfully"})
        } else {
          res.json({ result: false, error: "Frame not found" });
        }
    });
    })
  } else console.log('user profile not found')
}
  )

  
    
});


/// MODIFIER LES INFORMATIONS D'UNE IMAGE///

router.put('/:id', async (req: Request, res: Response) => {
  try {
      // Récupérez l'ID à partir des paramètres de la requête
      const frameId = req.params.id;

      // Vérifiez si l'ID est valide
      if (!frameId) {
          return res.status(400).json({ result: false, error: 'Invalid Frame ID' });
      }

      // Utilisez findByIdAndUpdate pour modifier la frame par ID
      const updatedFrame: FrameType | null = await Frame.findByIdAndUpdate(
          frameId,
          req.body, // Utilisez le corps de la requête pour les nouvelles données de la frame
          { new: true } // Renvoie la version modifiée de la frame
      );

      // Vérifiez si la frame a été trouvée et modifiée
      if (!updatedFrame) {
          return res.status(404).json({ result: false, error: 'Frame not found' });
      }

      // Renvoyez la frame mise à jour en tant que réponse JSON pour l'afficher dans le front
      res.json({ result: true, updatedFrame });
  } catch (error) {
      // Gérez les erreurs
      console.error('Error updating roll:', error);
      res.status(500).json({ result: false, error: 'Internal Server Error' });
  }
});



// route GET search frames shared par category
router.get('/search/:category', (req: Request, res: Response) => {

  const formattedCategory = req.params.category[0].toUpperCase() + req.params.category.slice(1)
    
  Frame.find({categories: {$elemMatch: { $in: [ formattedCategory ]}}}).then((dataFrame: FrameType[] | null) => {
    if (dataFrame !== null) {
      res.json({ result: true, frames: dataFrame })
    }
    else {
      res.json({ result: false })
    }
  })
})


/// AJOUTER ET RETIRER UNE CATEGORIE À UNE FRAME ///

router.put("/:frameID/addcategory", (req: Request, res: Response) => {

  Frame.findByIdAndUpdate(
    { _id: req.params.frameID },
    { $push: { categories: req.body.category } },
    { new: true }
  )
  .then((frameData: FrameType) => {
    if (frameData) {
      res.json({ result: true, newFrame: frameData, categories: frameData.categories })
    }
    else {
      res.json({ result: false })
    }
  })
  .catch((err: Error) => {
    res.json({ result: false, error: err.message })
  })
})


router.put("/:frameID/removecategory", (req: Request, res: Response) => {

  // req.body = user._id (likes stocke l'ensemble des id des users qui likent, ici user désigne le user dans le store)

  Frame.findByIdAndUpdate(
    { _id: req.params.frameID },
    { $pull: { categories: req.body.category } },
    { new: true }
  )
  .then((frameData: FrameType) => {
    if (frameData) {
      res.json({ result: true, newFrame: frameData, categories: frameData.categories })
    }
    else {
      res.json({ result: false })
    }
  })
  .catch((err: Error) => {
    res.json({ result: false, error: err.message })
  })
})

//// ===== ROUTES NON UTILISEES PAR MANQUE DE TEMPS ==== ///

/// LIKER ET UNLIKER UNE FRAME ///

router.put("/:frameID/like", (req: Request, res: Response) => {

  // req.body = user.username (likes stocke l'ensemble des id des users qui likent, ici user désigne le user dans le store)

  Frame.findByIdAndUpdate(
    { _id: req.params.frameID },
    { $push: { likes: req.body.username } },
    { new: true }
  )
  .then((frameData: FrameType) => {
    if (frameData) {
      res.json({ result: true, newFrame: frameData, likes: frameData.likes })
    }
    else {
      res.json({ result: false })
    }
  })
  .catch((err: Error) => {
    res.json({ result: false, error: err.message })
  })
})


router.put("/:frameID/unlike", (req: Request, res: Response) => {

  // req.body = user._id (likes stocke l'ensemble des id des users qui likent, ici user désigne le user dans le store)

  Frame.findByIdAndUpdate(
    { _id: req.params.frameID },
    { $pull: { likes: req.body.username } },
    { new: true }
  )
  .then((frameData: FrameType) => {
    if (frameData) {
      res.json({ result: true, newFrame: frameData, likes: frameData.likes })
    }
    else {
      res.json({ result: false })
    }
  })
  .catch((err: Error) => {
    res.json({ result: false, error: err.message })
  })
})



module.exports = router;