# Welcome to @angexxl/nestcache! In English🚀

This is my second npm package, and it comes to drastically improve what was my first attempt at creating a useful CLI for developers.

`@angexxl/nestcache` was born from a real pain point: integrating a cache system with Redis in NestJS can be more tedious than it should be.

But as usually happens in development…

> "Nothing is difficult until someone finally simplifies it."

But let's stop the chatter and get to the ***important*** stuff.

---

## 📦 Installation

To install this package, simply run:
```bash
npx @angexxl/nestcache
```

---

## 📖 Basic Usage

To use this package we simply use:
```typescript
@Cached(CACHE_KEYS.CARS)
```

### How does it work?

In the `cached.decorator.ts` file, it receives a base key that you'll define in the module configuration file called `cache-keys.ts`. There you can generate all the keys you need, for example:
```typescript
export enum CACHE_KEYS {
    PROPERTIES_ME = 'properties-me',  // for one's properties
    PROPERTIES = "properties"         // for all in general
    // Add your own keys!
}
```

### ⏱️ Predefined TTLs

Likewise, it has TTLs so you don't have to manually write the times in the `ttls.ts` file:
```typescript
export const TTL = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 60 * 5,
  ONE_HOUR: 60 * 60,
  ONE_DAY: 60 * 60 * 24,
  ONE_WEEK: 60 * 60 * 24 * 7,
  ONE_MONTH: 60 * 60 * 24 * 30,
  ONE_YEAR: 60 * 60 * 24 * 365
};
```

They must be defined in that file, which will give you absolute flexibility.

---

## 🔑 Cache Key Generation

We implement the `NestInterceptor` interceptor in `QueryAwareCacheInterceptor` to format cache keys.

### What formatting is achieved?

In our interceptor we consume `CacheUtilsService` which has a sorting method:
```typescript
generateCacheKey(base: CACHE_KEYS, query: Record<string, any>, resourceId?: string) {
    const sortedEntries = Object.entries(query)
        .filter(([_, v]) => v !== undefined && v !== null)
        .sort(([a], [b]) => a.localeCompare(b));
    
    const queryString = sortedEntries
        .map(([k, v]) => `${k.toLowerCase()}=${String(v).toLowerCase()}`)
        .join('&');
    
    const idPart = resourceId ? `/${resourceId}` : '';
    const key = `cache::${base}${idPart}${queryString ? ':' + queryString : ''}`;
    return key;
}
```

So you won't have to worry about sorting filters to get a safe, clean and ordered key. Likewise, it's capable of prioritizing an ID or whatever you send as a dynamic param.

### Final format of cache keys:
```
cache::<base>/<resourceId>:<queryString>
```

Or simply:
```
cache::<base>:<queryString>
```

Depending on the case. And don't worry! It supports more than one param, so there are no problems.

Finally, it checks if the cache exists. If it exists, we return it and that's it. Remember that in case of non-existence, the decorator will take care of caching it by itself through the observable tap.

---

## 👤 Manual Cache per User

Now, this is perfect for a public search engine, right? But how do we cache for each user? And to cache user info?

To cache, in this case the user's properties, we'll apply manual cache.

### Injecting the services:
```typescript
private readonly redisCacheService: RedisCacheService
private readonly cacheUtilsService: CacheUtilsService
```

### Generating the cache key

We activate the manual management service where we now have control:
```typescript
const cacheKey = this.cacheUtilsService.generateCacheKey(
    CACHE_KEYS.PROPERTIES, 
    {}, 
    uuid()
);
```

Remember that `generateCacheKey` receives:
- Your base
- Your params as an object (in this case, `{}`)
- The identifier you want, in my case a uuid

This way, by always positionally prioritizing the third argument, we get a key:
```
cache::<your_base_key>/<their_user_ID>:<yourParams>
```

You understand? It's great! Feel free to organize it as much as you want because all the code will be downloaded for you.

### Getting the cache

But, if that's how we create the cache key..., what's next?

Well, in the following service we get it:
```typescript
const cache = await this.redisCacheService.get(cacheKey);
```

This already gives it to us as JSON, so by applying:
```typescript
if (cache) {
    return cache;
}
```

And it's ready!

### Setting the cache

But what if there's no cache? Well:
```typescript
await this.redisCacheService.set(
    cacheKey, 
    { message: 'Hello world' }, 
    TTL.FIVE_MINUTES
);
```

Where:
- The first argument: the cacheKey
- The second: the object to save
- The third: the TTL you want

Take it from your TTLs and remember you can expand it as much as you want.

