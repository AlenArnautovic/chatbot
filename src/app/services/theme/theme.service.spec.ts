import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

/**
 * by Nicolai Haferkamp
 */
describe('ThemeService', () => {
  let service: ThemeService;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    doc = TestBed.inject(DOCUMENT);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('METHOD: switchTheme() and getCurrentTheme(), TARGET: should call element and change theme to value, OUTCOME: getCurrentTheme == test123', () => {
    const mockTheme = 'test123';
    const spy = spyOn(doc, 'getElementById');
    service.switchTheme(mockTheme);
    expect(spy).toHaveBeenCalled();
    expect(service.getCurrentTheme()).toEqual(mockTheme);
  });
});
