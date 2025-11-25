import amqplib from "amqplib";

const runProducer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();

        const notificationExchange = "notificationEx";
        const notificationQueue = "notificationQueueProcess";
        const notificationExchangeDLX = "notificationExDLX";
        const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

        await channel.assertExchange(notificationExchange, "direct", {
            durable: true,
        });

        const queueResult = await channel.assertQueue(notificationQueue, {
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX,
        });

        await channel.bindQueue(queueResult.queue, notificationExchange, "");

        const msg = "a new product";
        console.log(`product msg:: `, msg);

        setInterval(() => {
            channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
                expiration: 5000, // Set to 5 seconds to ensure expiration before consumer starts
            });
            console.log(`product msg:: `, msg);
        }, 1000);
    } catch (error) {
        console.error(error);
    }
};

runProducer().catch(console.error);
