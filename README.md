# CondoBot (Meta WhatsApp Cloud API)

Webhook + responder mensajes para condos.

## Setup
1) `npm i`
2) Copia `.env.example` a `.env` y llena los valores
3) `npm run dev`

## Webhook
- GET `/webhook` verifica el endpoint (Meta)
- POST `/webhook` recibe mensajes

## Deploy
Funciona bien en Render, Railway, Fly.io, Heroku (si aplica).
