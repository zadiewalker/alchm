// End-to-end tests for journaling workflows
import { test, expect, Page } from '@playwright/test'

// Test utilities for journaling
class JournalingPage {
  constructor(private page: Page) {}

  async navigateToJournals() {
    await this.page.goto('/journals')
    await this.page.waitForLoadState('networkidle')
  }

  async createNewEntry() {
    await this.page.click('[data-testid="new-entry-button"]')
    await this.page.waitForSelector('[data-testid="entry-editor"]')
  }

  async fillEntryForm(data: {
    title?: string
    content: string
    emotion?: string
    mood?: string
    tags?: string[]
    isPrivate?: boolean
  }) {
    if (data.title) {
      await this.page.fill('[data-testid="entry-title-input"]', data.title)
    }
    
    await this.page.fill('[data-testid="entry-content-textarea"]', data.content)
    
    if (data.emotion) {
      await this.page.selectOption('[data-testid="emotion-select"]', data.emotion)
    }
    
    if (data.mood) {
      await this.page.selectOption('[data-testid="mood-select"]', data.mood)
    }
    
    if (data.tags) {
      for (const tag of data.tags) {
        await this.page.fill('[data-testid="tags-input"]', tag)
        await this.page.press('[data-testid="tags-input"]', 'Enter')
      }
    }
    
    if (data.isPrivate !== undefined) {
      const checkbox = this.page.locator('[data-testid="private-checkbox"]')
      if (data.isPrivate) {
        await checkbox.check()
      } else {
        await checkbox.uncheck()
      }
    }
  }

  async saveEntry() {
    await this.page.click('[data-testid="save-entry-button"]')
    await this.page.waitForSelector('[data-testid="save-success-message"]')
  }

  async openEntry(entryTitle: string) {
    await this.page.click(`[data-testid="entry-card"][data-title="${entryTitle}"]`)
    await this.page.waitForSelector('[data-testid="entry-detail"]')
  }

  async editEntry() {
    await this.page.click('[data-testid="edit-entry-button"]')
    await this.page.waitForSelector('[data-testid="entry-editor"]')
  }

  async deleteEntry() {
    await this.page.click('[data-testid="delete-entry-button"]')
    await this.page.click('[data-testid="confirm-delete-button"]')
  }

  async expectEntryExists(title: string) {
    await expect(this.page.locator(`[data-testid="entry-card"][data-title="${title}"]`)).toBeVisible()
  }

  async expectEntryNotExists(title: string) {
    await expect(this.page.locator(`[data-testid="entry-card"][data-title="${title}"]`)).not.toBeVisible()
  }
}

class KheperaPage {
  constructor(private page: Page) {}

  async openKhepera() {
    await this.page.click('[data-testid="khepera-button"]')
    await this.page.waitForSelector('[data-testid="khepera-chat"]')
  }

  async sendMessage(message: string) {
    await this.page.fill('[data-testid="khepera-input"]', message)
    await this.page.click('[data-testid="khepera-send-button"]')
  }

  async expectResponse() {
    await expect(this.page.locator('[data-testid="khepera-response"]')).toBeVisible({ timeout: 15000 })
  }

  async expectCrisisResponse() {
    await this.expectResponse()
    await expect(this.page.locator('[data-testid="khepera-response"]')).toContainText('crisis helpline')
    await expect(this.page.locator('[data-testid="crisis-resources"]')).toBeVisible()
  }
}

// Setup authenticated session
test.beforeEach(async ({ page }) => {
  // Mock authentication
  await page.goto('/login')
  await page.fill('[data-testid="email-input"]', 'test@alchm.app')
  await page.fill('[data-testid="password-input"]', 'testpassword123')
  await page.click('[data-testid="login-button"]')
  await page.waitForURL('**/home')
})

