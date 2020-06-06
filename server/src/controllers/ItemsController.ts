import {Request, Response} from 'express';
import knex from '../database/connection';

class ItemsController{
    async index (req : Request, res: Response) {
        try{
            const items = await knex('items').select('*');
            const serializeItems = items.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    image: item.image,
                    image_url: `http://localhost:3333/uploads/${item.image}`
                }
            });
            return res.status(200).json({msg: 'itens encontrados com sucesso', items : serializeItems});
        }catch(e){
            return res.status(500).json({msg: 'Erro ao buscar itens.', error: e});
        }
    }
}

export default ItemsController;