import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditOffersPage } from './edit-offers.page';

describe('EditOffersPage', () => {
  let component: EditOffersPage;
  let fixture: ComponentFixture<EditOffersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOffersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditOffersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
