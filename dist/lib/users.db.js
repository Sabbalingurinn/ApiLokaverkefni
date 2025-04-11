"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersDbClient = void 0;
class UsersDbClient {
    constructor(prisma, logger) {
        this.prisma = prisma;
        this.logger = logger;
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existing = yield this.prisma.user.findFirst({
                    where: {
                        OR: [{ email: data.email }, { username: data.username }],
                    },
                });
                if (existing) {
                    return { ok: true, value: { created: false, reason: 'exists', user: existing } };
                }
                const user = yield this.prisma.user.create({ data });
                return { ok: true, value: { created: true, user } };
            }
            catch (error) {
                this.logger.error('createUser error', data, error);
                return { ok: false, error: error };
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.prisma.user.findMany();
                return { ok: true, value: users };
            }
            catch (error) {
                this.logger.error('getAllUsers error', error);
                return { ok: false, error: error };
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.prisma.user.findUnique({ where: { id } });
                return { ok: true, value: user };
            }
            catch (error) {
                this.logger.error('getUserById error', id, error);
                return { ok: false, error: error };
            }
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.prisma.user.findUnique({ where: { username } });
                return { ok: true, value: user };
            }
            catch (error) {
                this.logger.error('getUserByUsername error', username, error);
                return { ok: false, error: error };
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const found = yield this.prisma.user.findUnique({ where: { id } });
                if (!found)
                    return { ok: true, value: false };
                yield this.prisma.user.delete({ where: { id } });
                return { ok: true, value: true };
            }
            catch (error) {
                this.logger.error('deleteUser error', id, error);
                return { ok: false, error: error };
            }
        });
    }
}
exports.UsersDbClient = UsersDbClient;