Remember that this logic is for whatever you need. With this you can generate cache for each user, always remembering that the third argument of the cachekey is prioritized in case of existence.

---

## 🗑️ Deleting Cache Keys

### Delete by pattern

But now, how do we delete a key?
```typescript
await this.redisCacheService.deleteKeys([
    CACHE_KEYS.CARS
]);
```

Simple, consuming `redisCacheService` (the manual manager), we pass the keys however we want since it will iterate over the format:
```typescript
async deleteKeys(keys: string[]) {
    for (const base of keys) {
        const pattern = `cache::${base}*`;
        const keys = await this.redisService.keys(pattern);
        if (keys.length > 0) {
            await this.redisService.del(...keys);
        }
    }
}
```

### Delete cache for a specific user

But what if I want to delete a user's cache?

Easy:
```typescript
`${CACHE_KEYS.CARS}/<yourUniqueIdentifier>`
```

### Delete multiple keys

Want to delete several? No problem, send it an array and that's it:
```typescript
await this.redisCacheService.deleteKeys([
    CACHE_KEYS.CARS, 
    `${CACHE_KEYS.CARS}/<yourUniqueIdentifier>`
]);
```

---

## 🛠️ CLI Flags

But, are you still having complications? Don't worry, check out all the visualization options.

| Flag | Description | Example |
|------|-------------|---------|
| `--list` | List all keys in Redis | `npx @angexxl/nestcache --list --port 12000` |
| `--get` | Get a specific cache | `npx @angexxl/nestcache --get cache::properties-me --port 12000` |
| `--del` | Delete a specific cache | `npx @angexxl/nestcache --del cache::properties-me --port 12000` |
| `--flush` | Delete all caches | `npx @angexxl/nestcache --flush --port 12000` |

**ALWAYS remember to pass the port where you initially configured it.**

---

## 🐳 Docker Configuration

We manage with Docker. We'll always generate and add (if applicable) this fragment:
```yaml
redis:
  container_name: redis
  image: redis:8
  restart: always
  ports:
    - 12000:6379
  volumes:
    - ${PWD}/redis:/data
```

Remember to run it with `docker compose up -d` and have Docker open.

---

## ⚠️ Possible Issues

### Port error

Port error? Change it post instantiation.

The files to modify are:
- `redis.service.ts`
- The port in Docker

#### In `redis.service.ts`:
```typescript
constructor() {
  super({
    host: 'localhost',
    port: 12000, // Change this value
  });
}
```

#### In the Docker file:
```yaml
ports:
  - <your_port>:6379
```

---

## 💡 Usage Examples

### Automatic cache

Here we cache automatically:
```typescript
@Get()
@Cached(CACHE_KEYS.CARS, TTL.FIVE_MINUTES)
findAll(@Query() query: PaginationCarsDto) {
  return this.carsService.findAll(query);
}
```

### Manual cache

In this quick example we cache manually. You can apply it wherever you want, I put it here out of laziness hahahaha, but it's the logic:
```typescript
@Post('/test')
async test() {
  // To generate cache key
  const cacheKey = this.cacheUtilsService.generateCacheKey(
    CACHE_KEYS.USER, 
    {}, 
    uuid()
  );
  
  // To get
  const cache = await this.redisCacheService.get(cacheKey);
  if (cache) {
    return cache;
  }
  
  // To set the cache
  await this.redisCacheService.set(
    cacheKey, 
    { message: 'Hello world' }, 
    TTL.FIVE_MINUTES
  );
  
  return { message: 'Hello world' };
}
```

This way is ideal for getting a user's objects, as well as a logged-in user's info.

**Remember you're free to modify the code.**

---

## 📞 Contact

If you have any suggestions you can send me a direct message to:

- **Email:** santacruza2000@gmail.com
- **WhatsApp:** +51 960 856 003

I hope you liked my work. Don't hesitate to report any bug or anything that fails.

**Enjoy this!** 🎉


# ¡Bienvenido a @angexxl/nestcache! En Español🚀

Este es mi segundo paquete en npm, y llega para mejorar drásticamente lo que fue mi primer intento de generar un CLI útil para desarrolladores.

`@angexxl/nestcache` nace de un dolor real: integrar un sistema de caché con Redis en NestJS puede ser más tedioso de lo que debería.

Pero como suele pasar en desarrollo…

> "Nada es difícil hasta que alguien finalmente lo simplifica."

Pero dejémonos de habladurías y vamos a lo ***importante***.

---
## 📦 Instalación
Para instalar este paquete, simplemente ejecuta:
```bash
npx @angexxl/nestcache
```
---

---

## 📖 Uso básico