test.describe('Journal Entry Management', () => {
  let journalingPage: JournalingPage

  test.beforeEach(async ({ page }) => {
    journalingPage = new JournalingPage(page)
    await journalingPage.navigateToJournals()
  })

  test('should display journals page correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Journal Entries')
    await expect(page.locator('[data-testid="new-entry-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="entries-list"]')).toBeVisible()
  })

  test('should create a new journal entry', async ({ page }) => {
    await journalingPage.createNewEntry()
    
    const entryData = {
      title: 'My Test Entry',
      content: 'This is a meaningful journal entry about my day. I experienced various emotions and learned something new about myself.',
      emotion: 'hopeful',
      mood: 'positive',
      tags: ['test', 'reflection'],
      isPrivate: true
    }
    
    await journalingPage.fillEntryForm(entryData)
    await journalingPage.saveEntry()
    
    // Should redirect to entries list
    await page.waitForURL('**/journals')
    await journalingPage.expectEntryExists('My Test Entry')
  })

  test('should validate entry content requirements', async ({ page }) => {
    await journalingPage.createNewEntry()
    
    // Try to save without content
    await page.click('[data-testid="save-entry-button"]')
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Content is required')
    
    // Try with very short content
    await journalingPage.fillEntryForm({ content: 'Too short' })
    await page.click('[data-testid="save-entry-button"]')
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Entry must be at least')
  })

  test('should edit an existing entry', async ({ page }) => {
    // First create an entry
    await journalingPage.createNewEntry()
    await journalingPage.fillEntryForm({
      title: 'Original Entry',
      content: 'This is the original content of my journal entry.',
      emotion: 'neutral'
    })
    await journalingPage.saveEntry()
    
    // Then edit it
    await journalingPage.openEntry('Original Entry')
    await journalingPage.editEntry()
    
    await journalingPage.fillEntryForm({
      title: 'Updated Entry',
      content: 'This is the updated content with more meaningful reflections.',
      emotion: 'grateful'
    })
    await journalingPage.saveEntry()
    
    // Verify update
    await journalingPage.expectEntryExists('Updated Entry')
    await journalingPage.expectEntryNotExists('Original Entry')
  })

  test('should delete an entry', async ({ page }) => {
    // Create an entry
    await journalingPage.createNewEntry()
    await journalingPage.fillEntryForm({
      title: 'Entry to Delete',
      content: 'This entry will be deleted.'
    })
    await journalingPage.saveEntry()
    
    // Delete it
    await journalingPage.openEntry('Entry to Delete')
    await journalingPage.deleteEntry()
    
    // Verify deletion
    await page.waitForURL('**/journals')
    await journalingPage.expectEntryNotExists('Entry to Delete')
  })

  test('should filter entries by emotion', async ({ page }) => {
    // Create entries with different emotions
    const entries = [
      { title: 'Happy Entry', content: 'I feel happy today.', emotion: 'happy' },
      { title: 'Sad Entry', content: 'I feel sad today.', emotion: 'sad' },
      { title: 'Anxious Entry', content: 'I feel anxious today.', emotion: 'anxious' }
    ]
    
    for (const entry of entries) {
      await journalingPage.createNewEntry()
      await journalingPage.fillEntryForm(entry)
      await journalingPage.saveEntry()
    }
    
    // Filter by happy emotion
    await page.selectOption('[data-testid="emotion-filter"]', 'happy')
    await page.waitForTimeout(1000)
    
    await journalingPage.expectEntryExists('Happy Entry')
    await journalingPage.expectEntryNotExists('Sad Entry')
    await journalingPage.expectEntryNotExists('Anxious Entry')
  })

  test('should search entries by content', async ({ page }) => {
    // Create entries with different content
    await journalingPage.createNewEntry()
    await journalingPage.fillEntryForm({
      title: 'Work Reflection',
      content: 'Today at work I had an important meeting about the project.'
    })
    await journalingPage.saveEntry()
    
    await journalingPage.createNewEntry()
    await journalingPage.fillEntryForm({
      title: 'Personal Growth',
      content: 'I learned something new about myself through meditation.'
    })
    await journalingPage.saveEntry()
    
    // Search for specific content
    await page.fill('[data-testid="search-input"]', 'work meeting')
    await page.waitForTimeout(1000)
    
    await journalingPage.expectEntryExists('Work Reflection')
    await journalingPage.expectEntryNotExists('Personal Growth')
  })

  test('should handle entry tags', async ({ page }) => {
    await journalingPage.createNewEntry()
    await journalingPage.fillEntryForm({
      title: 'Tagged Entry',
      content: 'This entry has multiple tags.',
      tags: ['work', 'reflection', 'growth']
    })
    await journalingPage.saveEntry()
    
    // Verify tags are displayed
    await journalingPage.openEntry('Tagged Entry')
    await expect(page.locator('[data-testid="entry-tags"]')).toContainText('work')
    await expect(page.locator('[data-testid="entry-tags"]')).toContainText('reflection')
    await expect(page.locator('[data-testid="entry-tags"]')).toContainText('growth')
  })

  test('should respect privacy settings', async ({ page }) => {
    // Create private entry
    await journalingPage.createNewEntry()
    await journalingPage.fillEntryForm({
      title: 'Private Entry',
      content: 'This is my private journal entry.',
      isPrivate: true
    })
    await journalingPage.saveEntry()
    
    // Verify privacy indicator
    await expect(page.locator('[data-testid="entry-card"][data-title="Private Entry"] [data-testid="private-indicator"]')).toBeVisible()
  })
})

