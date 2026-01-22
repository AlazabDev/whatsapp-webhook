# WhatsApp platform

## Overview

This repository contains the WhatsApp webhook platform for self-hosted deployments.

## Deployment (self-hosted)

1. Point your domain (for example, `webhook.alazab.com`) to your server and deploy this Next.js app.
2. Set the required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_API_VERSION` (optional, defaults to `v21.0`)
   - `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
   - `WHATSAPP_BUSINESS_ACCOUNT_ID`
   - `NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID`
3. Configure your WhatsApp Business webhook in Meta:
   - Callback URL: `https://webhook.alazab.com/api/webhook`
   - Verify token: set to the same value as `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
   - Alternate callback URLs are also supported for providers that expect them:
     - `https://webhook.alazab.com/webhook`
     - `https://webhook.alazab.com/webhook/whatsapp`
4. Create a Supabase storage bucket named `media` to store incoming attachments (images, audio, documents).

### Production build

1. Install dependencies and build:
   - `pnpm install`
   - `pnpm build`
2. Start the server:
   - `pnpm start`
3. Optional health check endpoint:
   - `GET /api/health`

## How It Works

1. Configure the required environment variables.
2. Deploy the Next.js app to your server.
3. Register the WhatsApp Business webhook in Meta.
4. Store incoming attachments in the Supabase `media` bucket.
