import puppeteer from 'puppeteer';
import fs from 'fs';

const BRAND_CONFIG = {
  disposables: {
    brands: ['IVG', 'ELF', 'LOST MARY', 'VUSE'],
    url: 'https://ecirette.ie/collections/disposables',
    outputFile: '../src/data/vape-disposables-scraped.json',
  },
  liquids: {
    brands: ['IVG', 'ELF', 'LOST MARY', 'LIQUA', 'HALO'],
    url: 'https://ecirette.ie/collections/e-liquids',
    outputFile: '../src/data/vape-liquids-scraped.json',
  },
};

// Function to scrape vape products from website
async function scrapeVapeProducts(category = 'disposables') {
  const config = BRAND_CONFIG[category];
  if (!config) {
    throw new Error(`Unknown category: ${category}`);
  }

  console.log(`\n=== Scraping ${category.toUpperCase()} ===`);
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Set user agent to avoid blocking, as could be blocked for being automated
  // Open up seperate Chrome page and pretend to be a normal user
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  );

  console.log('Navigating to website...');
  await page.goto(config.url, {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  // Handle age verification popup on website
  console.log('Checking for age verification...');
  try {
    await page.waitForSelector(
      'a[href*="I AM OVER 18"], button:has-text("I AM OVER 18"), a:has-text("I AM OVER 18")',
      { timeout: 3000 },
    );

    await page.click('a, button');

    await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch (_error) {
    console.log('No age verification needed or already verified', _error);
  }

  console.log('Scraping products...');

  let allProducts = [];
  let pageNumber = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    console.log(`Scraping page ${pageNumber}...`);

    // Scroll to load further products if needed
    console.log('Scrolling page to load all products...');

    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Wait for images to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Extract product data from the vproducts displayed, not specific flavours
    const products = await page.evaluate(() => {
      const results = [];
      const seen = new Set();

      // Find all product cards
      const gridItems = document.querySelectorAll('.grid__item, [class*="product-item"]');

      gridItems.forEach((card) => {
        try {
          // Skip if in navigation
          if (card.closest('nav, header, footer, [class*="menu"]')) return;

          // Get product link to check for multiple of same type
          const link = card.querySelector('a[href*="/products/"]');
          if (!link || seen.has(link.href)) return;
          seen.add(link.href);

          // Scrape product name
          const nameEl = card.querySelector(
            '.product-item__title, [class*="product"][class*="title"], h2, h3',
          );
          let name = nameEl?.textContent?.trim() || '';

          // Scrape image URL
          const imgEl = card.querySelector('img');
          const imageUrl =
            imgEl?.src ||
            imgEl?.getAttribute('data-src') ||
            imgEl?.getAttribute('srcset')?.split(' ')[0] ||
            '';

          // Scrape price
          const priceEl = card.querySelector('.price, [class*="price"]');
          const priceText = priceEl?.textContent?.trim() || '';
          const price = priceText.match(/€?[\d.,]+/)?.[0]?.replace('€', '') || '';

          // Clean name
          name = name.replace(/\s+/g, ' ').trim();

          // Only add if we have name and image, image is not a warning
          if (
            name &&
            name.length > 5 &&
            imageUrl &&
            !imageUrl.includes('Nicotine_Warning') &&
            !imageUrl.includes('Mega_Menu')
          ) {
            results.push({ name, imageUrl, price });
          }
        } catch (_error) {
          console.log('Error processing a product card, skipping...', _error);
        }
      });

      return results;
    });

    // Debug for products found
    console.log(`Found ${products.length} products on page ${pageNumber}`);
    allProducts = allProducts.concat(products);

    // Check if there's a 'Next' button and if it's enabled
    const nextButton = await page.evaluate(() => {
      // Look for pagination
      const paginationLinks = Array.from(document.querySelectorAll('a[href*="page="]'));

      // Find the next page link
      for (const link of paginationLinks) {
        const linkText = link.textContent.trim().toLowerCase();
        if (
          linkText.includes('next') ||
          link.getAttribute('aria-label')?.toLowerCase().includes('next')
        ) {
          return { exists: true, href: link.href };
        }
      }

      // Look for numeric pagination if there's no link
      const urlParams = new URLSearchParams(window.location.search);
      const currentPage = parseInt(urlParams.get('page') || '1');

      for (const link of paginationLinks) {
        const linkUrl = new URL(link.href);
        const linkPage = parseInt(linkUrl.searchParams.get('page') || '1');
        if (linkPage === currentPage + 1) {
          return { exists: true, href: link.href };
        }
      }

      return { exists: false };
    });

    // Do move to next page if available
    if (nextButton.exists) {
      console.log('Navigating to next page...');
      await page.goto(nextButton.href, { waitUntil: 'networkidle2', timeout: 30000 });
      pageNumber++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Small delay to ensure page loads
    } else {
      console.log('No more pages found.');
      hasNextPage = false;
    }
  }

  // Close browser once scraping is done
  await browser.close();

  const products = allProducts;

  console.log(`Found ${products.length} products`);

  // Categorize by brand
  const categorized = {};

  // Initialize categories based on config
  config.brands.forEach((brand) => {
    categorized[brand] = [];
  });
  categorized.OTHER = [];

  products.forEach((product) => {
    let assigned = false;
    const upperName = product.name.toUpperCase();

    // Check for ELFBAR and ELF together as same brand
    if (
      upperName.includes('ELFBAR') ||
      upperName.includes('ELF BAR') ||
      upperName.includes('ELF')
    ) {
      if (categorized.ELF) {
        categorized.ELF.push(product);
        assigned = true;
      }
    } else if (upperName.includes('LIQUA')) {
      if (categorized.LIQUA) {
        categorized.LIQUA.push(product);
        assigned = true;
      }
    } else if (upperName.includes('HALO') || upperName.includes('PARTNERS')) {
      if (categorized.HALO) {
        categorized.HALO.push(product);
        assigned = true;
      }
    } else {
      // Check other brands
      for (const brand of config.brands) {
        if (brand !== 'ELF' && brand !== 'LIQUA' && brand !== 'HALO' && upperName.includes(brand)) {
          categorized[brand].push(product);
          assigned = true;
          break;
        }
      }
    }

    if (!assigned) {
      categorized.OTHER.push(product);
    }
  });

  // Save to JSON file
  fs.writeFileSync(config.outputFile, JSON.stringify(categorized, null, 2));

  console.log('\n--- Scraping Results ---');
  config.brands.forEach((brand) => {
    console.log(`${brand}: ${categorized[brand]?.length || 0} products`);
  });
  console.log(`OTHER: ${categorized.OTHER.length} products`);
  console.log(`\nData saved to: ${config.outputFile}`);

  return categorized;
}

// Run scraper for both disposables and liquids
Promise.all([scrapeVapeProducts('disposables'), scrapeVapeProducts('liquids')])
  .then(() => {
    console.log('\nScraping done.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during scraping:', error);
    process.exit(1);
  });