test.describe('Khepera AI Integration', () => {
  let kheperaPage: KheperaPage
  let journalingPage: JournalingPage

  test.beforeEach(async ({ page }) => {
    kheperaPage = new KheperaPage(page)
    journalingPage = new JournalingPage(page)
    await journalingPage.navigateToJournals()
  })

  test('should open Khepera chat interface', async ({ page }) => {
    await kheperaPage.openKhepera()
    
    await expect(page.locator('[data-testid="khepera-chat"]')).toBeVisible()
    await expect(page.locator('[data-testid="khepera-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="khepera-send-button"]')).toBeVisible()
  })

  test('should get response from Khepera', async ({ page }) => {
    await kheperaPage.openKhepera()
    
    await kheperaPage.sendMessage('I had a good day today and learned something new about myself.')
    await kheperaPage.expectResponse()
    
    // Response should be trauma-informed
    await expect(page.locator('[data-testid="khepera-response"]')).toContainText(/strength|resilience|growth/i)
  })

  test('should handle crisis intervention', async ({ page }) => {
    await kheperaPage.openKhepera()
    
    await kheperaPage.sendMessage('I feel like hurting myself and nothing matters anymore.')
    await kheperaPage.expectCrisisResponse()
    
    // Should provide crisis resources
    await expect(page.locator('[data-testid="crisis-resources"]')).toContainText('988')
    await expect(page.locator('[data-testid="crisis-resources"]')).toContainText('Crisis Text Line')
  })

  test('should validate input before sending', async ({ page }) => {
    await kheperaPage.openKhepera()
    
    // Try to send empty message
    await page.click('[data-testid="khepera-send-button"]')
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Please enter a message')
    
    // Try to send very short message
    await page.fill('[data-testid="khepera-input"]', 'Hi')
    await page.click('[data-testid="khepera-send-button"]')
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Please provide more detail')
  })

  test('should show typing indicator', async ({ page }) => {
    await kheperaPage.openKhepera()
    
    await kheperaPage.sendMessage('I want to talk about my feelings today.')
    
    // Should show typing indicator while processing
    await expect(page.locator('[data-testid="khepera-typing"]')).toBeVisible()
    
    // Typing indicator should disappear when response arrives
    await kheperaPage.expectResponse()
    await expect(page.locator('[data-testid="khepera-typing"]')).not.toBeVisible()
  })

  test('should suggest reflection prompts', async ({ page }) => {
    await kheperaPage.openKhepera()
    
    await kheperaPage.sendMessage('I need help processing my emotions.')
    await kheperaPage.expectResponse()
    
    // Should provide reflection prompts
    await expect(page.locator('[data-testid="reflection-prompts"]')).toBeVisible()
    
    // Click on a prompt
    await page.click('[data-testid="reflection-prompt"]:first-child')
    
    // Should start new journal entry with prompt
    await expect(page.locator('[data-testid="entry-editor"]')).toBeVisible()
    await expect(page.locator('[data-testid="entry-content-textarea"]')).not.toBeEmpty()
  })

  test('should handle AI service errors gracefully', async ({ page }) => {
    // Mock AI service failure
    await page.route('**/api/khepera', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'AI service unavailable' })
      })
    })
    
    await kheperaPage.openKhepera()
    await kheperaPage.sendMessage('Test message')
    
    // Should show fallback response
    await expect(page.locator('[data-testid="khepera-response"]')).toContainText('I hear you')
    await expect(page.locator('[data-testid="fallback-indicator"]')).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/journals')
    
    // Tab through interface
    await page.press('body', 'Tab')
    await expect(page.locator('[data-testid="new-entry-button"]:focus')).toBeVisible()
    
    await page.press('body', 'Tab')
    await expect(page.locator('[data-testid="search-input"]:focus')).toBeVisible()
    
    // Enter key should work for buttons
    await page.focus('[data-testid="new-entry-button"]')
    await page.press('[data-testid="new-entry-button"]', 'Enter')
    await expect(page.locator('[data-testid="entry-editor"]')).toBeVisible()
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/journals')
    
    // Check for essential ARIA attributes
    await expect(page.locator('[data-testid="new-entry-button"]')).toHaveAttribute('aria-label')
    await expect(page.locator('[data-testid="search-input"]')).toHaveAttribute('aria-label')
    
    // Form fields should have labels
    await page.click('[data-testid="new-entry-button"]')
    await expect(page.locator('[data-testid="entry-content-textarea"]')).toHaveAttribute('aria-label')
  })

  test('should work with screen readers', async ({ page }) => {
    await page.goto('/journals')
    
    // Check for screen reader announcements
    const announcements = []
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('announced')) {
        announcements.push(msg.text())
      }
    })
    
    await page.click('[data-testid="new-entry-button"]')
    
    // Should announce navigation to new entry form
    expect(announcements).toContain('Now editing new journal entry')
  })
})

test.describe('Performance', () => {
  test('should load journals page within performance budget', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/journals')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
  })

  test('should handle large numbers of entries', async ({ page }) => {
    // Mock large dataset
    await page.route('**/api/journals', route => {
      const entries = Array.from({ length: 100 }, (_, i) => ({
        id: `entry-${i}`,
        title: `Entry ${i}`,
        content: `Content for entry ${i}`,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        emotion: 'neutral'
      }))
      
      route.fulfill({
        status: 200,
        body: JSON.stringify({ entries })
      })
    })
    
    await page.goto('/journals')
    await page.waitForLoadState('networkidle')
    
    // Should implement virtualization or pagination
    const visibleEntries = await page.locator('[data-testid="entry-card"]').count()
    expect(visibleEntries).toBeLessThan(50) // Should not render all entries at once
  })
})