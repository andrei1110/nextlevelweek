import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController{
    async index(req : Request, res: Response){
        const { city, uf, items } = req.query;
        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points.items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

            return res.status(200).json(points);
    }

    async show(req: Request, res: Response){
        try{
            const { id } = req.params; 

            const point = await knex('points').where('id', id).first();
    
            const items = await knex('items')
                .join('points_items', 'items.id', '=', 'points_items.item_id')
                .where('points_items.point_id', id);
    
            if(!point) 
                return res.status(400).json({
                    'msg': `Nenhum ponto com o id ${id} encontrado.`
                });
            return res.status(200).json({point, items});
        }catch(e){
            res.status(500).json({
                'msg': 'Erro ao buscar ponto',
                'error': e
            });
        }
        
    }

    async create (req: Request, res: Response) {
        try{
            const {
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf,
                items
            } = req.body;
    
            const trx = await knex.transaction();

            const point = {
                image: 'https://images.unsplash.com/photo-1565061830316-53e83aa760b8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=30',
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                uf,
                city
            };
    
            const inserted_ids = await trx('points').insert(point);
            const point_id = inserted_ids[0];

            const pointItems = items.map( (item_id:number) => {
                return {
                    point_id: point_id,
                    item_id
                }
            })
            await trx('points_items').insert(pointItems);
            await trx.commit();

            return res.status(200).json({
                point_id: point_id,
                ...point
            });
        }catch(e){
            return res.status(500).json({msg : 'Erro ao inserir ponto', error: e});
        }
    }
}

export default PointsController;