Para el uso de este paquete usamos simplemente:
```typescript
@Cached(CACHE_KEYS.CARS)
```

### ¿Cómo funciona?

En el archivo `cached.decorator.ts` recibe una key base que definirás en el archivo de configuración del módulo llamado `cache-keys.ts`. Ahí puedes generar todas las keys que necesites, por ejemplo:
```typescript
export enum CACHE_KEYS {
    PROPERTIES_ME = 'properties-me',  // para propiedades de uno
    PROPERTIES = "properties"         // para todas en general
    // Añade tus propias keys!
    // Add your own keys!
}
```

### ⏱️ TTLs predefinidos

Así mismo, tiene TTLs para que no estés escribiendo manualmente los tiempos en el archivo `ttls.ts`:
```typescript
export const TTL = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 60 * 5,
  ONE_HOUR: 60 * 60,
  ONE_DAY: 60 * 60 * 24,
  ONE_WEEK: 60 * 60 * 24 * 7,
  ONE_MONTH: 60 * 60 * 24 * 30,
  ONE_YEAR: 60 * 60 * 24 * 365
};
```

Deben ser definidas en ese archivo, lo que te dará una flexibilidad absoluta.

---

## 🔑 Generación de Cache Keys

Implementamos el interceptor `NestInterceptor` en el `QueryAwareCacheInterceptor` para formatear las cache keys.

### ¿Cuál es el formateo que se consigue?

En nuestro interceptor consumimos `CacheUtilsService` que tiene un método de sorteo:
```typescript
generateCacheKey(base: CACHE_KEYS, query: Record<string, any>, resourceId?: string) {
    const sortedEntries = Object.entries(query)
        .filter(([_, v]) => v !== undefined && v !== null)
        .sort(([a], [b]) => a.localeCompare(b));
    
    const queryString = sortedEntries
        .map(([k, v]) => `${k.toLowerCase()}=${String(v).toLowerCase()}`)
        .join('&');
    
    const idPart = resourceId ? `/${resourceId}` : '';
    const key = `cache::${base}${idPart}${queryString ? ':' + queryString : ''}`;
    return key;
}
```

Así que no deberás preocuparte por ordenar filtros para obtener una key segura, limpia y ordenada. Así mismo, es capaz de priorizar un ID o lo que le mandes como param dinámico.

### Formato final de las cache keys:
```
cache::<base>/<resourceId>:<queryString>
```

O simplemente:
```
cache::<base>:<queryString>
```

Dependiendo del caso. ¡Y no te preocupes! Soporta más de un param, así que no hay problemas.

Finalmente, se comprueba si la cache existe. Si existe, la retornamos y listo. Recuerda que en caso de no existencia, el decorador se encargará solito de cachearla por el tab del observable.

---

## 👤 Caché manual por usuario

Ahora bien, esto es perfecto para un buscador público, ¿verdad? Pero, ¿cómo le hacemos para cachear para cada usuario? Y ¿para cachear la info del usuario? 

Para cachear, en este caso las propiedades del usuario, aplicaremos caché manual.

### Inyectando los servicios:
```typescript
private readonly redisCacheService: RedisCacheService
private readonly cacheUtilsService: CacheUtilsService
```

### Generando la cache key

Activamos el servicio de gestión manual donde ahora tenemos el control:
```typescript
const cacheKey = this.cacheUtilsService.generateCacheKey(
    CACHE_KEYS.PROPERTIES, 
    {}, 
    uuid()
);
```

Recuerda que `generateCacheKey` recibe:
- Tu base
- Tus params como objeto (en este caso, `{}`)
- El identificador que desees, en mi caso un uuid

De esta manera, al siempre priorizar posicionalmente el tercer argumento, obtenemos una key:
```
cache::<tu_key_base>/<elID_de_su_usuario>:<tusParams>
```

¿Entiendes? ¡Es genial! Siéntete libre de organizarlo tanto como quieras porque se te descargará todo el código.

### Obteniendo la caché

Pero, si así creamos la cache key..., ¿qué sigue?

Pues en el siguiente servicio la obtenemos:
```typescript
const cache = await this.redisCacheService.get(cacheKey);
```

Este ya nos la da como JSON, así que aplicando:
```typescript
if (cache) {
    return cache;
}
```

¡Y ya está lista!

### Seteando la caché

Pero, ¿y si no hay cache? Pues:
```typescript
await this.redisCacheService.set(
    cacheKey, 
    { message: 'Hello world' }, 
    TTL.FIVE_MINUTES
);
```

Siendo:
- El primer argumento: la cacheKey
- El segundo: el objeto a guardar
- El tercero: el TTL que desees

