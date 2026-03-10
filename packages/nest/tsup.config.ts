// packages/nest/tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],    // Point d'entrée
    format: ['cjs', 'esm'],     // Génère les deux formats
    dts: true,                  // Génère les types .d.ts
    splitting: false,           // Un seul fichier de sortie
    clean: true,                // Nettoie dist avant chaque build
    sourcemap: true,            // Sourcemaps pour le debug
    external: [
        /^@nestjs\/.*/,         // Toutes les deps NestJS
        'typeorm',
        'reflect-metadata',
        'rxjs',
        'passport',
        'passport-jwt',
        'bcrypt',
        'resend',
        'class-transformer',
        'class-validator',
        'crypto',
    ],
})