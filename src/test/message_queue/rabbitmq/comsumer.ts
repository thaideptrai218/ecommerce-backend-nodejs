import amqplib from "amqplib";
import { TOO_MANY_REQUESTS } from "http-status-codes";
const message = "hello rabbitmq from tipsjavascript!";

const runComsumer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();

        const queueName = "test-topic";
        await channel.assertQueue(queueName, {
            durable: true,
        });

        channel.consume(
            queueName,
            (msg) => {
                if (msg !== null) {
                    console.log("Received:", msg.content.toString());
                    // channel.ack(msg);
                } else {
                    console.log("Consumer cancelled by server");
                }
            },
            {
                noAck: true,
            }
        );
    } catch (error) {
        console.error(error);
    }
};

runComsumer().catch(console.error);
