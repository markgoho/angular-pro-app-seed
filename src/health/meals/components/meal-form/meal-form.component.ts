import {
  Component,
  OnChanges,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  SimpleChanges
} from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { Meal } from '../../../shared/services/meals/meals.service';

@Component({
  selector: 'meal-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['meal-form.component.scss'],
  template: `
    <div class="meal-form">

      <form [formGroup]="form">

        <div class="meal-form__name">
          <label for="name">
            <h3>Meal name</h3>
            <input type="text" placeholder="e.g. English Breakfast" formControlName="name" id="name">
            <div class="error" *ngIf="required">
              Workout name is required
            </div>
          </label>
        </div>

        <div class="meal-form__food">

          <div class="meal-form__subtitle">
            <h3>Food</h3>
            <button type="button" class="meal-form__add" (click)="addIngredient()">
              <img src="/img/add-white.svg" alt="">
              Add food
            </button>
          </div>


          <div formArrayName="ingredients">
            <label *ngFor="let c of ingredients.controls; index as i;">
              <input [formControlName]="i" placeholder="e.g. Eggs" type="text">
              <span
                class="meal-form__remove"
                (click)="removeIngredient(i)">
              </span>
            </label>
          </div>


        </div>

        <div class="meal-form__submit">

          <div *ngIf="!exists">
            <button type="button" class="button" (click)="createMeal()">Create meal</button>
            <a [routerLink]="['../']" class="button button--cancel">Cancel</a>
          </div>

          <div *ngIf="exists">
            <button type="button" class="button" (click)="updateMeal()">Save</button>
            <a [routerLink]="['../']" class="button button--cancel">Cancel</a>
          </div>

          <div  class="meal-form__delete" *ngIf="exists">
            <div *ngIf="toggled">
              <p>Delete Item?</p>
              <button class="confirm" type="button" (click)="removeMeal()">Yes</button>
              <button class="cancel" type="button" (click)="toggle()">No</button>
            </div>

            <button type="button" class="button button--delete" (click)="toggle()">
              Delete
            </button>
          </div>

        </div>


      </form>

    </div>
  `
})
export class MealFormComponent implements OnChanges {
  toggled = false;
  exists = false;
  @Input() meal: Meal;
  @Output() create = new EventEmitter<Meal>();
  @Output() update = new EventEmitter<Meal>();
  @Output() remove = new EventEmitter<Meal>();

  form = this.fb.group({
    name: ['', Validators.required],
    ingredients: this.fb.array([''])
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.meal && this.meal.name) {
      this.exists = true;
      this.emptyIngredients();

      const value = this.meal;
      this.form.patchValue(value);

      if (value.ingredients) {
        for (const item of value.ingredients) {
          this.ingredients.push(new FormControl(item));
        }
      }
    }
  }

  emptyIngredients() {
    while (this.ingredients.controls.length) {
      this.ingredients.removeAt(0);
    }
  }

  get required() {
    return (
      this.form.get('name').hasError('required') &&
      this.form.get('name').touched
    );
  }

  get ingredients() {
    return this.form.get('ingredients') as FormArray;
  }

  createMeal() {
    if (this.form.valid) {
      this.create.emit(this.form.value);
    }
  }

  updateMeal() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }

  removeMeal() {
    this.remove.emit(this.form.value);
  }

  addIngredient(): void {
    this.ingredients.push(new FormControl(''));
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }
  toggle() {
    this.toggled = !this.toggled;
  }
}
