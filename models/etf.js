var mongoose = require('mongoose')

var etfSchema = mongoose.Schema({
schemename:String,
type:String,
previousperformance:String,
overallreturns:Number,
fundmanager:String,
fundsize:String,
fundriskometer:String,
aboutscheme:String
})


module.exports = mongoose.model("etf",etfSchema)