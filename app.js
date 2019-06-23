import express from 'express';
import bodyParser from 'body-parser' ;
import 'dotenv/config';
import routes from './routes/index';
import cors from 'cors';
import bearerToken from 'express-bearer-token';

const app = express();

app.use(bearerToken());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(cors());

app.use('/uploads', express.static('./uploads'));

//routes
app.use("/", routes);

const port = process.env.PORT || "8000";

app.listen(port, function() {
	console.log(`Server Starts on ${port}`);
});

module.exports = app;