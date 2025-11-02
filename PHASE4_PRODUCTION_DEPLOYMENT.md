# 🚀 Phase 4: Production Deployment & Monitoring - Complete

## Overview

Phase 4 transforms the toilet monitoring application into a production-ready system with comprehensive monitoring, alerting, deployment automation, and performance optimization.

---

## ✅ Implementation Complete

### 1. Health Check Endpoints

**Purpose**: Monitor application health and readiness for load balancers and orchestrators

**Endpoints**:

#### Health Check (`/api/health`)
- **URL**: `GET /api/health`
- **Returns**: Comprehensive health status with checks for:
  - Database connectivity
  - Memory usage
  - Environment variables
  - Application uptime
- **Status Codes**:
  - `200` - Healthy or degraded
  - `503` - Unhealthy
- **Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T12:00:00Z",
  "version": "1.0.0",
  "uptime": 3600,
  "checks": {
    "database": { "status": "pass", "responseTime": 45 },
    "memory": { "status": "pass", "usage": { "percentage": 65 } },
    "environment": { "status": "pass" }
  }
}
```

#### Readiness Check (`/api/health/ready`)
- **URL**: `GET /api/health/ready`
- **Purpose**: Kubernetes readiness probe
- **Returns**: `200` if ready to receive traffic, `503` if not

#### Liveness Check (`/api/health/live`)
- **URL**: `GET /api/health/live`
- **Purpose**: Kubernetes liveness probe
- **Returns**: `200` if process is alive

#### Metrics Endpoint (`/api/metrics`)
- **URL**: `GET /api/metrics`
- **Purpose**: Prometheus-compatible metrics
- **Format**: Prometheus text format
- **Metrics**:
  - Application uptime
  - HTTP request count
  - HTTP error count
  - Node.js memory usage
  - Database record counts

**Usage**:
```typescript
// Health check in monitoring system
fetch('https://app.com/api/health')
  .then(res => res.json())
  .then(health => {
    if (health.status !== 'healthy') {
      alert('Application unhealthy!');
    }
  });
```

---

### 2. Monitoring & Alerting

**Purpose**: Track performance metrics and send alerts for critical issues

**Location**: `src/lib/monitoring/index.ts`

**Features**:

#### Performance Tracking
```typescript
import { trackMetric } from '@/lib/monitoring';

trackMetric({
  name: 'api_response_time',
  value: 234,
  unit: 'ms',
  timestamp: new Date(),
  tags: { endpoint: '/api/inspections' },
});
```

#### Alerting System
```typescript
import { sendAlert } from '@/lib/monitoring';

sendAlert({
  severity: 'critical',
  title: 'Database connection failed',
  message: 'Unable to connect to primary database',
  metadata: { endpoint: 'supabase', retries: 3 },
});
```

#### Database Query Monitoring
```typescript
import { monitorDatabaseQuery } from '@/lib/monitoring';

const inspections = await monitorDatabaseQuery(
  'fetch_inspections',
  () => supabase.from('inspections').select('*')
);
// Automatically tracks duration and alerts on slow queries
```

#### Resource Monitoring
```typescript
import { startResourceMonitoring } from '@/lib/monitoring';

// Start monitoring (in app startup)
startResourceMonitoring(60000); // Check every minute
```

**Alert Integrations**:
- Slack webhooks for critical alerts
- Sentry integration for errors
- Email notifications via Resend
- Custom integration points for PagerDuty, Datadog, etc.

**Alert Thresholds**:
- Memory usage > 90% → Critical alert
- Memory usage > 75% → Warning alert
- Query duration > 1000ms → Warning
- Error spike > 10/hour → Critical alert

---

### 3. Email Notification Service

**Purpose**: Send transactional emails for inspections, alerts, and reports

**Location**: `src/lib/email/index.ts`

**Provider**: Resend API

**Email Types**:

#### Inspection Completed
```typescript
import { sendInspectionCompletedEmail } from '@/lib/email';

await sendInspectionCompletedEmail({
  userEmail: 'user@example.com',
  userName: 'John Doe',
  locationName: 'Floor 1 Toilet A',
  status: 'pass',
  inspectionId: 'insp-123',
});
```

#### Alert Notifications
```typescript
import { sendAlertEmail } from '@/lib/email';

await sendAlertEmail({
  severity: 'critical',
  title: 'High memory usage',
  message: 'Application memory usage at 92%',
  metadata: { heap: '450MB', total: '512MB' },
});
```

#### Weekly Summary
```typescript
import { sendWeeklySummaryEmail } from '@/lib/email';

