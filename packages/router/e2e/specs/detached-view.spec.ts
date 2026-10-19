import { expect, test } from '@playwright/test'

test('pin and restore retain page identity, local input, scroll and route context', async ({
  page,
}) => {
  await page.goto('/detached-view/draft/1?mode=a')
  const section = page.locator('#main section')
  await expect(section).toBeVisible()
  const uid = await section.getAttribute('data-uid')
  await page.getByRole('textbox', { name: 'Draft text' }).fill('unsaved draft')
  await section.evaluate(el => {
    el.scrollTop = 90
  })
  await page.getByRole('button', { name: 'Pin', exact: true }).click()
  const pinned = page.locator('#window section')
  await expect(pinned).toHaveAttribute('data-uid', uid!)
  await expect(pinned.locator('p')).toHaveText('1:a')
  await expect(pinned.locator('input')).toHaveValue('unsaved draft')
  expect(await pinned.evaluate(el => el.scrollTop)).toBe(90)
  await expect(page.locator('#primary p')).toHaveText('2:b')
  await expect(page.locator('#guards')).toBeEmpty()
  await page.getByRole('button', { name: 'Navigate main' }).click()
  await expect(page.locator('#primary p')).toHaveText('3:c')
  await expect(page.locator('#guards')).toHaveText('2,')
  await expect(pinned.locator('p')).toHaveText('1:a')
  await page.getByRole('button', { name: 'Restore' }).click()
  await expect(section).toHaveAttribute('data-uid', uid!)
  await expect(section.locator('input')).toHaveValue('unsaved draft')
  expect(await section.evaluate(el => el.scrollTop)).toBe(90)
  await page.getByRole('button', { name: 'Navigate main' }).click()
  await expect(page.locator('#guards')).toHaveText('2,1,')
})
