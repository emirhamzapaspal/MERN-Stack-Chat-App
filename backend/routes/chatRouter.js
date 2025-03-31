import express from 'express'
import Message from '../models/messageModel.js';

const router = express.Router();

router.post('/', async(req, res) => {
    try {
        if(!req.body.message) {
            return res.status(400).send({
                message: 'Fill all empty fields'
            })
        }

        const newMessage = {
            message: req.body.message,
        };

        const message = await Message.create(newMessage);

        return res.status(200).send(message);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ message: error.message });
    }
})

router.get('/', async (req, res) => {
    try {
        const messages = await Message.find({});
        return res.status(200).json({
            messages: messages,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const result = await Message.findByIdAndDelete(id)

        if (!result) {
            return res.status(404).json({ message: 'Message not found' })
        }

        return res.status(200).send({ message: 'Message deleted successfully'})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

export default router;