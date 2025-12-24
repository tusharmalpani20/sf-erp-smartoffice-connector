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
const index_cron_1 = require("./cron_job/index.cron");
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.TZ) {
        throw new Error("Timezone must be defined!");
    }
    if (!process.env.DB_HOST ||
        !process.env.DB_PORT ||
        !process.env.DB_USER ||
        !process.env.DB_PASSWORD ||
        !process.env.DB_NAME ||
        !process.env.DB_MAX_POOL) {
        throw new Error("Databse configuration must be defined!");
    }
    if (!process.env.TYPE) {
        throw new Error("Type must be defined!");
    }
    console.log(`Type is ${process.env.TYPE} \n`);
    (0, index_cron_1.index_cron_job_function)(false);
});
start();
