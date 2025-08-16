import { ORDERING_CONFIG } from './config'

export interface OrderingParams {
  field: string
  direction: 'asc' | 'desc'
}

export function parseOrderingParams(
  orderByParam: string | null,
  orderDirectionParam: string | null
): OrderingParams {
  const field = ORDERING_CONFIG.ALLOWED_FIELDS.includes(
    orderByParam as (typeof ORDERING_CONFIG.ALLOWED_FIELDS)[number]
  ) ? orderByParam! : ORDERING_CONFIG.DEFAULT_FIELD
  
  const direction = ORDERING_CONFIG.ALLOWED_DIRECTIONS.includes(
    orderDirectionParam as (typeof ORDERING_CONFIG.ALLOWED_DIRECTIONS)[number]
  ) ? orderDirectionParam as 'asc' | 'desc' : ORDERING_CONFIG.DEFAULT_DIRECTION
  
  return { field, direction }
}

export function createOrderByClause(field: string, direction: 'asc' | 'desc') {
  return { [field]: direction }
}
