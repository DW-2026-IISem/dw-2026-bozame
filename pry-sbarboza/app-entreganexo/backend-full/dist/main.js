import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({ origin: '*', credentials: true });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor(), new TimeoutInterceptor());
    const config = new DocumentBuilder()
        .setTitle('EntregaNexo API')
        .setDescription('Marketplace local de última milla')
        .setVersion('2.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT ?? 3002;
    await app.listen(port);
    console.log(`🚀 EntregaNexo corriendo en http://localhost:${port}/api/health`);
}
bootstrap();
//# sourceMappingURL=main.js.map