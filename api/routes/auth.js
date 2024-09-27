import express from 'express';
import { confirmEmailUsuario, confirmEmailAnunciante, register, login, esqueciSenha, redefinirSenha, refresh, logout, atualizarInformação, atualizarInformaçãoAdm, redefinirSenhaLink, getPublicKey, atualizarOfertaAdm } from "../controllers/auth.js";
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
router.post('/updateoferta', checkToken, atualizarOfertaAdm);
router.post('/updateinformationadm', checkToken, atualizarInformaçãoAdm);
router.post('/redefinir-senha/:token', redefinirSenhaLink);
router.get('/public-key', getPublicKey);
router.post('/confirmar-email-anunciante/:token', confirmEmailAnunciante);
router.post('/confirmar-email-usuario/:token', confirmEmailUsuario);

export default router;