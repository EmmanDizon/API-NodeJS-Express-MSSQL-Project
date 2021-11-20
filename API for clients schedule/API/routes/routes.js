const express = require('express');
const router = express.Router();
const moment = require('moment');
const Employee = require('../models/employee')
const config = require('../config/database.json')

router.get('/test', async (req, res, next) => {
    res.send("success")
})

router.get('/reposttimelog', async (req, res, next) => {
    let repost = await Employee.getRepost(res.locals.pool)
    let errorDeadLockMessage = ''
    
    let deadlock = repost.recordset
    try{
        for(let x = 0; x < deadlock.length; x++){
            let rec = await Employee.customAPI(res.locals.pool,
                deadlock[x].Date,
                deadlock[x].EmployeeCode,
                deadlock[x].TimeIn,
                deadlock[x].TimeOut,
                deadlock[x].ShiftSched,
                deadlock[x].DayTypeCode
            )
            await Employee.deleteDeadLockRecord(res.locals.pool, deadlock[x].Id)
        }

    }
    catch(err){
        errorDeadLockMessage = err.message
    
    }
 
    res.json(errorDeadLockMessage)
})

router.post('/posttimelogs', async (req, res, next) => {
    let message = []
    let isBlank = function (value) {
        return value === undefined || value === null || value.toString() === "";
    };

    try {
        let params = req.body
        let deadlock = []

        for (let x = 0; x < params.length; x++) {
            const rec = await Employee.customAPI(res.locals.pool,
                params[x].ShiftDate,
                params[x].EmployeeCode,
                params[x].DateTimeIn,
                params[x].DateTimeOut,
                params[x].ShiftCode,
                params[x].DayTypeCode
            )

            if (!isBlank(rec)) {
                var deadlocked = rec.indexOf('deadlocked')

                if (deadlocked > -1) {
                    deadlock.push(params[x])
                }
                    message.push({
                        Success: 'false',
                        Message: rec,
                        ShiftDate: params[x].ShiftDate,
                        TimeIn: params[x].DateTimeIn,
                        TimeOut: params[x].DateTimeOut
                    })
                
            }
            else {
                message.push({
                    Success: 'true',
                    Message: 'Successfully inserted record of employee code ' + params[x].EmployeeCode,
                    ShiftDate: params[x].ShiftDate,
                    TimeIn: params[x].DateTimeIn,
                    TimeOut: params[x].DateTimeOut

                })
            }
        }

        for (let y = 0; y < deadlock.length; y++) {
            let rec = await Employee.insertDeadLockRecords(res.locals.pool,
                deadlock[y].ShiftDate,
                deadlock[y].EmployeeCode,
                deadlock[y].DateTimeIn,
                deadlock[y].DateTimeOut,
                deadlock[y].ShiftCode,
                deadlock[y].DayTypeCode
            )
        }

    } catch (err) {

    }
    res.json({ message: message })
});

module.exports = router