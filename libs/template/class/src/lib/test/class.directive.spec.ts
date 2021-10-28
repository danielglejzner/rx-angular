import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClassDirective } from '@rx-angular/template/class';
import { BehaviorSubject, of } from 'rxjs';

@Component({
  selector: 'rx-test-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="container-one"
      [rxClass]="containerOneClasses$"
      [rxClassStrategy]="'native'"
    ></div>
    <div class="container-two" [rxClass]="containerTwoClasses$"></div>
    <div
      class="container-three"
      [rxClass]="{
        'class-one': setClassOne$,
        'class-two': setClassTwo$
      }"
      [rxClassStrategy]="'native'"
    ></div>
    <div
      class="container-four"
      [rxClass]="containerFourClasses$"
      [rxClassStrategy]="'native'"
    ></div>
    <div
      class="container-five"
      [rxClass]="containerFiveClasses$"
      [rxClassStrategy]="'native'"
    ></div>
    <div
      class="container-six"
      [rxClass]="containerSixClass$"
      [rxClassStrategy]="'native'"
    ></div>
  `,
})
class TestComponent {
  readonly containerOneClasses$ = of({
    'class-one': true,
    'class-two': true,
  });
  readonly containerTwoClasses$ = of(['class-one', 'class-two']);
  readonly containerFourClasses$ = new BehaviorSubject<string[]>([
    'class-one',
    'class-two',
  ]);
  readonly containerFiveClasses$ = new BehaviorSubject<Set<string>>(
    new Set(['class-one', 'class-two'])
  );
  readonly containerSixClass$ = new BehaviorSubject<string>('class-one');
  readonly setClassOne$ = of(true);
  readonly setClassTwo$ = of(false);
}

describe('rxClass', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent, ClassDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should set rxClasses to the container-one', () => {
    const rxClasses = ['class-one', 'class-two'];
    const container = fixture.debugElement.query(By.css('.container-one'));
    const classes = Object.entries(container.classes)
      .filter(([, value]) => value)
      .map(([key]) => key);
    classes.forEach((klass) => {
      expect(rxClasses).toContain(klass);
    });
  });

  it('should set rxClasses to the container-two', () => {
    const rxClasses = ['class-one', 'class-two'];
    const container = fixture.debugElement.query(By.css('.container-two'));
    const classes = Object.entries(container.classes)
      .filter(([, value]) => value)
      .map(([key]) => key);
    classes.forEach((klass) => {
      expect(rxClasses).toContain(klass);
    });
  });

  it('should set class-one to the container-three', () => {
    const container = fixture.debugElement.query(By.css('.container-three'));
    const classes = Object.entries(container.classes)
      .filter(([, value]) => value)
      .map(([key]) => key);
    expect(classes).toContain('class-one');
  });

  it('should replace previously set classes to the container-four', () => {
    fixture.componentInstance.containerFourClasses$.next([
      'class-one',
      'class-three',
    ]);
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.container-four'));
    const classes = Object.entries(container.classes)
      .filter(([, value]) => value)
      .map(([key]) => key);
    expect(classes).not.toContain('class-two');
    expect(classes).toContain('class-one');
  });

  it('should replace previously set classes when using Set to the container-five', () => {
    fixture.componentInstance.containerFiveClasses$.next(
      new Set(['class-one', 'class-three'])
    );
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.container-five'));
    const classes = Object.entries(container.classes)
      .filter(([, value]) => value)
      .map(([key]) => key);
    expect(classes).not.toContain('class-two');
    expect(classes).toContain('class-one');
  });

  it('should set class-one and replace it with class-two', () => {
    const container = fixture.debugElement.query(By.css('.container-six'));
    const classes = Object.entries(container.classes)
      .filter(([, value]) => value)
      .map(([key]) => key);
    expect(classes).toContain('class-one');
    fixture.componentInstance.containerSixClass$.next('class-two');
    fixture.detectChanges();
    const container2 = fixture.debugElement.query(By.css('.container-six'));
    const classes2 = Object.entries(container2.classes)
      .filter(([, value]) => value)
      .map(([key]) => key);
    expect(classes2).not.toContain('class-one');
    expect(classes2).toContain('class-two');
  });
});