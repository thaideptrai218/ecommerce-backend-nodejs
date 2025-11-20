import amqplib from "amqplib";
const message = "hello rabbitmq from tipsjavascript!";

const runProducer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();

        const queueName = "test-topic";
        await channel.assertQueue(queueName, {
            durable: true,
        });

        setInterval(() => {
            channel.sendToQueue(queueName, Buffer.from(message));
        }, 1000);
    } catch (error) {
        console.error(error);
    }
};

runProducer().catch(console.error);
