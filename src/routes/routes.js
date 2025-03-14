import { Router } from "express";
import multer from "multer";
import AWS from 'aws-sdk';
import { config } from "../config/index.js";
import path from 'path'
import { log } from "console";

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
    const params = {
        Bucket: 'bucketimage3742'
    };
    try {
        const data = await s3.listObjectsV2(params).promise();

        const images = data.Contents.map(file => ({
            key: file.Key,
            Url: `https://${params.Bucket}.s3.amazonaws.com/${file.Key}`
        }))

        let html = `<h1>Lista de Imágenes</h1><ul>`;
        images.forEach(image => {
            html += `<li><a href="${image.Url}" target="_blank">${image.key}</a></li>`;
        });
        html += `</ul>`;
        res.send(html);
    } catch (error) {
        console.error('Error al listar imágenes:', error);
        res.status(500).send('Error al listar imágenes');
    }

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

Routes.delete('/delete/:key', async (req, res) => {
    console.log(req.params.key);

    const params = {
        Bucket: 'bucketimage3742',
        Key: req.params.key
    };

    if (!req.params.key) {
        return res.status(400).send('Falta el parámetro key');
    }

    try {
        await s3.deleteObject(params).promise();
        res.json({
            message: `Imagen "${req.params.key}" eliminada con éxito.`,
            deletedKey: req.params.key
        });
    } catch (error) {
        console.log('Error al eliminar el archivo:', error);
        if (error.code === 'NoSuchKey') {
            res.status(404).send('El archivo no existe en el bucket.');
        } else {
            res.status(500).send('Ocurrió un error al eliminar el archivo.');
        }
    }
});
