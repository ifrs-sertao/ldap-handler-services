const express = require('express')
const router = express.Router()

const sessionsRoutes = require('./sessions.routes')
const usersRoutes = require('./users.routes')
const groupsRoutes = require('./groups.routes')
const ousRoutes = require('./ous.routes')

const sessionMiddleware = require('../app/middlewares/session')


router.use('/auth', sessionsRoutes)
router.use('/users', sessionMiddleware.auth, usersRoutes)
// router.use('/groups', sessionMiddleware.auth, groupsRoutes)
router.use('/groups', groupsRoutes)

router.use('/ous', sessionMiddleware.auth, ousRoutes)




module.exports = router