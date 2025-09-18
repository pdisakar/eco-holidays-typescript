const BASE_URL = `${process.env.CANONICAL_BASE}`
export default function robots(){
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/online-payment', '/booking', '/checkout', '/customize-trip'],
            //disallow: '*'
        },
        sitemap: `${BASE_URL}sitemap.xml`,
      }
}