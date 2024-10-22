import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNavListComponent } from './chat-nav-list.component';

describe('ChatNavListComponent', () => {
  let component: ChatNavListComponent;
  let fixture: ComponentFixture<ChatNavListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatNavListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatNavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
