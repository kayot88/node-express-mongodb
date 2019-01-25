const express = require('express');
const router = express.Router();
const storeControllers = require('../controllers/storeControllers');
const userControllers = require('../controllers/userControllers');
const reviewControllers = require('../controllers/reviewControllers');
const authControllers = require('../controllers/authControllers');
const {
  catchErrors
} = require('../handlers/errorHandlers.js');
router.get('/stores', catchErrors(storeControllers.getStores));
router.get('/stores/page/:page', catchErrors(storeControllers.getStores));
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
router.get('/map', storeControllers.mapPage);
/* API
 */
router.get('/api/search', catchErrors(storeControllers.searchStores));
router.get('/api/stores/near', catchErrors(storeControllers.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeControllers.heartStore));
router.get('/hearts', authControllers.isLoggedIn, catchErrors(storeControllers.getHearts));
router.post('/review/:id', 
authControllers.isLoggedIn, 
catchErrors(reviewControllers.addReview));
router.get('/top', catchErrors(storeControllers.getTopStores));

module.exports = router;