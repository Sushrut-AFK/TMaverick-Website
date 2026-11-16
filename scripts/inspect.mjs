import { chromium } from '@playwright/test';
const browser = await chromium.launch({channel:'chrome'});
const page = await browser.newPage({viewport:{width:360,height:844},reducedMotion:'reduce'});
await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle'});
console.log(await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).map(e=>({tag:e.tagName,cls:e.className,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).filter(e=>e.right>361||e.left< -1).slice(0,60)));
await page.screenshot({path:'test-results/inspect-mobile.png',fullPage:true});
await page.setViewportSize({width:1440,height:900});
await page.screenshot({path:'test-results/inspect-desktop.png'});
await browser.close();
