const Conversation = require ("../model/conversation.model") ;
const Message = require ("../model/message.model") ;
const { getReceiverSocketId, io } =require( "../socket/socket.js");



async function sendMessage(req, res) {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
		const senderId = '661e97c7fc40e844aa396890'; // Mock sender ID

        //const senderId = req.user._id;

        // Find or create conversation between sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

		if(newMessage){
        // Add message to conversation
        conversation.messages.push(newMessage._id);
		}
		
        await conversation.save();

		await newMessage.save(); // Save the message first

        // Save conversation and message
        // await Promise.all([conversation.save(), newMessage.save()]);

        // // Send new message event to receiver's socket if available
        // const receiverSocketId = getReceiverSocketId(receiverId);
        // if (receiverSocketId) {
        //     io.to(receiverSocketId).emit("newMessage", newMessage);
        // }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getMessages(req, res) {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = {
    sendMessage,
    getMessages
}