await sendWeeklySummaryEmail({
  userEmail: 'user@example.com',
  userName: 'John Doe',
  inspectionsCount: 45,
  passRate: 92.5,
  topLocations: [
    { name: 'Floor 1 Toilet A', count: 12 },
    { name: 'Floor 2 Toilet B', count: 10 },
  ],
});
```

#### Password Reset
```typescript
import { sendPasswordResetEmail } from '@/lib/email';

await sendPasswordResetEmail({
  userEmail: 'user@example.com',
  resetToken: 'abc123',
  resetUrl: 'https://app.com/reset-password?token=abc123',
});
```

**Email Templates**: Beautiful HTML emails with:
- Responsive design
- Brand colors
- Status badges
- Metadata tables
- Mobile-friendly layout

---

### 4. Production Caching Strategy

**Purpose**: Multi-layer caching for optimal performance

**Location**: `src/lib/cache/index.ts`

**Architecture**:
- **Layer 1**: In-memory cache (fastest)
- **Layer 2**: Redis cache (distributed)

**Cache Durations**:
```typescript
export const CACHE_DURATION = {
  SHORT: 60,         // 1 minute
  MEDIUM: 300,       // 5 minutes
  LONG: 3600,        // 1 hour
  VERY_LONG: 86400,  // 24 hours
};
```

**Usage**:

#### Basic Caching
```typescript
import { getCached, setCached } from '@/lib/cache';

// Set cache
await setCached('user:123', userData, { ttl: 300 });

// Get cache
const user = await getCached('user:123');
```

#### Get or Set Pattern
```typescript
import { getOrSetCached } from '@/lib/cache';

const inspection = await getOrSetCached(
  'inspection:456',
  () => fetchInspectionFromDB('456'),
  { ttl: 300 }
);
```

#### Cache Patterns
```typescript
import { cachePatterns } from '@/lib/cache';

// Inspection cache
const pattern = cachePatterns.inspection('123');
// { key: 'inspection:123', ttl: 300 }

// List cache
const listPattern = cachePatterns.list('inspections', 1, 'status=pass');
// { key: 'list:inspections:page:1:status=pass', ttl: 60 }
```

#### Cache Invalidation
```typescript
import { invalidateCachePattern, deleteCached } from '@/lib/cache';

// Delete specific key
await deleteCached('inspection:123');

// Delete by pattern
await invalidateCachePattern('inspection:');
// Deletes all inspection caches
```

#### Function Wrapping
```typescript
import { withCache } from '@/lib/cache';

const cachedGetUser = withCache(
  getUserFromDB,
  {
    keyGenerator: (userId) => `user:${userId}`,
    ttl: 300,
  }
);

const user = await cachedGetUser('123'); // Cached automatically
```

**Automatic Cleanup**:
```typescript
import { startMemoryCacheCleanup } from '@/lib/cache';

// Start cleanup (in app startup)
startMemoryCacheCleanup(60000); // Clean every minute
```

---

### 5. Deployment Configuration

**Purpose**: Production-ready containerization and orchestration

**Files Created**:

#### Dockerfile
- **Location**: `Dockerfile`
- **Features**:
  - Multi-stage build for minimal image size
  - Non-root user for security
  - Health check included
  - Optimized layer caching
- **Build**: `docker build -t toilet-monitoring .`
- **Run**: `docker run -p 3000:3000 toilet-monitoring`

#### Docker Compose
- **Location**: `docker-compose.yml`
- **Services**:
  - Next.js application
  - Redis (optional, for local testing)
- **Usage**: `docker-compose up`

#### Kubernetes Deployment
- **Location**: `k8s/deployment.yaml`
- **Features**:
  - 3 replicas for high availability
  - Rolling updates (zero downtime)
  - Resource limits (256Mi-512Mi memory)
  - Liveness, readiness, startup probes
  - Secret management
  - ConfigMap for non-sensitive config
- **Deploy**: `kubectl apply -f k8s/deployment.yaml`

#### Kubernetes Ingress
- **Location**: `k8s/ingress.yaml`
- **Features**:
  - HTTPS redirect
  - SSL/TLS with Let's Encrypt
  - Rate limiting (100 req/min)
  - Request size limit (10MB)
- **Deploy**: `kubectl apply -f k8s/ingress.yaml`

#### Horizontal Pod Autoscaler
- **Location**: `k8s/hpa.yaml`
- **Features**:
  - Auto-scale 3-10 replicas
  - CPU threshold: 70%
  - Memory threshold: 80%
  - Scale-up: aggressive (2 pods/15s)
  - Scale-down: conservative (1 pod/60s)
- **Deploy**: `kubectl apply -f k8s/hpa.yaml`

---

### 6. Database Optimization

**Purpose**: Improve database performance and maintainability

**Location**: `src/lib/database/optimization.ts`

**Features**:

#### Batch Operations
```typescript
import { batchInsert, batchUpdate } from '@/lib/database/optimization';

