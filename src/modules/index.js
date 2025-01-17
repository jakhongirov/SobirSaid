const express = require("express")
const router = express.Router()

//Middlawares
const { PAYME_CHECK_TOKEN, PAYME_ERROR } = require('../middleware/payme')

// files
const click = require('./click/click')
const payme = require('./payme/payme')

router
   // CLICK
   .post('/click/prepare', click.Prepare)
   .post('/click/complete', click.Complete)

   // PAYME
   .post('/payme', PAYME_CHECK_TOKEN, payme.PAYMENT)

module.exports = router