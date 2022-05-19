import Puppeteer from "puppeteer";


export default function Scrap(mongoDbConnect) {

    let lastId = '';
    let currentId = '';
    let awaitinId = '';


    const crashInit = async (data) => {
        await mongoDbConnect.insert(data);
    }

    const crashComplete = async (data) => {
        await mongoDbConnect.update(data);
    }

    async function _server() {
        const browser = await Puppeteer.launch();
        const page = await browser.newPage();
        page.goto('https://blaze.com/pt/games/crash');

        let data = await page.target().createCDPSession();
        await data.send('Network.enable');
        await data.send('Page.enable');
        data.on('Network.webSocketFrameReceived', _handle);
    }

    const _handle = async (data) => {

        try {
            let request = JSON.parse(data.response.payloadData.substring(2))[1]
            let id = request.id;

            if (id === 'crash.tick' && request.payload.status === 'complete' && request.payload.id !== lastId) {
                lastId = request.payload.id;
                let data = {
                    _id: request.payload.id,
                    crash_point: request.payload.crash_point,
                    end_timestamp: request.payload.updated_at
                }
                crashComplete(data)
            }
            else if (
                id = 'crash.tick' && request.payload.id !== lastId && request.payload.id !== currentId && request.payload.status === 'graphing'
            ) {
                currentId = request.payload.id;
                let data = {
                    _id: request.payload.id,
                    init_timestamp: request.payload.updated_at
                };
                crashInit(data)
            } else if (
                id = 'crash.tick'
                && request.payload.id !== lastId
                && request.payload.id !== awaitinId
                && request.payload.status === 'waiting'
            ) {
                awaitinId = request.payload.id;
                let message = `crash ${request.payload.id} vai começar`
                console.log(message);
            }
        } catch (e) {
            return console.log('-');
        }
    }




    return {
        server:_server
    }
}