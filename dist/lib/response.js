"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param {Object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {any} [data] - Optional data to include
 * @param {string} [message] - Optional custom message
 * @returns {Object} - Standardized API response
 */
function Response(res, status = 500, data = null, message = '') {
    let defaultMessage = '';
    switch (status) {
        case 200:
            defaultMessage = 'Request successful';
            break;
        case 201:
            defaultMessage = 'Created successfully';
            break;
        case 400:
            defaultMessage = 'Bad request';
            break;
        case 401:
            defaultMessage = 'Unauthorized';
            break;
        case 403:
            defaultMessage = 'Forbidden';
            break;
        case 404:
            defaultMessage = 'Not found';
            break;
        case 500:
            defaultMessage = 'Internal server error';
            break;
        default:
            defaultMessage = 'Unknown status';
    }
    return res.status(status).json({
        success: status < 400,
        message: message || defaultMessage,
        data: data || null,
    });
}
module.exports = Response;
