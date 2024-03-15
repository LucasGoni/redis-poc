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
const connection_1 = require("./connection");
function testRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        yield connection_1.client.set('key', 'value');
        const value = yield connection_1.client.get('key');
        yield connection_1.client.hSet('user-session:123', {
            name: 'John',
            surname: 'Smith',
            company: 'Redis',
            age: 29
        });
        let userSession = yield connection_1.client.hGetAll('user-session:123');
        console.log(JSON.stringify(userSession, null, 2));
        console.log(JSON.stringify(value));
    });
}
testRedis();
