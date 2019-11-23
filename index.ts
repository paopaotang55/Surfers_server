import app from "./app";

const Port = 4000;

app.listen(Port, err => {
  if (err) {
    console.log(`Can't listen on Port ${Port}`);
    console.log(`Error message is: ${err}`);
  } else {
    console.log(`This server is listening on Port: ${Port}`);
  }
});
