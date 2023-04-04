import homeController from '../controller/homeController';
import userControllder from '../controller/userControllder';
import doctorController from '../controller/doctorController';
import patientController from '../controller/patientController';
import specialtyController from '../controller/specialtyController';
import clinicController from '../controller/clinicController';
import messageController from '../controller/messageController';
import { verifyAccessToken, validationLogginUser, verifyRefreshToken, validatationInfoRegister } from '../middlewares/auth';
import { refreshTokenService } from '../services/jwtService';
import { getDataRedis, setDataRedis } from '../controller/redisController';
import express from 'express';
const router = express.Router();

router.get('/', homeController.homePage);
router.get('/news', homeController.newPage);
router.get('/user', homeController.userPage);
router.get('/crud', homeController.crudPage);
router.post('/crud-stored', homeController.crudStored);
router.get('/editUser', homeController.editUser);
router.patch('/updateUser/:id', homeController.updateUser);
router.get('/deleteUser', homeController.deleteUser);
router.get('/recycle_bin', homeController.restoreUser);

////// Client API////////
router.get('/api/auth/check-exist', userControllder.handleInfoExist);

router.post('/api/register', validatationInfoRegister, userControllder.handleRegister);

router.post('/api/login', validationLogginUser, userControllder.handleLogIn);
router.post('/api/logout', verifyAccessToken, userControllder.handleLogout);
router.get('/api/get-all-users', verifyAccessToken, userControllder.getAllUser);
router.post('/api/create-new-user', userControllder.createUser);
router.put('/api/update-user', userControllder.updateUser);
router.delete('/api/delete-user', userControllder.deleteUser);
router.get('/api/allcode', userControllder.getAllCode);
//

// Token
router.post('/api/refresh-token', verifyRefreshToken, refreshTokenService);

/////////////////  SEARCH  ////////
router.get('/api/searchAll', userControllder.searchAll);

/// API DOCTORS ///////

router.get('/api/top-doctor-home', getDataRedis, doctorController.getTopDoctorHome);
router.get('/api/get-all-doctor', doctorController.getAllDoctor);
router.post('/api/save-infor-personal-doctor', doctorController.postInfoDoctor);
router.get('/api/get-detail-info-doctor', doctorController.getDetailInfoDoctor);
router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
router.get('/api/get-list-patient-booking-medical', doctorController.getListPatientBooingMedical);

router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate);
router.post('/api/complete-confirm-medical', doctorController.completeConfirmMedical);
router.get('/api/feedback-doctor', doctorController.getFeedbackDoctor);

//    PATIENT      ///
router.post('/api/post-info-booking-medical', patientController.postInfoBookingMedical);
router.post('/api/post-info-booking-medical', patientController.postInfoBookingMedical);
router.post('/api/verify-booking-patient', patientController.verifyBookingPatient);
router.post('/api/evaluate-doctor', patientController.evaluateMedicalDoctor);

////////////////// API SPECIALTY //////////////////////

router.get('/api/get-top-specialty', getDataRedis, specialtyController.getTopSpecialty);
router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
router.post('/api/post-or-save-info-specialty', specialtyController.postInfoSpecialty);
router.get('/api/get-specialty-by-id', specialtyController.getSpecialtyById);
router.get('/api/get-info-doctor-belong-specialty-by-province', specialtyController.getInfoDoctorBelongSpecialty);

//////////////// API CLINIC ///////////////////
router.post('/api/post-info-clinic', clinicController.postInfoClinic);
router.get('/api/get-top-clinic-home', getDataRedis, clinicController.getTopClinicHome);
router.get('/api/get-all-clinic', clinicController.getAllClinic);

//////////////// CONVERSATION , MESSAGE API  ///////////////////
router.get('/api/get_all_message', verifyAccessToken, messageController.getMessage);
router.get('/api/get_conversation_doctor', verifyAccessToken, messageController.getAllMessagePatient);
///

module.exports = router;
