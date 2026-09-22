import { HttpContext } from '@adonisjs/core/http'
import { BaseSerializer } from '@adonisjs/core/transformers'

/**
 * Generic pagination metadata shape. Fill this in yourself when you add
 * a paginated endpoint (e.g. with drizzle's `limit`/`offset` + a `count(*)`
 * query) — it isn't tied to any particular ORM.
 */
interface PaginationMetaData {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
}

/**
 * Custom serializer for API responses that ensures consistent JSON structure
 * across all API endpoints. Wraps response data in a 'data' property.
 */
class ApiSerializer extends BaseSerializer<{
  Wrap: 'data'
  PaginationMetaData: PaginationMetaData
}> {
  wrap: 'data' = 'data'

  definePaginationMetaData(metaData: unknown): PaginationMetaData {
    return metaData as PaginationMetaData
  }
}

const serializer = new ApiSerializer()
const serialize = Object.assign(
  function (this: HttpContext, ...[data, resolver]: Parameters<ApiSerializer['serialize']>) {
    return serializer.serialize(data, resolver ?? this.containerResolver)
  },
  {
    withoutWrapping(
      this: HttpContext,
      ...[data, resolver]: Parameters<ApiSerializer['serializeWithoutWrapping']>
    ) {
      return serializer.serializeWithoutWrapping(data, resolver ?? this.containerResolver)
    },
  }
) as ApiSerializer['serialize'] & { withoutWrapping: ApiSerializer['serializeWithoutWrapping'] }

/**
 * Adds ctx.serialize(data) to every HttpContext for consistent API responses.
 */
HttpContext.instanceProperty('serialize', serialize)

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    serialize: typeof serialize
  }
}
