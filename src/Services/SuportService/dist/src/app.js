"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./models");
const server_1 = __importDefault(require("./server"));
server_1.default.listen(3001, () => {
    console.log(`[SERVER] Running at http://localhost:3001`);
});
//# sourceMappingURL=app.js.map