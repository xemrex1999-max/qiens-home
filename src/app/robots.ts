import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://qienshome.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/dashboard', '/checkout'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
