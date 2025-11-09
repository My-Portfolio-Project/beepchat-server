"use strict";
const express = require('express');
const router = express.Router();
/**
 *
 * @swagger
 *   /api/v1/message
 * post:
 * summary: Send message
 * tags:[Message]
 * requestBody:
 * required:true
 * content:
 * applcation/json
 * schema:
 * type: object
 * required
 * -userId
 * senderId
 * -message
 * properties:
 * userId:
 * type: string
 * senderId:
 * type: string
 * message:
 * type: string
 * reponses:
 * 200:
 * description: Message send sccessfully
 * 500:
 * internal Sever error
 *
 *
 */
router.post('/');
router.get();
module.exports = router;
