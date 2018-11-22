const
    moment = require('moment'),
    Router = require('express-promise-router'),
    models = require('./models/models_heatmeter'),
    { checkJWT } = require('./libs/auth'),
    libs = require('./libs/functions'),
    router = new Router()


router.get('/heatmeter/setParams', async (req, res) => {
    const h = await libs.execQuery(models.heatmeterGetId, [req.query.sn], global.pool_heatmeter);
    const id_heatmeter = h.rows[0].id;
    if (id_heatmeter > 0) {
        console.log(h.rows[0].id);
        const r = await libs.execQuery(models.heatmeterSetPararams, [0,
            id_heatmeter,
            req.query.power,
            req.query.flow,
            req.query.energy,
            req.query.temp1,
            req.query.temp2,
            moment().format('DD.MM.YYYY'),
            moment().format('hh:mm:ss')
        ],
            global.pool_heatmeter);

        const u = await libs.execQuery(models.hetmeterUpdatePower, [id_heatmeter,
            parseInt(req.query.energy, 10),
            moment().format('DD.MM.YYYY HH:mm:ss')
        ],
            global.pool_heatmeter);

        res.status(200).json({ "status": 200, "error": null, "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": r.rows });

    } else
        res.status(400).json({ "status": 400, "error": "Not find heatmeter: " + req.query.sn, "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": null });
    //console.log(req.query.sn);
    //res.send(req.query.id);
});

router.post('/heatmeter/setParams', async (req, res) => {
    if ((await checkJWT(req.body)).status === 200) {
        const h = await libs.execQuery(models.heatmeterGetId, [req.body.sn], global.pool_heatmeter);
        const id_heatmeter = h.rows[0].id;
        if (id_heatmeter > 0) {
            const r = await libs.execQuery(models.heatmeterSetPararams, [req.body.client_id,
            id_heatmeter,
            req.body.power,
            req.body.flow,
            req.body.energy,
            req.body.temp1,
            req.body.temp2,
            moment().format('DD.MM.YYYY'),
            moment().format('hh:mm:ss')
            ],
            global.pool_heatmeter);

            const u = await libs.execQuery(models.hetmeterUpdatePower, [id_heatmeter,
                parseInt(req.body.energy, 10),
                moment().format('DD.MM.YYYY HH:mm:ss')
            ],
                global.pool_heatmeter);

            res.status(200).json({ "status": 200, "error": null, "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": r.rows });

        } else
            res.status(400).json({ "status": 400, "error": "Not find heatmeter: " + req.body.sn, "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": null });
    } else
        res.status(400).json({ "status": 400, "error": "Bad autorized token", "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": null });
});

router.post('/heatmeter/getHeatmeter', async (req, res) => {
    if ((await checkJWT(req.body)).status === 200) {
        const r = await libs.execQuery(models.heatmeterGetHeatmeterSN, [req.body.sn], global.pool_heatmeter);
        if (r.rows[0].id > 0) {
            res.status(200).json({ "status": 200, "error": null, "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": r.rows });
        } else
            res.status(400).json({ "status": 400, "error": "Not find heatmeter: " + req.body.sn, "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": null });
    }
    else
        res.status(400).json({ "status": 400, "error": "Bad autorized token", "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": null });


});

router.post('/heatmeter/getId', async (req, res) => {

    if ((await checkJWT(req.body)).status === 200) {
        const r = await libs.execQuery(models.heatmeterGetId, [req.body.sn], global.pool_heatmeter);
        res.status(200).json({ "status": 200, "error": null, "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": r.rows });
    }
    else
        res.status(400).json({ "status": 400, "error": "Bad autorized token", "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": null });
});

/*
 * 
 router.post('/payment/byid', async (req, res) => {
    //chech for valid token
    if ((await checkJWT(req.body)).status === 200) {
        if (req.body.payment_id && typeof (req.body.payment_id) === 'number') {
            const r = await libs.execQuery(models.paymentById, [req.body.payment_id], global.pool_payment);
            res.status(200).json({ "status": 200, "error": null, "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": r.rows });
        } else
            res.status(400).json({ "status": 400, "error": "Bad request", "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": null });
    } else
        res.status(400).json({ "status": 400, "error": "Bad autorized token", "timestamp": moment().format('DD.MM.YYYY hh:mm:ss.SSS'), "dataset": null });
});
*/

module.exports = router;
