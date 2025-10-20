
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import connectToDatabase from './config/db.connetion.js';
import router from './routes/router.js';

const app = express();

const corsOptions = {
    origin: "*",
    methodes: ["GET", "POST", "DELETE"],
    credentials: true,
    optionSuccessStatus: 200,

}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//health check route
app.get('/health', (req, res) => {
    res.status(200).send('API is running...');
});


//api routes
app.use('/', router);
//swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//handle invali route
app.use((req, res) => {
    res.status(404).send({message: 'Route not found'});
});




connectToDatabase();




export default app;