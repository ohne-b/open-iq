import { test, expect, type Page } from '@playwright/test';
import { createSession, sections, type Session } from '../src/domain';
import { choiceBank, sequenceTrial, spanTrial } from '../src/content';

async function start(page: Page) {
  await page.goto('./');
  await page.getByRole('link', { name: 'Start test' }).click();
  await page.getByLabel('I’m 18 or older').check();
  await page.getByRole('button', { name: 'Begin assessment' }).click();
  await expect(page.getByRole('heading', { name: 'Matrix reasoning', exact: true })).toBeVisible();
}

function atSection(index: number): Session {
  const session = createSession('keyboard');
  session.sectionIndex = index;
  session.stage = 'running';
  for (const section of sections.slice(0, index)) {
    if (section.kind === 'speed')
      session.speedBlocks.push(
        ...([0, 1] as const).map((block) => ({
          section: section.id as 'comparison' | 'search',
          block,
          durationMs: section.id === 'comparison' ? 90_000 : 60_000,
          interrupted: false,
          responses: [],
        })),
      );
    else
      for (let i = 0; i < section.count; i++)
        session.responses.push({
          section: section.id,
          itemId:
            choiceBank[section.id]?.[i].id ??
            (section.id === 'sequence' ? sequenceTrial(i).id : spanTrial(i).id),
          answer: null,
          elapsedMs: 0,
          status: 'omitted',
        });
  }
  return session;
}

async function seedSession(page: Page, session: Session) {
  await page.goto('./');
  await expect(page.getByRole('link', { name: 'Start test', exact: true })).toBeVisible();
  await page.evaluate(async (record) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('open-iq', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction('sessions', 'readwrite');
        transaction.objectStore('sessions').put(record);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } finally {
      db.close();
    }
  }, session);
  await page.reload();
  await page.goto(`./#/results/${session.id}`);
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible();
}

test('home is centered, uses the supplied logo and has one About link', async ({
  page,
}, testInfo) => {
  await page.goto('./');
  await expect(page.getByRole('link', { name: 'Start test', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About the test', exact: true })).toHaveCount(1);
  const logo = page.locator('.site-name img');
  await expect(logo).toHaveAttribute('src', '/open-iq/brand/open-iq.svg');
  await expect(logo).toHaveJSProperty('naturalWidth', 592);
  const main = page.locator('main');
  await expect(main).not.toContainText('Ten sections exploring');
  await expect(main).not.toContainText('Free. No account.');
  await expect(main).not.toContainText('Allow 60–75 minutes');
  await expect(main).not.toContainText('Ages 18+');
  await expect(main).not.toContainText('English');
  await expect(main).not.toContainText('You’ll receive scores');
  await expect(page.getByLabel('Import a saved assessment')).toHaveCount(0);
  const bounds = await main.boundingBox();
  const viewport = page.viewportSize()!;
  expect(Math.abs(bounds!.x + bounds!.width / 2 - viewport.width / 2)).toBeLessThan(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    viewport.width,
  );
  await page.screenshot({ path: testInfo.outputPath('home.png'), fullPage: true });
});

test('practice, answer, leave and reload preserve progress', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await start(page);
  await expect(page.locator('.section-intro')).not.toContainText('Practice comes first.');
  await page.getByRole('button', { name: 'Try a practice' }).click();
  await page.getByRole('radio', { name: 'Option C', exact: true }).check();
  const selected = page.locator('.option.selected');
  await expect(selected).toHaveCSS('outline-style', 'none');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('radio', { name: 'Option C', exact: true })).toBeFocused();
  await expect(selected).toHaveCSS('outline-width', '3px');
  await expect(selected).toHaveCSS('outline-offset', '-3px');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('That’s right.')).toBeVisible();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Begin section' }).click();
  await expect(page.getByText('1 / 18', { exact: true })).toBeVisible();
  await page.getByRole('radio', { name: 'Option C', exact: true }).check();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('2 / 18', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Save & leave', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Continue test', exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('link', { name: 'Continue test', exact: true }).click();
  await expect(page.getByText('2 / 18', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('a reload cannot replay an active memory sequence', async ({ page }) => {
  const session = atSection(2);
  await seedSession(page, session);
  await page.getByRole('link', { name: 'Continue test' }).click();
  await page.getByRole('button', { name: 'Show sequence' }).click();
  await expect(page.locator('.memory-digit')).toBeVisible();
  await page.reload();
  await expect(page.getByText('2 / 12', { exact: true })).toBeVisible();
  await expect(page.getByText(/previous task was interrupted/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Show sequence' })).toBeVisible();
});

test('exports results and confirms deletion before removing saved data', async ({ page }) => {
  const session = atSection(10);
  session.stage = 'complete';
  await seedSession(page, session);
  await expect(page.getByText('10 of 10 sections completed')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download data' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^open-iq-.*\.json$/);
  await page.getByRole('button', { name: 'Delete this result' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Keep result' }).click();
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete this result' }).click();
  await page.getByRole('button', { name: 'Delete assessment', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Start test' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('link', { name: 'Start test' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Saved assessments' })).toHaveCount(0);
});

test('the same assessment cannot be taken in two tabs', async ({ page, context }) => {
  await start(page);
  const other = await context.newPage();
  await other.goto(page.url());
  await expect(other.getByRole('heading', { name: 'Already open in another tab' })).toBeVisible();
  await other.close();
});

test('the last speed section finishes both rounds and opens the complete report', async ({
  page,
}) => {
  const session = atSection(9);
  await seedSession(page, session);
  await page.getByRole('link', { name: 'Continue test' }).click();
  await page.clock.install();
  for (let round = 0; round < 2; round++) {
    await page.getByRole('button', { name: 'Start round' }).click();
    await expect(page.getByRole('timer')).toBeVisible();
    await page.getByRole('button', { name: 'Present' }).click();
    await page.clock.runFor(60_100);
  }
  await expect(
    page.getByRole('heading', { name: 'You’ve finished the assessment.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'View results' }).click();
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible();
  await expect(page.getByText('10 of 10 sections completed')).toBeVisible();
  await expect(page.getByText('Review answers', { exact: true })).toBeVisible();
});
