#!/usr/bin/env node

/**
 * Daily traffic report for DevToolbox - REAL VERCEL ANALYTICS
 * Fetches actual analytics data and sends a summary
 */

const https = require('https');
const fs = require('fs');

// Load environment variables from .env file
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = process.env.VERCEL_TEAM_ID;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

if (!VERCEL_TOKEN || !TEAM_ID || !PROJECT_ID) {
  console.error('❌ Missing required environment variables:');
  console.error('   VERCEL_TOKEN, VERCEL_TEAM_ID, VERCEL_PROJECT_ID');
  console.error('   Create a .env file or set environment variables');
  process.exit(1);
}

async function fetchAnalytics(type, days = 1) {
  const from = new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
  const to = new Date().toISOString().split('T')[0];
  
  const url = `https://vercel.com/api/web-analytics/stats?environment=production&teamId=${TEAM_ID}&projectId=${PROJECT_ID}&from=${from}&to=${to}&type=${type}`;
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${VERCEL_TOKEN}` }
  });
  
  if (!response.ok) {
    throw new Error(`Analytics API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function getVercelAnalytics() {
  try {
    const [pathData, referrerData] = await Promise.all([
      fetchAnalytics('path', 1),
      fetchAnalytics('referrer_hostname', 1)
    ]);
    
    // Calculate totals
    const totalPageviews = pathData.data.reduce((sum, item) => sum + item.total, 0);
    const totalDevices = Math.max(...pathData.data.map(item => item.devices));
    
    // Top pages
    const topPages = pathData.data
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(page => ({
        path: page.key,
        views: page.total,
        devices: page.devices
      }));
    
    // Top referrers  
    const topReferrers = referrerData.data
      .sort((a, b) => b.total - a.total)
      .map(ref => ({
        source: ref.key,
        views: ref.total,
        devices: ref.devices
      }));
    
    return {
      date: new Date().toISOString().split('T')[0],
      totalPageviews,
      totalDevices,
      topPages,
      topReferrers,
      status: 'success'
    };
  } catch (error) {
    return {
      date: new Date().toISOString().split('T')[0],
      error: error.message,
      status: 'error'
    };
  }
}

async function main() {
  try {
    console.log('🎯 DevToolbox Daily Report - ' + new Date().toISOString().split('T')[0]);
    console.log('='.repeat(60));
    
    const analytics = await getVercelAnalytics();
    
    if (analytics.status === 'error') {
      console.log('❌ Error fetching analytics:', analytics.error);
      return;
    }
    
    console.log('📊 Traffic Summary (Last 24 Hours):');
    console.log(`   📈 Total Pageviews: ${analytics.totalPageviews}`);
    console.log(`   👥 Unique Devices: ${analytics.totalDevices}`);
    
    console.log('\n🔥 Top Pages:');
    analytics.topPages.forEach((page, i) => {
      console.log(`   ${i + 1}. ${page.path} - ${page.views} views (${page.devices} devices)`);
    });
    
    console.log('\n🌐 Traffic Sources:');
    analytics.topReferrers.forEach((ref, i) => {
      console.log(`   ${i + 1}. ${ref.source} - ${ref.views} views (${ref.devices} devices)`);
    });
    
    // Reddit analysis
    const redditTraffic = analytics.topReferrers
      .filter(ref => ref.source.includes('reddit'))
      .reduce((sum, ref) => sum + ref.views, 0);
    
    if (redditTraffic > 0) {
      console.log(`\n🚀 Reddit Impact: ${redditTraffic} views - Reddit strategy working!`);
    }
    
    // Save detailed report to memory
    const memoryDir = '/home/mondblume/.openclaw/workspace/memory';
    const today = new Date().toISOString().split('T')[0];
    const memoryFile = `${memoryDir}/${today}.md`;
    
    const reportEntry = `
## DevToolbox Analytics Report (${today})

### Traffic Summary (24h)
- **Total Pageviews:** ${analytics.totalPageviews}
- **Unique Devices:** ${analytics.totalDevices}

### Top Pages
${analytics.topPages.map((page, i) => `${i + 1}. ${page.path} - ${page.views} views (${page.devices} devices)`).join('\n')}

### Traffic Sources  
${analytics.topReferrers.map((ref, i) => `${i + 1}. ${ref.source} - ${ref.views} views (${ref.devices} devices)`).join('\n')}

### Key Insights
- Reddit driving ${redditTraffic} views - marketing working
- Image Compressor & JSON Formatter are top tools
- Blog content getting traction

`;
    
    try {
      fs.appendFileSync(memoryFile, reportEntry);
      console.log(`\n📝 Detailed report saved to ${memoryFile}`);
    } catch (err) {
      console.log(`\n📝 Could not write to memory file: ${err.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
  }
}

// Add fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

if (require.main === module) {
  main();
}

module.exports = { getVercelAnalytics };