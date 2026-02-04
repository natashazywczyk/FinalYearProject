import puppeteer from 'puppeteer';
import fs from 'fs';

const BRANDS = [
  'NORDIC SPIRIT',
  'KILLA',
  'VELO',
  'ZYN',
  'CUBA',
  'ICEBERG',
  'HELWIT',
  'APRES',
  'PABLO',
  'PUFF',
];

// Function to scrape nicotine pouch products from website
async function scrapePouchProducts() {
  console.log('\nScraping pouches');
  console.log('Launching browser');
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
  await page.goto('https://snuspal.com/collections/all-brands', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  console.log('Scraping products');

  let allProducts = [];
  let pageNumber = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    console.log(`Scraping page ${pageNumber}`);

    // Scroll to load further products if needed
    console.log('Scrolling page to load all products');
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

    // Extract product data from the products displayed
    const products = await page.evaluate(() => {
      const results = [];
      const seen = new Set();

      // Find all product cards
      const gridItems = document.querySelectorAll('.grid__item, [class*="product"], .product-item');

      gridItems.forEach((card) => {
        try {
          // Skip if in navigation
          if (card.closest('nav, header, footer, [class*="menu"]')) return;

          // Get product link to check for multiple of same type
          const link = card.querySelector('a[href*="/products/"]');
          if (!link || seen.has(link.href)) return;
          seen.add(link.href);

          // Scrape product name from the card
          const nameEl = card.querySelector(
            '.product-item__title, [class*="product"][class*="title"], h2, h3, .card__heading',
          );
          let name = nameEl?.textContent?.trim() || '';

          // Scrape image
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

          // Only add if we have name and image
          if (name && name.length > 3 && imageUrl) {
            results.push({ name, imageUrl, price });
          }
        } catch (_error) {
          console.log('Error with product card:', _error);
        }
      });

      return results;
    });

    console.log(`Found ${products.length} products on page ${pageNumber}`);
    allProducts = allProducts.concat(products);

    // Check if there's a 'Next' button and if it's enabled
    const nextButton = await page.evaluate(() => {
      // Look for pagination
      const paginationLinks = Array.from(
        document.querySelectorAll('a[href*="page="], .pagination a, [class*="pagination"] a'),
      );

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
        if (!link.href) continue;
        const linkUrl = new URL(link.href);
        const linkPage = parseInt(linkUrl.searchParams.get('page') || '1');
        if (linkPage === currentPage + 1) {
          return { exists: true, href: link.href };
        }
      }

      return { exists: false };
    });

    if (nextButton.exists) {
      console.log('Navigating to next page');
      await page.goto(nextButton.href, { waitUntil: 'networkidle2', timeout: 30000 });
      pageNumber++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      console.log('No more pages found.');
      hasNextPage = false;
    }
  }

  await browser.close();

  console.log(`\nFound ${allProducts.length} total products`);

  // Categorize by brand
  const categorized = {};

  // Initialize categories
  BRANDS.forEach((brand) => {
    categorized[brand] = [];
  });
  categorized.OTHER = [];

  allProducts.forEach((product) => {
    let assigned = false;
    const upperName = product.name.toUpperCase();

    // Check each brand
    for (const brand of BRANDS) {
      if (upperName.includes(brand)) {
        categorized[brand].push(product);
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      categorized.OTHER.push(product);
    }
  });

  // Save to JSON scraper file
  const outputPath = '../src/data/pouches-scraped.json';
  fs.writeFileSync(outputPath, JSON.stringify(categorized, null, 2));

  BRANDS.forEach((brand) => {
    console.log(`${brand}: ${categorized[brand]?.length || 0} products`);
  });
  console.log(`OTHER: ${categorized.OTHER.length} products`);
  console.log(`\nData saved to: ${outputPath}`);

  return categorized;
}

scrapePouchProducts()
  .then(() => {
    console.log('\nScraping done.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during scraping:', error);
    process.exit(1);
  });
