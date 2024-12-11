import express from 'express';
import { configExpress } from './config/configExpress.js';
import { connectDb } from './config/configDb.js';
import { router as routes } from './router.js';

const app = express();
const port = 3000;

configExpress(app);

app.use(routes);

app.listen(3000, () => {
    console.log(`Server is listening on port ${port}..`);
    connectDb();
});