import express from 'express';
import { createPost, getPost, getRandomPost, getUniquePost, getPostHomepage, get6Posts, getMoedas, getAllClients, getAllAnunciantes, getOneAnunciante, getAllPostsAnunciante, aprovarAnunciante } from '../controllers/post.js';
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
router.post('/getallanunciantes', checkToken, getAllAnunciantes)
router.post('/getoneanunciante', checkToken, getOneAnunciante)
router.post('/getallpostsanunciante', checkToken, getAllPostsAnunciante)
router.post('/aprovacao', checkToken, aprovarAnunciante)

export default router;