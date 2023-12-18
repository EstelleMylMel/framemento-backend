var express = require('express');
var router = express.Router();
import * as mongoose from 'mongoose';

// IMPORT MODULES
const Category = require('../models/categories');
const { checkBody } = require('../modules/checkBody');

// IMPORT TYPES
import { Request, Response } from 'express';
import { CategoryType } from '../types/category';



/// VOIR LA LISTE DES CATEGORIES DE LA COLLECTION CATEGORIES///

router.get('/', (req: Request, res: Response) => {
	Category.find()
    .then((data: CategoryType | null) => {
        if (data !== null) {
            res.json({ result: true, categories: data });
        }
		else {
            res.json({ result: false })
        }
	});
});


/// AJOUTER UNE CATEGORIE À LA COLLECTION CATEGORIES ///

router.post('/', async (req: Request, res: Response) => {
    try {
        const existingCategory = await Category.findOne({ name: req.body.name });
        if (existingCategory) {
            return res.json({ result: false, message: "Category with this name already exists" });
        }

        const newCategory = new Category({ name: req.body.name });
        await newCategory.save();

        return res.json({ result: true, newCategory });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: false, error: "Internal server error" });
    }
})



module.exports = router;
