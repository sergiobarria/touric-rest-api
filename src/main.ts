import {
    ClassSerializerInterceptor,
    RequestMethod,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.setGlobalPrefix('api', {
        exclude: [{ path: 'health', method: RequestMethod.GET }],
    });

    app.enableVersioning({
        type: VersioningType.URI,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strips out properties that are not defined in DTOs
            forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are sent
            transform: true, // Automatically transforms payloads to match DTO types
        }),
    );

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    await app.listen(configService.get<number>('PORT')!);
}

void bootstrap();