// Batch insert
await batchInsert(supabase, 'inspections', records, 100);

// Batch update
await batchUpdate(supabase, 'locations', updatedRecords, 50);
```

#### Paginated Queries
```typescript
import { paginatedQuery } from '@/lib/database/optimization';

const allInspections = await paginatedQuery(
  supabase,
  'inspections',
  {
    pageSize: 1000,
    orderBy: 'created_at',
    ascending: false,
    filters: { status: 'pass' },
  }
);
```

#### Archive Old Records
```typescript
import { archiveOldRecords } from '@/lib/database/optimization';

// Archive records older than 365 days
const result = await archiveOldRecords(
  supabase,
  'inspections',
  'inspections_archive',
  365
);
```

#### Table Statistics
```typescript
import { getTableStats } from '@/lib/database/optimization';

const stats = await getTableStats(supabase, 'inspections');
// { count: 12543, oldestRecord: '2024-01-01', newestRecord: '2025-01-01' }
```

#### Query Performance Tracking
```typescript
import { trackQuery, getQueryMetrics } from '@/lib/database/optimization';

trackQuery('fetch_inspections', 234); // duration in ms

const metrics = getQueryMetrics();
// { fetch_inspections: { count: 100, avgTime: 245 } }
```

---

## 📁 File Structure

```
.
├── src/
│   ├── app/api/
│   │   ├── health/
│   │   │   ├── route.ts               # Main health check
│   │   │   ├── ready/route.ts         # Readiness probe
│   │   │   └── live/route.ts          # Liveness probe
│   │   └── metrics/route.ts           # Prometheus metrics
│   └── lib/
│       ├── monitoring/
│       │   └── index.ts               # Monitoring & alerting
│       ├── email/
│       │   └── index.ts               # Email notifications
│       ├── cache/
│       │   └── index.ts               # Caching strategy
│       └── database/
│           └── optimization.ts        # DB optimization
├── k8s/
│   ├── deployment.yaml                # K8s deployment
│   ├── ingress.yaml                   # K8s ingress
│   └── hpa.yaml                       # Autoscaler
├── Dockerfile                         # Production container
├── docker-compose.yml                 # Local development
├── .env.example                       # Updated env vars
└── PHASE4_PRODUCTION_DEPLOYMENT.md    # This file
```

---

## 🔧 Configuration

### Environment Variables

Add to `.env`:
```bash
# Email Notifications
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@toilet-monitoring.com
ADMIN_EMAIL=admin@toilet-monitoring.com

# Monitoring
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
DATADOG_API_KEY=xxxxx

# Logging
LOG_LEVEL=info
```

### Next.js Config

Update `next.config.js` for standalone builds:
```javascript
module.exports = {
  output: 'standalone', // For Docker
  // ... rest of config
};
```

---

## 🚀 Deployment Guide

### Option 1: Vercel (Recommended for MVP)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Option 2: Docker

```bash
# Build
docker build -t toilet-monitoring:latest .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=xxx \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx \
  toilet-monitoring:latest
```

### Option 3: Kubernetes

```bash
# Create secrets
kubectl create secret generic toilet-monitoring-secrets \
  --from-literal=supabase-url=$SUPABASE_URL \
  --from-literal=supabase-anon-key=$SUPABASE_ANON_KEY \
  --from-literal=resend-api-key=$RESEND_API_KEY

# Deploy application
kubectl apply -f k8s/deployment.yaml

# Deploy ingress
kubectl apply -f k8s/ingress.yaml

# Deploy autoscaler
kubectl apply -f k8s/hpa.yaml

# Check status
kubectl get pods
kubectl get svc
kubectl get ingress
```

### Option 4: Docker Compose (Local Testing)

```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down
```

---

## 📊 Monitoring Setup

### 1. Prometheus

Add scrape config:
```yaml
scrape_configs:
  - job_name: 'toilet-monitoring'
    scrape_interval: 30s
    static_configs:
      - targets: ['toilet-monitoring:3000']
    metrics_path: '/api/metrics'
