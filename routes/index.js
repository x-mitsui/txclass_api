const router = require('koa-router')()

const indexController = require('../controllers/Index')
const loginCheck = require('../middlewares/loginCheck')

router.get('/', indexController.index)
router.get('/get_courses_data', loginCheck, indexController.getCoursesData)
router.get('/update_course_field', loginCheck, indexController.updateCourseField)
module.exports = router
