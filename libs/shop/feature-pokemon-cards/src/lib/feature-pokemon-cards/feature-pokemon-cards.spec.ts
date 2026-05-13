import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturePokemonCards } from './feature-pokemon-cards';

describe('FeaturePokemonCards', () => {
  let component: FeaturePokemonCards;
  let fixture: ComponentFixture<FeaturePokemonCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePokemonCards],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePokemonCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
