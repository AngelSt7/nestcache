# @angexxl/hexamod

CLI para generar módulos Java con arquitectura hexagonal en segundos.

## Instalación

```bash
npx @angexxl/hexamod
```

O instalar globalmente:

```bash
npm install -g @angexxl/hexamod
hexamod
```

## Uso

```bash
npx @angexxl/hexamod
```

El CLI te preguntará:
1. **Ruta base** - Ej: `src/main/java/com/tu/proyecto`
2. **Nombre del módulo** - Ej: `user`, `post`, `product`

## Estructura generada

```
moduleName/
├── domain/
│   ├── model/
│   │   └── ModuleModel.java
│   ├── services/
│   │   └── ModuleDomainService.java
│   └── ports/
│       └── repository/
│           └── ModuleRepositoryPort.java
├── application/
│   ├── dto/
│   │   ├── input/
│   │   │   ├── CreateModuleDTO.java
│   │   │   └── UpdateModuleDTO.java
│   │   └── output/
│   │   │   ├── ModuleResponseDTO.java
│   ├── mappers/
│   │   ├── input/
│   │   │   └── ModuleInputMapper.java
│   │   └── output/
│   │       └── ModuleOutputMapper.java
│   └── useCases/
│       └── CreateModuleUseCase.java
└── infrastructure/
    ├── persistence/
    │   ├── entities/
    │   │   └── ModuleEntity.java
    │   ├── repositories/
    │   │   ├── jpa/
    │   │   │   └── JpaModuleRepository.java
    │   │   └── implementation/
    │   │       └── ModuleRepositoryImpl.java
    │   ├── mappers/
    │   │   └── ModuleEntityMapper.java
    │   └── projections/
    │       └── ModuleProjection.java
    └── web/
        └── controllers/
            └── ModuleController.java
```

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npx @angexxl/hexamod` | Ejecutar el CLI |
| `npx @angexxl/hexamod --reset-path` | Borrar ruta guardada |

## Licencia

MIT