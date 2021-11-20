const db = require('../core/database')

async function deleteDeadLockRecord(pool, Id){
    let error_message = ''
    const transaction = await pool.transaction()
    await transaction.begin()

    try {
        await transaction.request()
            .input('Id', db.sql.NVarChar, Id)
            .query('DELETE FROM tblCustomTeledirectDeadLock WHERE Id = @Id')

        await transaction.commit()
    }
    catch (error) {
        error_message = error.message
        await transaction.rollback()
    }
    finally {
        return error_message
    }

}

async function getRepost(pool) {
    let records = [];
    const transaction = await pool.transaction()
    await transaction.begin()
    try {
        records = await transaction.request()
        .query('SELECT Id, CONVERT(VARCHAR(100), [Date],120) AS [Date], EmployeeCode,  CONVERT(VARCHAR(100), TimeIn,120) AS TimeIn,  CONVERT(VARCHAR(100), [TimeOut],120) AS [TimeOut], ShiftSched, DayTypeCode FROM tblCustomTeledirectDeadLock')
            await transaction.commit()
    }
    catch(err) {

        await transaction.rollback()
    }
    return records
}

async function insertDeadLockRecords(pool, shift_date, employee_code, time_in, time_out, change_shift, day_type_code) {
    let records = []
    let error_message = ''
    const transaction = await pool.transaction()
    await transaction.begin()
    try {
        records = await pool.request()
            .input('Date', db.sql.NVarChar, shift_date)
            .input('EmployeeCode', db.sql.NVarChar, employee_code)
            .input('TimeIn', db.sql.NVarChar, time_in)
            .input('TimeOut', db.sql.NVarChar, time_out)
            .input('ShiftSched', db.sql.NVarChar, change_shift)
            .input('DayTypeCode', db.sql.NVarChar, day_type_code)
            .query('insert into tblCustomTeledirectDeadLock (Date, EmployeeCode, TimeIn, [TimeOut], ShiftSched, DayTypeCode) values (@Date, @EmployeeCode, @TimeIn, @TimeOut, @ShiftSched, @DayTypeCode)')

        await transaction.commit()

    }
    catch (error) {
        error_message = error.message
        await transaction.rollback()
    }
    return error_message

}

async function customAPI(pool, shift_date, employee_code, time_in, time_out, change_shift, day_type_code) {
    let error_message = ''
    const transaction = await pool.transaction()
    await transaction.begin()

    try {
        await transaction.request()
            .input('Date', db.sql.NVarChar, shift_date)
            .input('EmployeeCode', db.sql.NVarChar, employee_code)
            .input('TimeIn', db.sql.NVarChar, time_in)
            .input('TimeOut', db.sql.NVarChar, time_out)
            .input('ChangeShift', db.sql.NVarChar, change_shift)
            .input('DayTypeCode', db.sql.NVarChar, day_type_code)
            .execute('uspESSCustomTeledirectAPIIntegration')

        await transaction.commit()
    }
    catch (error) {
        error_message = error.message
        await transaction.rollback()
    }
    finally {
        return error_message
    }
}

module.exports = {
    customAPI, insertDeadLockRecords, getRepost, deleteDeadLockRecord
}
