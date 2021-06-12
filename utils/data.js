module.exports = {
    games: [],
    SECRET: process.env.JWT_SECRET || '82c032e18e19c069f2e323b1772c18ffefff97f9d141816f4e00a26f96cd355086c024cc938854c165076c89766faa5618aed4922b3e51b3491cf9126ff0bd7e',
    url: process.env.MONGODB_URI || 'mongodb://172.24.128.1:27017',
    dbName: process.env.DB_NAME || 'dexter'
}