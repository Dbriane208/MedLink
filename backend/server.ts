import express, {Express, Request, Response, NextFunction, ErrorRequestHandler} from 'express'
import dotenv from 'dotenv';
import cors from  'cors';
import morgan from 'morgan';

dotenv.config();

import AppError from './utils/AppError';
import AuthRoutes from "./routes/AuthRoutes"
import { connectToDatabase, disconnectDatabase } from './prisma/PrismaClient';

const app: Express = express();

const port: number = parseInt(process.env.PORT as string, 10) || 7000;
const host: string = 'localhost';

// for parsing application/json
app.use(express.json());

//for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

app.use(cors());
app.use(morgan('dev'));

// Default Routes
app.get("/", (req: Request,res: Response) => {
    res.status(200).json({
        message: "Welcome to the Medlink application"
    });

});

// passing all the routes to endpoint
app.use("/api/v1/users", AuthRoutes);


// Handling undefined routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Cannot find ${req.method} ${req.url} on this server`, 404));
});


// Define custom error interface
interface AppErrorInstance extends ErrorRequestHandler {
    message: string,
    statusCode: number,
    status?: string
};

// Global error handler
app.use((err: AppErrorInstance, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'Error';

    res.status(statusCode).json({
        status: status,
        message: err.message || "Internal Server Error"
    });
});

// Starting our server
async function startServer() {
    await connectToDatabase();    
    app.listen(port, host, () => {
        console.log(`✅Server running at http://${host}:${port}🚀🌟`);
    });
}

// Willingly terminating the database connection
process.on("SIGINT", async () => {
    console.log("\nGracefully shutting down...");
    await disconnectDatabase();
    process.exit(0);
});

// Catching any error during server execution
startServer().catch(async (error) => {
    console.error("Error starting server:", error);
    await disconnectDatabase();
    process.exit(1);
});
