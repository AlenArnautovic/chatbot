import { TestBed } from '@angular/core/testing';

import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('METHOD: encrypt(), TARGET: should encode a specific string, OUTCOME: none specific', () => {
    const test123 = 'Test123';
    const result = service.encrypt(test123);
    expect(result).toEqual('Gp6NLGt/h+vgANnRUu7REQ==');
  });

  it('METHOD: decrypt(), TARGET: should encode and decode a specific string, OUTCOME: none specific', () => {
    const test123 = 'Test123';
    const result = service.encrypt(test123);
    const decrypted = service.decrypt(result);
    expect(decrypted).toEqual(test123);
  });
});
