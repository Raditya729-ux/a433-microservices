require("dotenv").config();

const express = require("express");
const app = express();
const amqp = require("amqplib");

const amqpServer = process.env.AMQP_URL;

let channel;
let connection;
let reconnecting = false;

async function connectToQueue() {
  try {
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();

    await channel.assertQueue("order");

    console.log("Connected to the queue!");

    connection.on("close", () => {
      console.error("RabbitMQ connection closed. Retrying...");
      scheduleReconnect();
    });

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
    });

    await channel.consume("order", (data) => {
      if (!data) return;

      console.log(`Order received: ${data.content.toString()}`);
      console.log("** Will be shipped soon! **");

      channel.ack(data);
    });
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err.message);
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  if (reconnecting) return;

  reconnecting = true;

  setTimeout(async () => {
    reconnecting = false;
    await connectToQueue();
  }, 5000);
}

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running at ${process.env.PORT || 3001}`);
});

connectToQueue();
