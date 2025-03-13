import express from 'express';
import { Routes } from '../routes/routes.js';
import { config } from '../config/index.js';



const initApp = () => {
    const app = express();

    app.use(express.static(config.dirname + 'src/public'))
    app.use('/', Routes);


    return app;
}
export default initApp;
