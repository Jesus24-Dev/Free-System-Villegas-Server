# API DTO Corrections - Frontend Guide

**Date:** 2026-07-10
**Commit:** `f08c8a1`

---

## Summary of Changes

This document describes all DTO corrections made to the backend API. These changes affect request/response schemas in Swagger and actual API responses.

---

## Breaking Changes

### 1. Coach - `POST /coach` and `PATCH /coach/:id`

**Before:**
```json
{
  "person_id": "uuid",
  "gym_id": "uuid"  // Required, could not be null
}
```

**After:**
```json
{
  "person_id": "uuid",
  "gym_id": "uuid" | null  // Now optional (nullable)
}
```

`gym_id` is now **optional**. A coach can be created without assigning a gym.

---

### 2. Athlete - `POST /athlete` and `PATCH /athlete/:id`

**Before:**
```json
{
  "person_id": "uuid",
  "gym_id": "uuid"  // Required, could not be null
}
```

**After:**
```json
{
  "person_id": "uuid",
  "gym_id": "uuid" | null  // Now optional (nullable)
}
```

`gym_id` is now **optional**. An athlete can be created without assigning a gym.

---

### 3. User - `POST /user`

**Before:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "role": ["ATHLETE"],
  "person_id": "uuid"  // Had conflicting validators (@IsNotEmpty + @IsOptional)
}
```

**After:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "role": ["ATHLETE"],
  "person_id": "uuid"  // Now properly required (removed @IsOptional)
}
```

---

## New Fields in Responses

### 4. Coach Profile - `GET /coach/:id`, `GET /coach/gym/:gymId/coaches`

**New fields added to response:**
```json
{
  "id": "uuid",
  "person_id": "uuid",        // NEW
  "gym_id": "uuid" | null,   // NEW
  "dni": "12345678",
  "name": "John",
  "surname": "Doe",
  "gender": "MALE",
  "birthday": "1990-01-01",
  "status": true,
  "created_at": "2026-01-01T00:00:00.000Z",  // NEW
  "updated_at": "2026-01-01T00:00:00.000Z"   // NEW
}
```

---

### 5. Athlete Profile - `GET /athlete/:id`, `GET /athlete/gym/:gymId/athletes`

**New fields added to response:**
```json
{
  "id": "uuid",
  "person_id": "uuid",        // NEW
  "gym_id": "uuid" | null,   // NEW
  "dni": "12345678",
  "name": "John",
  "surname": "Doe",
  "gender": "MALE",
  "birthday": "1990-01-01",
  "status": true,
  "created_at": "2026-01-01T00:00:00.000Z",  // NEW
  "updated_at": "2026-01-01T00:00:00.000Z"   // NEW
}
```

---

### 6. Gym - `GET /gym/:id` (Details)

**New field added to response:**
```json
{
  "id": "uuid",
  "name": "Gimnasio Villegas",
  "address": "Calle Falsa 123",
  "state": "DISTRITO_CAPITAL",
  "monthly_payment": 20,      // NEW
  "athletes": [...],
  "coaches": [...],
  "pago_movil": [...]
}
```

---

### 7. Gym - Raw Response

**New fields added:**
```json
{
  "id": "uuid",              // NEW
  "name": "Gimnasio",
  "address": "Address",
  "state": "DISTRITO_CAPITAL",
  "monthly_payment": 20,
  "owner_id": "uuid",
  "created_at": "2026-01-01T00:00:00.000Z",  // NEW
  "updated_at": "2026-01-01T00:00:00.000Z"   // NEW
}
```

---

### 8. Pago Movil - `GET /gym/:gymId/pago-movil`

**New field added:**
```json
{
  "id": "uuid",
  "bank_to_pay": "0102",
  "dni": "V12345678",
  "phone": "04141234567",
  "gym_id": "uuid"           // NEW
}
```

---

### 9. Competition Registration - Division Response

**New field added:**
```json
{
  "division": {
    "mode": "K1",
    "category": "S",
    "gender": "MALE",        // NEW
    "weight": 75
  }
}
```

---

### 10. Registration Response - `GET /competition/:id/registrations`

**Added Swagger documentation (no schema change):**
```json
{
  "id": "uuid",
  "athlete_id": "uuid",
  "division_id": "uuid"
}
```

Fields now have proper `@ApiProperty` decorators and will appear in Swagger UI.

---

## Swagger Enum Fixes

### 11. Competition Division - `mode` field

**Before:** Swagger showed `FightingCategory` values (CH, YC, OC, J, S, M) for the `mode` field.

**After:** Swagger now correctly shows `FightingMode` values:
- `POINT_FIGHTING`
- `KICK_LIGHT`
- `LIGHT_CONTACT`
- `FULL_CONTACT`
- `LOW_KICK`
- `K1`
- `BOXING`

---

## Summary Table

| Endpoint | Change Type | Description |
|----------|-------------|-------------|
| `POST /coach` | Field behavior | `gym_id` now optional |
| `POST /athlete` | Field behavior | `gym_id` now optional |
| `POST /user` | Field behavior | `person_id` properly required |
| `GET /coach/:id` | New fields | `person_id`, `gym_id`, `created_at`, `updated_at` |
| `GET /athlete/:id` | New fields | `person_id`, `gym_id`, `created_at`, `updated_at` |
| `GET /gym/:id` | New field | `monthly_payment` |
| `GET /gym/raw/:id` | New fields | `id`, `created_at`, `updated_at` |
| `GET /gym/:id/pago-movil` | New field | `gym_id` |
| Competition Division | Enum fix | `mode` field shows correct enum |
| Registration Division | New field | `gender` |
| Registration Response | Docs | `@ApiProperty` decorators added |

---

## Frontend Action Items

1. **Update TypeScript interfaces** for Coach, Athlete, Gym, and PagoMovil responses to include new fields
2. **Handle optional `gym_id`** in Coach and Athlete creation forms (allow null/empty)
3. **Update Gym details view** to display `monthly_payment`
4. **Update Competition Division displays** to show `gender` field
5. **Verify Swagger enum values** for Competition Division `mode` field match your code
