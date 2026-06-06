import { Injectable } from '@angular/core';
import { TranslateService, TranslationObject } from '@ngx-translate/core';
import * as moment from 'moment';
import 'moment/locale/zh-cn';
import englishTranslations from '../../assets/i18n/en.json';

export const availableLanguages = ['en', 'zh'] as const;
export type AvailableLanguage = (typeof availableLanguages)[number];

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private readonly storageKey = 'picsur.language';
  private readonly fallbackLanguage: AvailableLanguage = 'en';

  constructor(private readonly translateService: TranslateService) {}

  initialize(): void {
    this.translateService.addLangs([...availableLanguages]);
    this.translateService.setTranslation(
      this.fallbackLanguage,
      englishTranslations as TranslationObject,
      true,
    );
    this.translateService.setFallbackLang(this.fallbackLanguage);
    
    const initialLang = this.getInitialLanguage();
    this.translateService.use(initialLang);
    this.setMomentLocale(initialLang);
  }

  setLanguage(language: AvailableLanguage): void {
    localStorage.setItem(this.storageKey, language);
    this.translateService.use(language);
    this.setMomentLocale(language);
  }

  getCurrentLanguage(): AvailableLanguage {
    return this.toAvailableLanguage(this.translateService.getCurrentLang());
  }

  private setMomentLocale(language: AvailableLanguage): void {
    if (language === 'zh') {
      moment.locale('zh-cn');
    } else {
      moment.locale(language);
    }
  }

  private getInitialLanguage(): AvailableLanguage {
    const storedLanguage = localStorage.getItem(this.storageKey);
    if (storedLanguage !== null) {
      return this.toAvailableLanguage(storedLanguage);
    }

    return this.toAvailableLanguage(this.translateService.getBrowserLang());
  }

  private toAvailableLanguage(
    language: string | null | undefined,
  ): AvailableLanguage {
    if (!language) return this.fallbackLanguage;

    const langCode = language.split('-')[0].toLowerCase() as AvailableLanguage;
    if (availableLanguages.includes(langCode)) {
      return langCode;
    }

    return this.fallbackLanguage;
  }
}