```

### 2. Grafana Dashboard

Import metrics:
- `app_uptime_seconds`
- `http_requests_total`
- `http_errors_total`
- `nodejs_heap_used_bytes`
- `db_inspections_total`

### 3. Slack Alerts

Set webhook URL:
```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
```

Critical alerts automatically sent to Slack.

### 4. Email Alerts

Set Resend API key:
```bash
RESEND_API_KEY=re_xxxxx
ADMIN_EMAIL=admin@example.com
```

Alerts sent to admin email.

---

## 🧪 Testing

### Health Checks

```bash
# Health check
curl http://localhost:3000/api/health

# Readiness
curl http://localhost:3000/api/health/ready

# Liveness
curl http://localhost:3000/api/health/live

# Metrics
curl http://localhost:3000/api/metrics
```

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run - <<EOF
import http from 'k6/http';
export default function() {
  http.get('http://localhost:3000/api/health');
}
EOF
```

### Cache Testing

```typescript
import { getCached, setCached, getCacheStats } from '@/lib/cache';

// Set cache
await setCached('test', { foo: 'bar' }, { ttl: 60 });

// Get cache
const result = await getCached('test');

// Check stats
const stats = await getCacheStats();
console.log(stats);
```

---

## 📈 Performance Optimization

### Implemented Optimizations:

1. **Multi-layer Caching**
   - In-memory cache for hot data
   - Redis for distributed cache
   - Auto-cleanup of expired entries

2. **Database Optimization**
   - Batch inserts/updates
   - Paginated queries
   - Archive old records
   - Query performance tracking

3. **Resource Monitoring**
   - Memory usage tracking
   - Automatic alerts
   - Query duration monitoring
   - Error rate tracking

4. **Horizontal Scaling**
   - Auto-scale 3-10 pods
   - Load balancing
   - Zero-downtime deployments

---

## 🔒 Security

### Production Security Features:

1. **Non-root Container**
   - Runs as user `nextjs:nodejs`
   - UID/GID 1001

2. **Secret Management**
   - Kubernetes secrets for sensitive data
   - Environment variable injection

3. **Rate Limiting**
   - Ingress-level: 100 req/min
   - Application-level: Upstash Redis

4. **Security Headers**
   - Already configured in Phase 2
   - CSP, HSTS, etc.

---

## 📦 Dependencies Added

```json
{
  "dependencies": {
    "resend": "^6.4.0"
  }
}
```

---

## 🎯 Next Steps (Optional)

### 1. APM Integration
- Datadog APM
- New Relic
- Elastic APM

### 2. Log Aggregation
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Datadog Logs
- CloudWatch Logs

### 3. Distributed Tracing
- Jaeger
- Zipkin
- Datadog APM

### 4. Chaos Engineering
- Chaos Mesh
- Gremlin
- Litmus

### 5. Backup Automation
- Automated S3 backups
- Cross-region replication
- Point-in-time recovery

---

## 🐛 Troubleshooting

### Health Check Failing

```bash
# Check logs
kubectl logs -l app=toilet-monitoring

# Check database connectivity
kubectl exec -it deployment/toilet-monitoring -- curl http://localhost:3000/api/health
```

### High Memory Usage

```bash
# Check memory metrics
curl http://localhost:3000/api/metrics | grep memory

# Scale up pods
kubectl scale deployment toilet-monitoring --replicas=5
```

### Cache Not Working

```typescript
import { getCacheStats } from '@/lib/cache';

const stats = await getCacheStats();
console.log('Cache stats:', stats);

// Verify Redis connection
console.log('Redis enabled:', !!redis);
```

### Email Not Sending

```bash
# Verify Resend API key
echo $RESEND_API_KEY

# Check logs
grep "email" logs/*.log
```

---

## ✅ Phase 4 Complete

Phase 4 successfully implements:
- ✅ **Health Checks**: 4 endpoints for monitoring
- ✅ **Monitoring**: Metrics, alerts, and performance tracking
- ✅ **Email Service**: 4 email templates with Resend
- ✅ **Caching**: Multi-layer with Redis and memory
- ✅ **Deployment**: Docker, K8s, and Docker Compose
- ✅ **Database**: Optimization utilities and tracking

The toilet monitoring application is now **fully production-ready** with enterprise-grade monitoring, deployment, and optimization! 🎉

---

**Total Implementation Phases**: 4
- **Phase 1**: Testing, CI/CD, Error Tracking, Logging
- **Phase 2**: Database Backup, Rate Limiting, Security, Realtime, Performance
- **Phase 3**: Analytics, PWA, Accessibility
- **Phase 4**: Health Checks, Monitoring, Email, Caching, Deployment, DB Optimization

**Production Ready**: ✅
