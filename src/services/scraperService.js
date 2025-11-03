import axios from 'axios'
import * as cheerio from 'cheerio'

/**
 * Web scraper service for vaping products
 * Extracts: image, title, and price from product pages
 */
class VapingProductScraper {
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  }

  /**
   * Scrape a generic product page
   * @param {string} url - The URL to scrape
   * @returns {Promise<Object>} Product data with image, title, and price
   */
  async scrapeProduct(url) {
    try {
      const response = await axios.get(url, { headers: this.headers })
      const $ = cheerio.load(response.data)
      
      // Generic selectors - these may need to be adjusted based on the actual website
      const product = {
        title: this.extractTitle($),
        price: this.extractPrice($),
        image: this.extractImage($, url),
        url: url,
        scrapedAt: new Date().toISOString()
      }
      
      return product
    } catch (error) {
      console.error('Error scraping product:', error.message)
      throw new Error(`Failed to scrape product: ${error.message}`)
    }
  }

  /**
   * Extract product title from the page
   */
  extractTitle($) {
    // Try multiple common selectors for product titles
    const selectors = [
      'h1.product-title',
      'h1[itemprop="name"]',
      '.product-name',
      'h1.product_title',
      'h1',
      'meta[property="og:title"]'
    ]
    
    for (const selector of selectors) {
      let title = $(selector).first().text().trim()
      
      if (!title && selector.includes('meta')) {
        title = $(selector).attr('content')
      }
      
      if (title) {
        return title
      }
    }
    
    return 'Unknown Product'
  }

  /**
   * Extract product price from the page
   */
  extractPrice($) {
    // Try multiple common selectors for product prices
    const selectors = [
      '.price',
      '.product-price',
      '[itemprop="price"]',
      '.sale-price',
      '.amount',
      'span.woocommerce-Price-amount',
      'meta[property="product:price:amount"]'
    ]
    
    for (const selector of selectors) {
      let price = $(selector).first().text().trim()
      
      if (!price && selector.includes('meta')) {
        price = $(selector).attr('content')
      }
      
      if (price) {
        // Clean up price (remove currency symbols, whitespace, etc.)
        price = price.replace(/[^\d.,]/g, '').trim()
        // Validate the price format (should be a valid number)
        if (price && /^\d+([.,]\d{1,2})?$/.test(price)) {
          return price
        }
      }
    }
    
    return 'N/A'
  }

  /**
   * Extract product image from the page
   */
  extractImage($, baseUrl) {
    // Try multiple common selectors for product images
    const selectors = [
      '.product-image img',
      '[itemprop="image"]',
      '.product-main-image img',
      '.woocommerce-product-gallery__image img',
      'meta[property="og:image"]',
      'img[alt*="product"]',
      '.product img'
    ]
    
    for (const selector of selectors) {
      let imgSrc = null
      
      if (selector.includes('meta')) {
        imgSrc = $(selector).attr('content')
      } else {
        const imgElem = $(selector).first()
        imgSrc = imgElem.attr('src') || imgElem.attr('data-src') || imgElem.attr('data-lazy-src')
      }
      
      if (imgSrc) {
        // Convert relative URLs to absolute
        if (imgSrc.startsWith('//')) {
          imgSrc = 'https:' + imgSrc
        } else if (imgSrc.startsWith('/')) {
          const urlObj = new URL(baseUrl)
          imgSrc = urlObj.origin + imgSrc
        }
        
        return imgSrc
      }
    }
    
    return null
  }

  /**
   * Scrape multiple products from a list page
   * @param {string} url - The URL of the product list page
   * @returns {Promise<Array>} Array of product data
   */
  async scrapeProductList(url) {
    try {
      const response = await axios.get(url, { headers: this.headers })
      const $ = cheerio.load(response.data)
      
      const products = []
      
      // Common product item selectors
      const productSelectors = [
        '.product-item',
        '.product',
        'article.product',
        '.product-card'
      ]
      
      let productElements = null
      for (const selector of productSelectors) {
        productElements = $(selector)
        if (productElements.length > 0) break
      }
      
      productElements.each((index, element) => {
        const $elem = $(element)
        
        // Extract title
        let title = $elem.find('h2, h3, .product-title, .product-name').first().text().trim()
        
        // Extract price
        let price = $elem.find('.price, .product-price, .amount').first().text().trim()
        price = price.replace(/[^\d.,]/g, '').trim() || 'N/A'
        
        // Extract image
        let image = $elem.find('img').first().attr('src') || $elem.find('img').first().attr('data-src')
        
        // Extract product link
        let productUrl = $elem.find('a').first().attr('href')
        if (productUrl && productUrl.startsWith('/')) {
          const urlObj = new URL(url)
          productUrl = urlObj.origin + productUrl
        }
        
        if (title || price !== 'N/A' || image) {
          products.push({
            title: title || 'Unknown Product',
            price: price,
            image: image,
            url: productUrl || url,
            scrapedAt: new Date().toISOString()
          })
        }
      })
      
      return products
    } catch (error) {
      console.error('Error scraping product list:', error.message)
      throw new Error(`Failed to scrape product list: ${error.message}`)
    }
  }

  /**
   * Example method to scrape from a demo/sample data
   * This can be used for testing without hitting real websites
   */
  async getMockProducts() {
    return [
      {
        title: 'VUSE ePod 2+ Device Kit',
        price: '9.99',
        image: 'https://via.placeholder.com/300x300?text=VUSE+ePod',
        url: 'https://example.com/product/vuse-epod',
        scrapedAt: new Date().toISOString()
      },
      {
        title: 'JUUL2 Starter Kit',
        price: '14.99',
        image: 'https://via.placeholder.com/300x300?text=JUUL2',
        url: 'https://example.com/product/juul2',
        scrapedAt: new Date().toISOString()
      },
      {
        title: 'Elf Bar 600 Disposable',
        price: '5.99',
        image: 'https://via.placeholder.com/300x300?text=Elf+Bar',
        url: 'https://example.com/product/elf-bar',
        scrapedAt: new Date().toISOString()
      },
      {
        title: 'Vype ePen 3 Kit',
        price: '12.99',
        image: 'https://via.placeholder.com/300x300?text=Vype+ePen',
        url: 'https://example.com/product/vype-epen',
        scrapedAt: new Date().toISOString()
      }
    ]
  }
}

export default new VapingProductScraper()
