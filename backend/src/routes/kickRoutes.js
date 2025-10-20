import express from 'express';
import kickService from '../services/kickService.js';

const router = express.Router();

/**
 * GET /api/channels/:username
 * Obtener información de un canal específico
 */
router.get('/channels/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const channel = await kickService.getChannelByUsername(username);
    res.json(channel);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/channels/live
 * Obtener canales en vivo
 */
router.get('/channels/live', async (req, res, next) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    const channels = await kickService.getLiveChannels(
      parseInt(page),
      parseInt(limit)
    );
    res.json(channels);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/search
 * Buscar canales
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        error: 'Se requiere un término de búsqueda (parámetro q)'
      });
    }
    const results = await kickService.searchChannels(q);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/categories
 * Obtener lista de categorías
 */
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await kickService.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/categories/:slug
 * Obtener información de una categoría específica
 */
router.get('/categories/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await kickService.getCategoryBySlug(slug);
    res.json(category);
  } catch (error) {
    next(error);
  }
});

export default router;
