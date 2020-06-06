import express from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes =  express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/',(req, res) =>{
    res.status(200).json({
        'msg' : 'Criado por Andrei Toledo'
    })
});

routes.get('/items', itemsController.index);

routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;
