const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Listen for console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  // Catch uncaught exceptions on the page
  page.on('pageerror', error => {
    console.log('PAGE EXCEPTION:', error.message);
  });

  try {
    const url = process.argv[2] || 'http://localhost:4173/login/agent';
    console.log("Navigating to", url);
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Check if our fatal error div exists
    const fatalError = await page.evaluate(() => {
      const el = document.getElementById('app-fatal-error');
      return el ? el.innerText : null;
    });

    if (fatalError) {
      console.log('FOUND FATAL ERROR DIV:', fatalError);
    } else {
      console.log('No fatal error div found.');
      // Print the DOM to see what rendered
      const html = await page.content();
      console.log("HTML starts with:", html.substring(0, 500));
    }
  } catch (err) {
    console.error("Navigation failed:", err);
  } finally {
    await browser.close();
  }
})();
