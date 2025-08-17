import { ORDERING_CONFIG } from './config'

export interface OrderingParams {
  field: string
  direction: 'asc' | 'desc'
}

export const validateOrdering = (field: string, direction: string): boolean => {
  return ORDERING_CONFIG.ALLOWED_FIELDS.includes(field as (typeof ORDERING_CONFIG.ALLOWED_FIELDS)[number]) && 
         ORDERING_CONFIG.ALLOWED_DIRECTIONS.includes(direction as (typeof ORDERING_CONFIG.ALLOWED_DIRECTIONS)[number])
}

export const getDefaultOrdering = () => ({
  field: ORDERING_CONFIG.DEFAULT_FIELD,
  direction: ORDERING_CONFIG.DEFAULT_DIRECTION
})

export const sanitizeOrdering = (field: string, direction: string) => {
  const validField = ORDERING_CONFIG.ALLOWED_FIELDS.includes(field as (typeof ORDERING_CONFIG.ALLOWED_FIELDS)[number]) ? field : ORDERING_CONFIG.DEFAULT_FIELD
  const validDirection = ORDERING_CONFIG.ALLOWED_DIRECTIONS.includes(direction as (typeof ORDERING_CONFIG.ALLOWED_DIRECTIONS)[number]) ? direction : ORDERING_CONFIG.DEFAULT_DIRECTION
  
  return { field: validField, direction: validDirection }
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
