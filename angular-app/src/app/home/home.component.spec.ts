import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { UserService } from '../services/user.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj<UserService>('UserService', [
      'getAllUsers',
      'addUser',
      'deleteUser'
    ]);
    userService.getAllUsers.and.returnValue(of([]));
    userService.addUser.and.returnValue(of({
      id: '1',
      firstName: 'Nourane',
      lastName: 'Zouabi'
    }));

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [FormsModule],
      providers: [{ provide: UserService, useValue: userService }]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds the user to the list and clears the form after success', () => {
    component.firstName = '  Nourane ';
    component.lastName = ' Zouabi  ';

    component.addUser();

    expect(userService.addUser).toHaveBeenCalledOnceWith('Nourane', 'Zouabi');
    expect(component.usersList).toEqual([
      { id: '1', firstName: 'Nourane', lastName: 'Zouabi' }
    ]);
    expect(component.firstName).toBe('');
    expect(component.lastName).toBe('');
    expect(component.isAdding).toBeFalse();
  });

  it('shows an error and re-enables the form when adding fails', () => {
    userService.addUser.and.returnValue(throwError(() => new Error('request failed')));
    component.firstName = 'Nourane';
    component.lastName = 'Zouabi';

    component.addUser();

    expect(component.addUserError).toBe('Could not add user. Please try again.');
    expect(component.isAdding).toBeFalse();
    expect(component.usersList).toEqual([]);
  });
});
