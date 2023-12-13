var express = require('express');
var router = express.Router();
import * as mongoose from 'mongoose';

// IMPORT MODULES
const Lens = require('../models/lenses');
const Frame = require('../models/frames');
const { checkBody } = require('../modules/checkBody');

// IMPORT TYPES
import { Request, Response } from 'express';    // types pour (res, req)
import { FrameType } from '../types/frame';
import { LensType } from '../types/lens';

// API KEY - WEATHER
const OWM_API_KEY = process.env.OWM_API_KEY;


/// APPUI SUR BOUTON + PHOTO ///

router.get('/', (req: Request, res: Response) => {

    // Vérification de si le frontend envoie bien la géolocalisation de l'utilisatrice lors de l'appui sur le bouton + (on fera une fonction sur un onPress du bouton + qui déclenchera la demande de localisation de l'utilisatrice. Les données récupérées seront envoyées au backend ici : voir locapic-part4 MapScreen ligne 25)
    if (!checkBody(req.body, ['latitude', 'longitude'])) {
        res.json({ result: false, error: 'Missing location' });
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${req.body.latitude}&lon=${req.body.longitude}&appid=${OWM_API_KEY}&units=metric`)
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


/// ENREGISTREMENT D'UNE PHOTO ///

router.post('/', (req: Request, res: Response) => {
    if (!checkBody(req.body, ['numero', 'shutterSpeed', 'aperture', 'location', 'date', 'weather', 'shared'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    if (checkBody(req.body, ['brand', 'model'])) {
      Lens.findOne({ brand: req.body.brand, model: req.body.model })
      .then((data: LensType | null) => {
          if (data === null) {
              const newLens = new Lens({
                  brand: req.body.brand,
                  model: req.body.model,
                  shared: false
              })

              newLens.save().then((newDoc: LensType) => {
                  Frame.findOne({ numero: req.body.numero })
                  .then((data: FrameType | null) => {
                      if (data === null) {
                          const newFrame = new Frame({
                              numero: req.body.numero,
                              shutterSpeed: req.body.shutterSpeed,
                              aperture: req.body.aperture,
                              exposureValue: req.body.exposureValue || null, 
                              location: req.body.location,
                              date: req.body.date,
                              weather: req.body.weather,
                              camera: req.body.camera, // reprendre l'information de la pellicule
                              lens: newDoc._id,
                              title: req.body.title || null,
                              comment: req.body.comment || null,
                              favorite: req.body.favorite || false,
                              shared: req.body.shared || false,
                              categories: req.body.categories || [],
                              likes: req.body.likes || [],
                              commentaries: req.body.commentaries || [],
                              phonePhoto: req.body.phonePhoto || null,  // uri
                              argenticPhoto: req.body.argenticPhoto || null,
                          });
                      
                          newFrame.save().then((newDoc: FrameType) => {
                            res.json({ result: true, newFrame: newDoc, id: newDoc._id });
                          });
                      }
                      else {
                          res.json({ result: false, message: "Frame with this numero already exists"})
                      }
                  })
              })
          }
          else {
              Frame.findOne({ numero: req.body.numero })
                  .then((data: FrameType | null) => {
                      if (data === null) {
                        const newFrame = new Frame({
                          numero: req.body.numero,
                          shutterSpeed: req.body.shutterSpeed,
                          aperture: req.body.aperture,
                          exposureValue: req.body.exposureValue || null, 
                          location: req.body.location,
                          date: req.body.date,
                          weather: req.body.weather,
                          camera: req.body.camera, // reprendre l'information de la pellicule
                          lens: data,
                          title: req.body.title || null,
                          comment: req.body.comment || null,
                          favorite: req.body.favorite || false,
                          shared: req.body.shared || false,
                          categories: req.body.categories || [],
                          likes: req.body.likes || [],
                          commentaries: req.body.commentaries || [],
                          phonePhoto: req.body.phonePhoto || null,  // uri
                          argenticPhoto: req.body.argenticPhoto || null,
                      });
                      
                        newFrame.save().then((newDoc: FrameType) => {
                          res.json({ result: true, newFrame: newDoc, id: newDoc._id });
                        });
                      }
                      else {
                          res.json({ result: false, message: "Frame with this numero already exists"})
                      }
                  })

          }
      })
    }
})
     


module.exports = router;







/*
router.get('/location', async (req: Request, res: Response) => {
    try {
      // Demande les permissions d'accès à la localisation
      const { status } = await Location.requestForegroundPermissionsAsync();
  
      if (status !== 'granted') {
        return res.status(403).json({ error: 'Permission denied for location access' });
      }
  
      // Obtient la géolocalisation
      const location = await Location.getCurrentPositionAsync({});
  
      // Obtient les données météo pour la géolocalisation
      const weatherApiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${weatherApiKey}`;
      const weatherResponse = await fetch(weatherApiUrl);
      const weatherData = await weatherResponse.json();
  
      // Renvoie la réponse avec la géolocalisation, la date actuelle et les données météo
      res.json({
        result: true,
        data: {
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          date: moment().toISOString(),
          weather: weatherData,
        },
      });
    } catch (error) {
      console.error('Error getting location and weather:', error);
      res.status(500).json({ result: false, error: 'Internal Server Error' });
    }
  });
  */