import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ComponentRef,
  DynamicComponentLoader,
  AfterViewInit,
  AfterContentInit
} from 'angular2/core';
import {isPresent} from "angular2/src/facade/lang";
import 'rxjs/add/operator/filter';
import {PaginationService} from './pagination_service';

export interface IPaginationModel {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

@Component({
  selector: 'md-pagination-range',
  template: '',
  host: {
    '[class.md-pagination-range]': 'true',
    '[innerHTML]': 'getRange()'
  }
})
export class MdPaginationRange {
  @Input()
  name: string = 'default';

  @Input()
  model: IPaginationModel;

  @Input('range-format')
  rangeFormat: string = '{start}-{end} of {total}';

  public value: string = '';

  constructor(private service: PaginationService) {
    this.service.onChange
      .filter(event => isPresent(event) && isPresent(event.name))
      .filter(event => event.target === this.name)
      .subscribe(event => {
        this.model = event.pagination;
      });
  }

  /**
   * tranform format into an readable string
   *
   * @returns {string}
   */
  getFormattedValue(rangeStart: number, rangeStop: number, totalItems: number) {
    let result: string = this.rangeFormat;

    result = result.replace(/\{start\}/gi, rangeStart.toString());
    result = result.replace(/\{end\}/gi, rangeStop.toString());
    result = result.replace(/\{total\}/gi, totalItems.toString());

    return result;
  }

  /**
   * calculate range depending via model parameters
   *
   * @param {IPaginationModel} model
   * @private
   */
  getRange() {
    if (isPresent(this.model)) {
      let rangeStart = (this.model.currentPage - 1) * this.model.itemsPerPage + 1;

      let rest = this.model.totalItems - rangeStart,
        rangeStop = rest < this.model.itemsPerPage ? this.model.totalItems : rangeStart + this.model.itemsPerPage - 1;

      return this.getFormattedValue(rangeStart, rangeStop, this.model.totalItems);
    }

    return;
  }
}

@Component({
  selector: 'md-pagination-controls',
  template: `
      <span [class.md-pagination-control-active]="!isFirstPage()" class="md-pagination-control md-pagination-control-previous">
        <button (click)="previousPage()" class="material-icons">keyboard_arrow_left</button>
      </span>
      <span [class.md-pagination-control-active]="!isLastPage()" class="md-pagination-control md-pagination-control-next">
        <button (click)="nextPage()" class="material-icons">keyboard_arrow_right</button>
      </span>
    `,
  host: {
    '[class.md-pagination-controls]': 'true'
  }
})
export class MdPaginationControls {
  @Input()
  name: string = 'default';

  @Input()
  model: IPaginationModel;

  constructor(private service: PaginationService) {
    this.service.onChange
      .filter(event => isPresent(event) && isPresent(event.name))
      .filter(event => event.target === this.name)
      .subscribe(event => {
        this.model = event.pagination;
      });
  }

  isFirstPage() {
    return isPresent(this.model) && this.model.currentPage == 1;
  }

  isLastPage() {
    return isPresent(this.model) && this.model.totalItems <= this.model.currentPage * this.model.itemsPerPage;
  }

  previousPage() {
    if (isPresent(this.model)) {
      this.changePage(this.model.currentPage - 1);
    }
  }

  nextPage() {
    if (isPresent(this.model)) {
      this.changePage(this.model.currentPage + 1);
    }
  }

  changePage(newPage: number) {
    let model = JSON.parse(JSON.stringify(this.model));
    model.currentPage = newPage;
    this.service.change(this.name, model);
  }
}

@Component({
  selector: 'md-pagination-items-per-page',
  template: `
   <span *ngIf="itemsPerPageBefore" class="md-pagination-items-per-page-label md-pagination-items-per-page-before">{{itemsPerPageBefore}}</span>
   <select [(ngModel)]="model.itemsPerPage" (ngModelChange)="changePaginationLength($event)" class="md-pagination-length-select">
      <option *ngFor="#length of itemsPerPageOptions" [value]="length">
        {{length}}
      </option>
    </select>
    <span *ngIf="itemsPerPageAfter" class="md-pagination-items-per-page-label md-pagination-items-per-page-after">{{itemsPerPageAfter}}</span>
  `,
  host: {
    '[class.md-pagination-items-per-page]': 'true',
    '[hidden]': '!itemsPerPageOptions.length'
  }
})
export class MdPaginationItemsPerPage {
  @Input('items-per-page-before')
  itemsPerPageBefore: string = 'Rows per page:';

