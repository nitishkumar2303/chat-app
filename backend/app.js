
import express from 'express';
import morgan from 'morgan'; //morgan is a middleware for logging HTTP requests in Node.js applications. It helps track incoming requests and their statuses, making debugging and monitoring easier.
import connect from './db/db.js';
import userRoutes from './routes/user.routes.js'; // Importing user routes
import projectRoutes from './routes/project.routes.js'; // Importing project routes
import aiRoutes from './routes/ai.routes.js'; // Importing AI routes
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Importing CORS middleware


connect();


const app = express();

app.use(cors())
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/users' , userRoutes)  // Mounting user routes on the /users path
app.use('/projects' , projectRoutes) // Mounting project routes on the /projects path
app.use('/ai' , aiRoutes) // Mounting AI routes on the ai path

app.get('/testing' , (req,res)=>{
    res.send("Aur bhai ji");
})

export default app;