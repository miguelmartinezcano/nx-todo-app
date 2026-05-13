import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturePokemonSet } from './feature-pokemon-set';

describe('FeaturePokemonSet', () => {
  let component: FeaturePokemonSet;
  let fixture: ComponentFixture<FeaturePokemonSet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePokemonSet],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePokemonSet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
