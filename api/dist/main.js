"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors({
        origin: configService.get("CLIENT_DOMAIN"),
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Shopping List")
        .setDescription("A shopping list API which uses websockets to present live updates")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, document);
    await app.listen(process.env.PORT || 8000);
}
bootstrap();
//# sourceMappingURL=main.js.map