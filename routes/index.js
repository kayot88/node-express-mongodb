const express = require('express');

const router = express.Router();
const storeControllers = require('../controllers/storeControllers');
const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');
const {
  catchErrors
} = require('../handlers/errorHandlers.js');
router.get('/stores', catchErrors(storeControllers.getStores));
router.get('/', catchErrors(storeControllers.getStores));
router.get('/add', authControllers.isLoggedIn, storeControllers.addStore);
router.post('/add',
  storeControllers.upload,
  catchErrors(storeControllers.resize),
  catchErrors(storeControllers.createStore)
);

router.post('/add/:id',
  storeControllers.upload,
  catchErrors(storeControllers.resize),
  catchErrors(storeControllers.updateStore));

router.get('/store/:slug', catchErrors(storeControllers.getStoreBySlug));
router.get('/tags', catchErrors(storeControllers.getStoreByTag));
router.get('/tags/:tag', catchErrors(storeControllers.getStoreByTag));

router.post('/add/:id', catchErrors(storeControllers.updateStore));
router.get('/stores/:id/edit', catchErrors(storeControllers.editStore));

router.get('/login', userControllers.loginForm);
router.post('/login', authControllers.login);
router.get("/register", userControllers.registerForm);
router.post("/register", 
userControllers.validateRegister,
catchErrors(userControllers.register),
authControllers.login
);
router.get('/logout', catchErrors(authControllers.logout));

router.get('/account', userControllers.account);
router.post('/account', catchErrors(userControllers.updateAccount));
router.post('/account/forgot', catchErrors(authControllers.forgot));
router.get('/account/reset/:token', catchErrors(authControllers.reset));
router.post('/account/reset/:token', 
authControllers.confirmedPassword,
catchErrors(authControllers.update)
);
/* API
 */
router.get('/api/search', catchErrors(storeControllers.searchStores));


module.exports = router;