Tómalo de tus TTLs y recuerda que puedes expandirlo tanto como quieras.

Recuerda que esta lógica es para lo que necesites. Con esto puedes generarle la cache a cada usuario, siempre recordando que el tercer argumento de la cachekey es el priorizado en caso de existencia.

---

## 🗑️ Eliminando cache keys

### Eliminar por patrón

Pero ahora, ¿cómo borramos una key?
```typescript
await this.redisCacheService.deleteKeys([
    CACHE_KEYS.CARS
]);
```

Sencillo, consumiendo `redisCacheService` (el gestor manual), pasamos las keys como queramos ya que iterará sobre el formato:
```typescript
async deleteKeys(keys: string[]) {
    for (const base of keys) {
        const pattern = `cache::${base}*`;
        const keys = await this.redisService.keys(pattern);
        if (keys.length > 0) {
            await this.redisService.del(...keys);
        }
    }
}
```

### Eliminar cache de un usuario específico

Pero, ¿y si quiero borrar la cache de un usuario? 

Fácil:
```typescript
`${CACHE_KEYS.CARS}/<tuIdentificadorUnico>`
```

### Eliminar múltiples keys

¿Quieres borrar varias? No hay problema, mándale un array y listo:
```typescript
await this.redisCacheService.deleteKeys([
    CACHE_KEYS.CARS, 
    `${CACHE_KEYS.CARS}/<tuIdentificadorUnico>`
]);
```

---

## 🛠️ Flags de CLI

Pero, ¿aún así tienes complicaciones? No te preocupes, mira todas las opciones de visualización.

| Flag | Descripción | Ejemplo |
|------|-------------|---------|
| `--list` | Listar todas las keys en Redis | `npx @angexxl/nestcache --list --port 12000` |
| `--get` | Obtener una cache específica | `npx @angexxl/nestcache --get cache::properties-me --port 12000` |
| `--del` | Borrar una cache específica | `npx @angexxl/nestcache --del cache::properties-me --port 12000` |
| `--flush` | Borrar todas las caches | `npx @angexxl/nestcache --flush --port 12000` |

**Recuerda SIEMPRE pasarle el puerto donde configuraste inicialmente.**

---

## 🐳 Configuración de Docker

Nosotros gestionamos con Docker. Siempre te generaremos y añadiremos (sea el caso) este fragmento:
```yaml
redis:
  container_name: redis
  image: redis:8
  restart: always
  ports:
    - 12000:6379
  volumes:
    - ${PWD}/redis:/data
```

Recuerda correrlo con `docker compose up -d` y tener Docker abierto.

---

## ⚠️ Problemas posibles

### Error de puerto

¿Error de puerto? Cámbialo post instanciación.

Los archivos a modificar son:
- `redis.service.ts`
- El puerto en Docker

#### En `redis.service.ts`:
```typescript
constructor() {
  super({
    host: 'localhost',
    port: 12000, // Cambia este valor
  });
}
```

#### En el archivo Docker:
```yaml
ports:
  - <tu_puerto>:6379
```

---

## 💡 Ejemplos de uso

### Caché automático

Acá cacheamos en automático:
```typescript
@Get()
@Cached(CACHE_KEYS.CARS, TTL.FIVE_MINUTES)
findAll(@Query() query: PaginationCarsDto) {
  return this.carsService.findAll(query);
}
```

### Caché manual

En este ejemplo rápido cacheamos manualmente. Puedes aplicarlo donde quieras, lo puse acá por flojera jajajaj, pero es la lógica:
```typescript
@Post('/test')
async test() {
  // Para generar cache key
  const cacheKey = this.cacheUtilsService.generateCacheKey(
    CACHE_KEYS.USER, 
    {}, 
    uuid()
  );
  
  // Para obtener
  const cache = await this.redisCacheService.get(cacheKey);
  if (cache) {
    return cache;
  }
  
  // Para setear la cache
  await this.redisCacheService.set(
    cacheKey, 
    { message: 'Hello world' }, 
    TTL.FIVE_MINUTES
  );
  
  return { message: 'Hello world' };
}
```

Esta forma es ideal para obtener los objetos de un usuario, así como también la info de un usuario logeado.

**Recuerda que eres libre de modificar el código.**

---

## 📞 Contacto

Si tienes alguna sugerencia puedes mandarme un mensaje directo a:

- **Email:** santacruza2000@gmail.com
- **WhatsApp:** +51 960 856 003

Espero te haya gustado mi trabajo. Cualquier bug o cosa que falle no duden en reportarla.

**¡Que disfruten esto!** 🎉