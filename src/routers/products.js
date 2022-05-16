const express = require('express');
const router = express.Router();
const daoSelection = require('../helpers/daoSelection').productDaoSelection;
const logger = require('../middlewares/logger');
const middlewares = require('../middlewares/authorization');

router.use(logger);

const product = daoSelection();

// Me permite listar todos los productos disponibles -- (usuarios y administradores)
router.get('/',
  middlewares.checkAuthentication,
  async (req, res) => {
    const allProducts = await product.findAll();
    res.status(200).json(allProducts);
  });

// Me permite listar un producto por su id -- (usuarios y administradores)
router.get(
  '/:productId',
  async (req, res) => {
    const { productId } = req.params;
    const oneProduct = await product.find(productId);
    res.status(200).json(oneProduct);
  });

// Para incorporar productos al listado -- (administradores)
router.post('/',
  middlewares.checkAuthorization,
  async (req, res) => {
    const newProduct = await product.create(req.body);
    res.status(201).json(newProduct);
  });

// Actualiza un producto por su id -- (administradores)
router.put('/:productId',
  middlewares.checkAuthorization,
  async (req, res) => {
    const { productId } = req.params;
    const modifiedProduct = await product.update(req.body, productId);
    res.status(200).json(modifiedProduct);
  });

// Borra un producto por su id -- (administradores)
router.delete('/:productId',
  middlewares.checkAuthorization,
  async (req, res) => {
    const { productId } = req.params;
    const deletedProduct = await product.remove(productId);
    res.status(200).json(deletedProduct);
  });

module.exports = router;