/**
 * @fileoverview Servicio para interactuar con la API pública de KICK
 * @module services/kick
 * @author FerIOX
 * @description Servicios para consumir los diferentes endpoints de KICK API
 * incluyendo información de usuario, canales, chat, moderación, etc.
 */

import axios from 'axios';
import { kick } from '../config/env.js';
import * as logger from '../utils/logger.js';

/**
 * Cliente axios configurado para KICK API
 * @private
 */
const kickApiClient = axios.create({
    baseURL: kick.apiBaseUrl,
    timeout: 10000,
    headers: {
        Accept: 'application/json',
        'User-Agent': 'FerIOX-KickApp/1.0.0',
    },
});

/**
 * Obtiene información del usuario autenticado
 * @async
 * @function getUserInfo
 * @param {string} accessToken - Access token del usuario
 * @returns {Promise<Object>} Información del usuario
 * @throws {Error} Si falla la petición
 * @description Obtiene los datos básicos del usuario desde KICK API
 * Requiere scope: user:read
 * @example
 * const user = await getUserInfo(accessToken);
 * console.log(user.username, user.id);
 */
export async function getUserInfo(accessToken) {
    try {
        logger.debug('Obteniendo información del usuario...');

        const response = await kickApiClient.get('/users', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        logger.info('✅ Información del usuario obtenida exitosamente');
        return response.data;
    } catch (error) {
        logger.error('❌ Error al obtener información del usuario:', {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
        });
        throw error;
    }
}

/**
 * Obtiene información de un canal específico
 * @async
 * @function getChannelInfo
 * @param {string} channelSlug - Slug del canal (username)
 * @param {string} accessToken - Access token del usuario
 * @returns {Promise<Object>} Información del canal
 * @throws {Error} Si falla la petición
 * @description Obtiene metadata del canal incluyendo descripción, categoría, etc.
 * Requiere scope: channel:read
 * @example
 * const channel = await getChannelInfo('feriox', accessToken);
 */
export async function getChannelInfo(channelSlug, accessToken) {
    try {
        logger.debug(`Obteniendo información del canal: ${channelSlug}`);

        const response = await kickApiClient.get(`/channels/${channelSlug}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        logger.info('✅ Información del canal obtenida exitosamente');
        return response.data;
    } catch (error) {
        logger.error('❌ Error al obtener información del canal:', {
            status: error.response?.status,
            channelSlug,
        });
        throw error;
    }
}

/**
 * Obtiene el livestream activo de un canal
 * @async
 * @function getLivestreamInfo
 * @param {string} channelSlug - Slug del canal
 * @param {string} accessToken - Access token del usuario
 * @returns {Promise<Object|null>} Información del livestream o null si no está en vivo
 * @throws {Error} Si falla la petición
 * @description Obtiene metadata del livestream actual si el canal está en vivo
 * @example
 * const stream = await getLivestreamInfo('feriox', accessToken);
 */
export async function getLivestreamInfo(channelSlug, accessToken) {
    try {
        logger.debug(`Obteniendo información del livestream: ${channelSlug}`);

        const response = await kickApiClient.get(`/channels/${channelSlug}/livestream`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        logger.info('✅ Información del livestream obtenida');
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            logger.debug('Canal no está en vivo actualmente');
            return null;
        }
        logger.error('❌ Error al obtener información del livestream:', {
            status: error.response?.status,
        });
        throw error;
    }
}

/**
 * Envía un mensaje al chat de un canal
 * @async
 * @function sendChatMessage
 * @param {string} channelSlug - Slug del canal
 * @param {string} message - Mensaje a enviar
 * @param {string} accessToken - Access token del usuario
 * @returns {Promise<Object>} Respuesta del servidor
 * @throws {Error} Si falla la petición
 * @description Envía un mensaje al chat de un canal
 * Requiere scope: chat:write
 * @example
 * await sendChatMessage('feriox', 'Hola!', accessToken);
 */
export async function sendChatMessage(channelSlug, message, accessToken) {
    try {
        logger.debug(`Enviando mensaje al chat de: ${channelSlug}`);

        const response = await kickApiClient.post(
            `/channels/${channelSlug}/chat/messages`,
            {
                message: message,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        logger.info('✅ Mensaje enviado exitosamente');
        return response.data;
    } catch (error) {
        logger.error('❌ Error al enviar mensaje:', {
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
}

/**
 * Actualiza la metadata del livestream
 * @async
 * @function updateLivestreamMetadata
 * @param {string} channelSlug - Slug del canal
 * @param {Object} metadata - Metadata a actualizar (title, category, etc.)
 * @param {string} accessToken - Access token del usuario
 * @returns {Promise<Object>} Respuesta del servidor
 * @throws {Error} Si falla la petición
 * @description Actualiza información del stream como título, categoría, etc.
 * Requiere scope: channel:write
 * @example
 * await updateLivestreamMetadata('feriox', { title: 'Nuevo título' }, accessToken);
 */
export async function updateLivestreamMetadata(channelSlug, metadata, accessToken) {
    try {
        logger.debug(`Actualizando metadata del livestream: ${channelSlug}`);

        const response = await kickApiClient.patch(`/channels/${channelSlug}/livestream`, metadata, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        logger.info('✅ Metadata actualizada exitosamente');
        return response.data;
    } catch (error) {
        logger.error('❌ Error al actualizar metadata:', {
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
}

/**
 * Obtiene la stream key del canal (SENSIBLE)
 * @async
 * @function getStreamKey
 * @param {string} channelSlug - Slug del canal
 * @param {string} accessToken - Access token del usuario
 * @returns {Promise<Object>} Stream key y configuración
 * @throws {Error} Si falla la petición
 * @description Obtiene la stream key del canal - INFORMACIÓN MUY SENSIBLE
 * Requiere scope: streamkey:read
 * @example
 * const streamKey = await getStreamKey('feriox', accessToken);
 */
export async function getStreamKey(channelSlug, accessToken) {
    try {
        logger.debug(`Obteniendo stream key del canal: ${channelSlug}`);

        const response = await kickApiClient.get(`/channels/${channelSlug}/streamkey`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        logger.warn('⚠️ Stream key obtenida - información muy sensible');
        return response.data;
    } catch (error) {
        logger.error('❌ Error al obtener stream key:', {
            status: error.response?.status,
        });
        throw error;
    }
}

/**
 * Banea a un usuario del canal
 * @async
 * @function banUser
 * @param {string} channelSlug - Slug del canal
 * @param {string} userId - ID del usuario a banear
 * @param {Object} options - Opciones de ban (reason, duration, etc.)
 * @param {string} accessToken - Access token del usuario
 * @returns {Promise<Object>} Respuesta del servidor
 * @throws {Error} Si falla la petición
 * @description Ejecuta un ban de moderación en el canal
 * Requiere scope: moderation:ban
 * @example
 * await banUser('feriox', 'user123', { reason: 'spam' }, accessToken);
 */
export async function banUser(channelSlug, userId, options, accessToken) {
    try {
        logger.debug(`Baneando usuario ${userId} del canal: ${channelSlug}`);

        const response = await kickApiClient.post(
            `/channels/${channelSlug}/moderation/bans`,
            {
                user_id: userId,
                ...options,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        logger.warn('⚠️ Usuario baneado - acción de moderación ejecutada');
        return response.data;
    } catch (error) {
        logger.error('❌ Error al banear usuario:', {
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
}

export default {
    getUserInfo,
    getChannelInfo,
    getLivestreamInfo,
    sendChatMessage,
    updateLivestreamMetadata,
    getStreamKey,
    banUser,
};
