import express from 'express';
import { register, login, esqueciSenha, redefinirSenha, refresh, logout, atualizarInformação, redefinirSenhaLink } from "../controllers/auth.js";
import { checkRefreshToken } from "../middleware/refreshTokenValidation.js";
import { checkToken } from "../middleware/tokenValidation.js";

const router = express.Router();

router.post('/forgotpassword', esqueciSenha);
router.post('/login', login);
router.post('/logout', checkToken, logout);
router.get('/refresh', checkRefreshToken, refresh);
router.post('/register', register);
router.post('/updatepassword', checkToken, redefinirSenha);
router.post('/updateinformation', checkToken, atualizarInformação);
router.post('/redefinir-senha/:token', redefinirSenhaLink);

export default router;