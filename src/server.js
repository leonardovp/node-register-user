import 'express-async-errors';
import express from 'express';
import { routes } from './routes';
import AppError from './utils/AppError';
import migrations from './database/sqlite/migrations';

const app = express();

app.use(express.json());

app.use(routes);

migrations.executeMigrations(); // initialize database and execute schemas

app.use((error, request, response, next) => {   
  
    console.error(error);

    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }   

    return response.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
})



const PORT = 3333;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
