import server from "./app";

const Port = 3000;

server.http.listen(Port, (err: Error) => {
  if (err) {
    console.log(`Can't listen on Port ${Port}`);
    console.log(`Error message is: ${err}`);
  } else {
    console.log(`This server is listening on Port: ${Port}`);
  }
});
