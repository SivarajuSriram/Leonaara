import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner';

const runMock = vi.fn();
vi.mock('vanilla-cookieconsent', () => ({ run: (...args: unknown[]) => runMock(...args) }));
// No mock needed for the `vanilla-cookieconsent/dist/cookieconsent.css` import --
// vitest.config.ts already sets `css: false`, which no-ops every CSS import project-wide.

describe('CookieConsentBanner', () => {
  it('calls run() once on mount with the site categories, cookie name, and English copy', () => {
    render(<CookieConsentBanner />);
    expect(runMock).toHaveBeenCalledTimes(1);
    const config = runMock.mock.calls[0][0];
    expect(config.cookie).toEqual({ name: 'cc_cookie', expiresAfterDays: 182 });
    expect(Object.keys(config.categories)).toEqual(['necessary', 'functionality', 'marketing', 'analytics', 'ads']);
    expect(config.categories.necessary).toEqual({ readOnly: true, enabled: true });
    expect(config.language.default).toBe('en');
    const en = config.language.translations.en;
    expect(en.consentModal.acceptAllBtn).toBe('Accept all');
    expect(en.consentModal.acceptNecessaryBtn).toBe('Reject all');
    expect(en.consentModal.showPreferencesBtn).toBe('Manage preferences');
    expect(en.consentModal.footer).toContain('/cookies/');
    expect(en.consentModal.footer).toContain('/privacy/');
    expect(en.preferencesModal.title).toBe('Consent Preferences Center');
    expect(en.preferencesModal.sections).toHaveLength(6);
    expect(en.preferencesModal.sections[1].linkedCategory).toBe('necessary');
  });
});
