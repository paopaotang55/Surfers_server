import server from "./app";
import * as SocketIO from "socket.io";

const Port = 3000;

server.io.on("connection", (socket: any) => {
  console.log("connected");

  socket.on("chatEvent", (message: any) => {
    console.log("you got message");
  });
});

server.http.listen(Port, (err: Error) => {
  if (err) {
    console.log(`Can't listen on Port ${Port}`);
    console.log(`Error message is: ${err}`);
  } else {
    console.log(`This server is listening on Port: ${Port}`);
  }
});
