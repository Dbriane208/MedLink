import express, {Express} from 'express'

const app: Express = express();

const port: number = 7000;
const host: string = 'localhost'

app.listen(port, host, () => {
    console.log(`✅Server running at http://${host}:${port}🚀🌟`);
});