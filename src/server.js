import { join } from "path";
import express from "express";
import socketIO from "socket.io";
import logger from "morgan";
import socketController from "./socketController";
import events from "./events";

const PORT = 4000;
const app = express();

app.engine('html', require('ejs').renderFile);
app.set("view engine", "html");
app.set("views", join(__dirname, "views"));
app.use(logger("dev"));
app.use(express.static(join(__dirname, "static")));

app.get("/", (req, res) =>
  res.render("home", { events: JSON.stringify(events) })
);

const serverListening = () =>
  console.log(`✅ Server running: http://localhost:${PORT}`);

//socketIO에 전달해주기 위해서 server라는 변수를 만듬
const server = app.listen(PORT, serverListening);

const io = socketIO.listen(server); //socketIO가 express server를 붙잡고 있음
//io 라는 변수를 만든이유는 io가 모든 이벤트를 알아야 하기 때문

io.on("connection", socket => socketController(socket, io));