  @Input('items-per-page-after')
  itemsPerPageAfter: string;

  @Input('items-per-page-options')
  itemsPerPageOptions: Array<number> = [];

  @Input()
  name: string = 'default';

  @Input()
  model: IPaginationModel = {
    currentPage: 0,
    itemsPerPage: 0,
    totalItems: 0
  };

  constructor(private service: PaginationService) {
    this.service.onChange
      .filter(event => isPresent(event) && isPresent(event.name))
      .filter(event => event.target === this.name)
      .subscribe(event => {
        if (isPresent(event.pagination)) {
          this.model = event.pagination;
        }
      });
  }

  changePaginationLength(value) {
    let model = JSON.parse(JSON.stringify(this.model));
    model.currentPage = 1;
    model.itemsPerPage = parseInt(value);
    this.service.change(this.name, model);
  }

}

export interface IPaginationChange {
  name: string;
  target: string;
  pagination: IPaginationModel;
}

@Component({
  selector: 'md-pagination',
  template: `
    <ng-content></ng-content>
    <div #default></div>
  `,
  directives: [MdPaginationRange, MdPaginationControls, MdPaginationItemsPerPage],
  host: {
    '[class.md-pagination]': 'true'
  }
})
export class MdPagination implements AfterContentInit, AfterViewInit {
  @Input()
  name: string = 'default';

  @Input()
  model: IPaginationModel;

  @Input()
  range: boolean = true;

  @Input('range-format')
  rangeFormat: string;

  @Input()
  controls: boolean = true;

  @Input('items-per-page')
  itemsPerPage: boolean = true;

  @Input('items-per-page-before')
  itemsPerPageBefore: string;

  @Input('items-per-page-after')
  itemsPerPageAfter: string;

  @Input('items-per-page-options')
  itemsPerPageOptions: Array<number>;

  @Output('on-pagination-change')
  onPaginationChange: EventEmitter<IPaginationChange> = new EventEmitter(false);

  constructor(private service: PaginationService, private element: ElementRef, private componentLoader: DynamicComponentLoader) {
    this.service.onChange
      .filter(event => isPresent(event) && isPresent(event.name))
      .filter(event => event.target === this.name)
      .subscribe(event => this.onPaginationChange.emit(event));

  }

  public initDefaultLayout() {
    if (this.itemsPerPage === true) {
      this.componentLoader.loadIntoLocation(MdPaginationItemsPerPage, this.element, 'default')
        .then((itemsPerPage: ComponentRef) => {
          itemsPerPage.instance.name = this.name;
          itemsPerPage.instance.model = this.model;
          if (isPresent(this.itemsPerPageBefore)) {
            itemsPerPage.instance.itemsPerPageBefore = this.itemsPerPageBefore;
          }
          if (isPresent(this.itemsPerPageAfter)) {
            itemsPerPage.instance.itemsPerPageAfter = this.itemsPerPageAfter;
          }
          if (isPresent(this.itemsPerPageOptions)) {
            itemsPerPage.instance.itemsPerPageOptions = this.itemsPerPageOptions;
          }
        });
    }
    if (this.range === true) {
      this.componentLoader.loadIntoLocation(MdPaginationRange, this.element, 'default')
        .then((range: ComponentRef) => {
          range.instance.name = this.name;
          range.instance.model = this.model;
          if (isPresent(this.rangeFormat)) {
            range.instance.rangeFormat = this.rangeFormat;
          }
        });
    }
    if (this.controls === true) {
      this.componentLoader.loadIntoLocation(MdPaginationControls, this.element, 'default')
        .then((controls: ComponentRef) => {
          controls.instance.name = this.name;
          controls.instance.model = this.model;
        });
    }
  }

  ngAfterContentInit() {
    if (this.element.nativeElement.childElementCount === 1) {
      this.initDefaultLayout();
    }
  }

  ngAfterViewInit() {
    this.service.change(this.name, this.model);
  }
}
