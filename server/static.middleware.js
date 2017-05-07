const express = require('express');
const router = express.Router();
const path = require('path');

const rootPath = path.join(__dirname, '..');
const browserPath = path.join(rootPath, 'browser');
const buildPath = path.join(rootPath, 'public');
const nodeModulesPath = path.join(rootPath, 'node_modules');

router.use(express.static(rootPath));
router.use(express.static(browserPath));
router.use(express.static(buildPath));
router.use(express.static(nodeModulesPath));

module.exports = router;
