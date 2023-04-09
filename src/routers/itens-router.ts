import express from 'express'
import Item from '@models/item'

const itensRouter = express.Router()

itensRouter.post('/itens', (req, res) => {
    res.send('Cria novo item')
})
itensRouter.get('/itens', (req, res) => {
    const itens: Item[] = [
        {
            id: 1,
            name: 'Emanuel Furlan',
            description: 'Lindo!'
        },
        {
            id: 2,
            name: 'João',
            description: 'Esforçado'
        }
    ]
    res.json(itens)
})
itensRouter.get('/itens/:id', (req, res) => {
    const id: number = +req.params.id
    res.send(`Lê o item ${id}`)
})
itensRouter.put('/itens/:id', (req, res) => {
    const id: number = +req.params.id
    res.send(`Atualiza o item ${id}`)
})
itensRouter.delete('/itens/:id', (req, res) => {
    const id: number = +req.params.id
    res.send(`Apaga o item ${id}`)
})
export default itensRouter