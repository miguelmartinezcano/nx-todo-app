import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturePokemon } from './feature-pokemon';

describe('FeaturePokemon', () => {
  let component: FeaturePokemon;
  let fixture: ComponentFixture<FeaturePokemon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePokemon],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePokemon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
