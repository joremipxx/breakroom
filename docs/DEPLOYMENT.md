# Deployment Guide - Paradox Breakout Room Manager

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Zoom Marketplace Setup](#zoom-marketplace-setup)
3. [Production Build](#production-build)
4. [Hosting Setup](#hosting-setup)
5. [Environment Configuration](#environment-configuration)
6. [Deployment Steps](#deployment-steps)

## Prerequisites

1. **Zoom Developer Account**
   - Create an account at [Zoom Marketplace](https://marketplace.zoom.us/)
   - Verify your developer account
   - Enable SDK app development

2. **Production Domain**
   - Secure a domain name
   - Set up SSL certificate (required for Zoom Apps)
   - Configure DNS settings

3. **Hosting Service Account**
   Choose one of:
   - Vercel
   - Netlify
   - AWS
   - Google Cloud Platform
   - Heroku

## Zoom Marketplace Setup

1. **Create Production App**
   - Log in to [Zoom Marketplace](https://marketplace.zoom.us/)
   - Navigate to Develop → Create App
   - Select "Zoom Apps" type
   - Fill in the Production App information

2. **Configure App Settings**
   ```json
   {
     "name": "Paradox Breakout Room Manager",
     "type": "Zoom App",
     "deploymentType": "Production",
     "redirectUri": "https://your-domain.com/auth",
     "homePageUrl": "https://your-domain.com"
   }
   ```

3. **Update Scopes**
   - breakoutRoom:read
   - breakoutRoom:write
   - meeting:read
   - meeting:write

4. **Add Production Domain**
   - Add your production domain to allowed domains
   - Configure redirect URLs
   - Add valid OAuth redirect URIs

## Production Build

1. **Prepare Build**
   ```bash
   # Remove development dependencies
   npm prune --production

   # Create production build
   npm run build
   ```

2. **Optimize Assets**
   ```bash
   # Optimize images
   npm run optimize-images

   # Minify CSS/JS
   npm run minify
   ```

3. **Test Production Build**
   ```bash
   # Serve production build locally
   npm run serve
   ```

## Hosting Setup

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   # Login to Vercel
   vercel login

   # Deploy
   vercel --prod
   ```

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy to Netlify**
   ```bash
   # Login to Netlify
   netlify login

   # Deploy
   netlify deploy --prod
   ```

### Option 3: Custom Server

1. **Server Requirements**
   - Node.js 14+
   - HTTPS enabled
   - PM2 or similar process manager

2. **Server Setup**
   ```bash
   # Install PM2
   npm install -g pm2

   # Start application
   pm2 start npm --name "paradox" -- start
   ```

## Environment Configuration

1. **Create Production ENV File**
   ```bash
   # Create production env file
   cp .env.example .env.production
   ```

2. **Update Production Variables**
   ```env
   NODE_ENV=production
   ZOOM_SDK_KEY=your_production_sdk_key
   ZOOM_SDK_SECRET=your_production_secret
   ZOOM_HOST=https://your-domain.com
   ```

3. **Configure Secrets**
   - Add secrets to hosting platform
   - Set up environment variables
   - Configure SSL certificates

## Deployment Steps

1. **Pre-deployment Checklist**
   - [ ] Update version in package.json
   - [ ] Test production build locally
   - [ ] Update API endpoints to production URLs
   - [ ] Verify all environment variables
   - [ ] Check SSL certificate validity

2. **Deploy Application**
   ```bash
   # Create production build
   npm run build

   # Deploy to chosen platform
   npm run deploy
   ```

3. **Post-deployment Verification**
   - [ ] Test OAuth flow
   - [ ] Verify breakout room creation
   - [ ] Check participant management
   - [ ] Test all features in production
   - [ ] Monitor error logging

4. **Update Zoom Marketplace**
   - Update production URLs
   - Submit for review if required
   - Update documentation

## Monitoring and Maintenance

1. **Setup Monitoring**
   - Configure error tracking (e.g., Sentry)
   - Set up performance monitoring
   - Enable usage analytics

2. **Regular Maintenance**
   - Update dependencies monthly
   - Review and rotate API keys
   - Monitor usage metrics
   - Backup configuration

## Troubleshooting

### Common Deployment Issues

1. **OAuth Errors**
   - Verify redirect URIs
   - Check environment variables
   - Validate SSL certificates

2. **API Connection Issues**
   - Verify API endpoints
   - Check CORS settings
   - Validate API keys

3. **Performance Issues**
   - Monitor server resources
   - Check CDN configuration
   - Optimize asset delivery

## Support

For deployment issues:
1. Check deployment logs
2. Review Zoom App documentation
3. Contact Zoom Developer Support
4. Submit issues to repository

## Security Considerations

1. **API Security**
   - Use environment variables
   - Implement rate limiting
   - Enable CORS protection

2. **Data Protection**
   - Encrypt sensitive data
   - Implement secure sessions
   - Regular security audits

3. **Access Control**
   - Implement role-based access
   - Monitor user activities
   - Regular permission audits 