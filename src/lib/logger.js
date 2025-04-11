"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
class ConsoleLogger {
    info(message, ...meta) {
        console.log('[INFO]', message, ...meta);
    }
    error(message, ...meta) {
        console.error('[ERROR]', message, ...meta);
    }
}
exports.ConsoleLogger = ConsoleLogger;
