import { Router } from 'express';
import userController from '../controllers/UserController';
import usersMiddleware from './middleware/users.middleware';

const usersRoutes = Router();

//usersRoutes.use(usersMiddleware); // aplica o middleware para todas as rotas

usersRoutes.post("/", usersMiddleware.validateUsers, userController.create);

usersRoutes.put("/update/:id", usersMiddleware.validateUsers, userController.update);

export { usersRoutes };