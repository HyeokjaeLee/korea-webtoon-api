"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const fs = require("fs");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = process.env.PORT || 3000;
    app.enableCors();
    await app.listen(port);
    console.log(`server start (${port})`);
}
bootstrap();
const webtoonData = fs.readFileSync('data/webtoon.json', 'utf8');
console.log(webtoonData);
//# sourceMappingURL=main.js.map