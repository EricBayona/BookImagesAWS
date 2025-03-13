import initApp from "./app/index.js";
import { config } from "./config/index.js";

const app = initApp();
const server = app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`server listen on http://0.0.0.0:${config.PORT}`);

})