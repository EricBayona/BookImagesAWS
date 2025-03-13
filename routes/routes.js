import { Router } from "express";
import multer from "multer";
import AWS from 'aws-sdk';
import { config } from "../config/index.js";
import path from 'path'

export const Routes = Router();

// Configurar Multer para almacenamiento local temporal
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configurar AWS S3


AWS.config.update({
    region: "us-east-1"
});

const s3 = new AWS.S3();


Routes.get('/', async (req, res) => {
    res.sendFile(path.join(config.dirname, '/public/index.html'))
})


Routes.get('/images', async (req, res) => {

});

Routes.post('/upload', upload.single('file'), (req, res) => {
    const params = {
        Bucket: 'bucketimage3742',
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error('Error al subir archivo:', err);
            return res.status(500).send('Error al subir archivo');
        }
        res.send(`Archivo subido con éxito! URL: ${data.Location}`);
    });
});