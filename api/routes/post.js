import express from 'express';
import { getOneOferta, getAllOfertas, getOneCliente, createPost, getPost, getRandomPost, getUniquePost, getPostHomepage, get6Posts, getMoedas, getAllClients, getAllAnunciantes, getOneAnunciante, getAllPostsAnunciante, aprovarAnunciante, getTransactions } from '../controllers/post.js';
import { checkToken } from "../middleware/tokenValidation.js";

const router = express.Router();

router.post('/', checkToken, createPost);
router.post('/getpost', checkToken, getPost);
router.get('/getpost', checkToken, getRandomPost);
router.post('/getuniquepost', checkToken, getUniquePost);
router.post('/getposthomepage', checkToken, getPostHomepage);
router.post('/get6posts', get6Posts);
router.post('/getmoedas', checkToken, getMoedas)
router.post('/getallclients', checkToken, getAllClients)
router.post('/getonecliente', checkToken, getOneCliente)
router.post('/getallanunciantes', checkToken, getAllAnunciantes)
router.post('/getallofertas', checkToken, getAllOfertas)
router.post('/getoneanunciante', checkToken, getOneAnunciante)
router.post('/getoneoferta', checkToken, getOneOferta)
router.post('/getallpostsanunciante', checkToken, getAllPostsAnunciante)
router.post('/aprovacao', checkToken, aprovarAnunciante)
router.post('/gettransaction', checkToken, getTransactions)

export default router;