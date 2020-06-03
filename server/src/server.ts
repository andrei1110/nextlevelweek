import express from 'express';

const app = express();

app.get('/users', (req, res) =>{
    console.log('aquiiiehehe');
    res.status(200).json({
        msg : 'Voltou irmão',
        users: ["Andrei", "teste"]
    });
});

app.listen(3333);