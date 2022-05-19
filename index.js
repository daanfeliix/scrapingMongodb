import 'dotenv/config';
import Connect from './src/conn/Connect.js';
import Scrap from './src/scrap/Scrap.js';

const connect = new Connect();
const scrap = Scrap(connect);

async function init() {    
    await scrap.server();
}
init();