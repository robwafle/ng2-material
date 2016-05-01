import {componentSanityCheck} from '../../util';
import {
  TestComponentBuilder,
  beforeEach,
  describe,
  expect,
  inject,
  it,
  injectAsync,
  fakeAsync,
  ComponentFixture,
  tick
} from 'angular2/testing';
import {Component, DebugElement} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {By} from 'angular2/platform/browser';
import {
  MdPagination, MdPaginationControls, MdPaginationItemsPerPage,
  MdPaginationRange, IPaginationModel, IPaginationChange
} from '../../../ng2-material/components/pagination/pagination';
import {PaginationService} from '../../../ng2-material/components/pagination/pagination_service';

export function main() {

  describe('Pagination', () => {
    let builder: TestComponentBuilder;

    beforeEach(inject([TestComponentBuilder], (tcb) => {
      builder = tcb;
    }));

    componentSanityCheck('MdPagination', 'md-pagination', `<md-pagination></md-pagination>`);

    describe('MdPagination', () => {

      interface IPaginationFixture {
        fixture: ComponentFixture;
        comp: MdPagination;
        debug: DebugElement;
      }
      @Component({
        selector: 'test-app',
        directives: [CORE_DIRECTIVES, MdPagination, MdPaginationControls, MdPaginationItemsPerPage, MdPaginationRange],
        template: `<md-pagination></md-pagination>`
      })
      class TestComponent {
        defaultModel: IPaginationModel = {
          currentPage: 1,
          itemsPerPage: 5,
          totalItems: 24
        };

        defaultItemsPerPageOptions: Array<number> = [10, 50, 100];
      }

      function setup(template: string = null): Promise<IPaginationFixture> {
        let prep = template === null ?
          builder.createAsync(TestComponent) :
          builder.overrideTemplate(TestComponent, template).createAsync(TestComponent);
        return prep.then((fixture: ComponentFixture) => {
          let debug = fixture.debugElement.query(By.css('md-pagination'));
          let comp: MdPagination = debug.componentInstance;
          fixture.detectChanges();
          return {
            fixture: fixture,
            comp: comp,
            debug: debug
          };
        }).catch(console.error.bind(console));
      }

      describe('default values', () => {

        it('should not have a default model', injectAsync([], () => {
          return setup().then((api: IPaginationFixture) => {
            expect(api.comp.model).toBeUndefined();
          });
        }));

        it('should accept custom model', injectAsync([], () => {
          return setup(`<md-pagination [model]="defaultModel"></md-pagination>`).then((api: IPaginationFixture) => {
            expect(api.comp.model.currentPage).toEqual(1);
            expect(api.comp.model.itemsPerPage).toEqual(5);
            expect(api.comp.model.totalItems).toEqual(24);
          });
        }));

        it('should have a default name', injectAsync([], () => {
          return setup().then((api: IPaginationFixture) => {
            expect(api.comp.name).toEqual('default');
          });
        }));

        it('should accept a custom name', injectAsync([], () => {
          return setup(`<md-pagination name="book"></md-pagination>`).then((api: IPaginationFixture) => {
            expect(api.comp.name).toEqual('book');
          });
        }));

        it('should display range by default', injectAsync([], () => {
          return setup().then((api: IPaginationFixture) => {
            expect(api.comp.range).toBeTruthy();
          });
        }));

        it('should accept a custom display for range', injectAsync([], () => {
          return setup(`<md-pagination [range]="false"></md-pagination>`).then((api: IPaginationFixture) => {
            expect(api.comp.range).toBeFalsy();
          });
        }));

        it('should not have a default rangeFormat', injectAsync([], () => {
          return setup().then((api: IPaginationFixture) => {
            expect(api.comp.rangeFormat).toBeUndefined();
          });
        }));

        it('should accept a custom rangeFormat', injectAsync([], () => {
          return setup(`<md-pagination range-format="{start}/{total}"></md-pagination>`).then((api: IPaginationFixture) => {
            expect(api.comp.rangeFormat).toEqual('{start}/{total}');
          });
        }));

        it('should display controls by default', injectAsync([], () => {
          return setup().then((api: IPaginationFixture) => {
            expect(api.comp.controls).toBeTruthy();
          });
        }));

        it('should accept a custom display for controls', injectAsync([], () => {
          return setup(`<md-pagination [controls]="false"></md-pagination>`).then((api: IPaginationFixture) => {
            expect(api.comp.controls).toBeFalsy();
          });
        }));

        it('should display items per page options by default', injectAsync([], () => {
          return setup().then((api: IPaginationFixture) => {
            expect(api.comp.itemsPerPage).toBeTruthy();
          });
        }));

        it('should accept a custom display for items per page', injectAsync([], () => {
          return setup(`<md-pagination [items-per-page]="false"></md-pagination>`).then((api: IPaginationFixture) => {
            expect(api.comp.itemsPerPage).toBeFalsy();
          });
        }));

        it('should not have a default prepended string to items per page', injectAsync([], () => {
          return setup().then((api: IPaginationFixture) => {
            expect(api.comp.itemsPerPageBefore).toBeUndefined();
          });
        }));

        it('should accept a custom prepended string to items per page', injectAsync([], () => {
          return setup(`<md-pagination items-per-page-before="page:"></md-pagination>`).then((api: IPaginationFixture) => {
            expect(api.comp.itemsPerPageBefore).toEqual('page:');
          });
        }));

        it('should not have a default appended string to items per page', injectAsync([], () => {
          return setup().then((api: IPaginationFixture) => {
            expect(api.comp.itemsPerPageAfter).toBeUndefined();
          });
        }));

        it('should accept a custom appended string to items per page', injectAsync([], () => {
          return setup(`<md-pagination items-per-page-after=" - "></md-pagination>`).then((api: IPaginationFixture) => {
            expect(api.comp.itemsPerPageAfter).toEqual(' - ');
          });
        }));

        it('should not have a default list of options for items per page', injectAsync([], () => {
          return setup().then((api: IPaginationFixture) => {
            expect(api.comp.itemsPerPageOptions).toBeUndefined();
          });
        }));

        it('should accept a custom list of options for items per page', injectAsync([], () => {
          return setup(`<md-pagination [items-per-page-options]="defaultItemsPerPageOptions"></md-pagination>`).then((api: IPaginationFixture) => {
            expect(api.comp.itemsPerPageOptions).not.toContain(5);
            expect(api.comp.itemsPerPageOptions).toContain(10);
            expect(api.comp.itemsPerPageOptions).toContain(50);
            expect(api.comp.itemsPerPageOptions).toContain(100);
          });
        }));

      });

      describe('construct', () => {
        let service: PaginationService,
          updatedPagination: IPaginationModel = {
            currentPage: 2,
            itemsPerPage: 30,
            totalItems: 65
          };

        beforeEach(inject([PaginationService], (serv) => {
          service = serv;
        }));

        it('should listen PaginationService', injectAsync([], () => {
          return setup().then((api: IPaginationFixture) => {
            api.comp.onPaginationChange.subscribe((event) => {
              expect(event.name).toEqual('pagination_changed');
              expect(event.target).toEqual('default');
              expect(event.pagination).toEqual(updatedPagination);
            });

            service.change('default', updatedPagination);
          });
        }));

        it('should listen PaginationService only for his reference name', injectAsync([], () => {
          return setup(`<md-pagination name="book"></md-pagination>`).then((api: IPaginationFixture) => {
            let spy = jasmine.createSpy('spy');

            api.comp.onPaginationChange.subscribe(spy);

            service.onChange.subscribe(() => {
              expect(spy).not.toHaveBeenCalled();
            });

            service.change('default', updatedPagination);
          });
        }));
      });

      describe('initDefaultLayout', () => {

        it('should load range component', injectAsync([], fakeAsync(() => {
          return setup().then((api: IPaginationFixture) => {
            let element = api.debug.nativeElement;
            api.fixture.detectChanges();
            tick();
            return expect(element.querySelector('md-pagination-range')).not.toBe(null);
          });
        })));

        it('should accept not loading range component', injectAsync([], fakeAsync(() => {
          return setup(`<md-pagination [range]="false"></md-pagination>`).then((api: IPaginationFixture) => {
            let element = api.debug.nativeElement;
            api.fixture.detectChanges();
            tick();
            return expect(element.querySelector('md-pagination-range')).toBe(null);
          });
        })));

        it('should load controls component', injectAsync([], fakeAsync(() => {
          return setup().then((api: IPaginationFixture) => {
            let element = api.debug.nativeElement;
            api.fixture.detectChanges();
            tick();
            return expect(element.querySelector('md-pagination-controls')).not.toBe(null);
          });
        })));

        it('should accept not loading controls component', injectAsync([], fakeAsync(() => {
          return setup(`<md-pagination [controls]="false"></md-pagination>`).then((api: IPaginationFixture) => {
            let element = api.debug.nativeElement;
            api.fixture.detectChanges();
            tick();
            return expect(element.querySelector('md-pagination-controls')).toBe(null);
          });
        })));

        it('should load items per page options component', injectAsync([], fakeAsync(() => {
          return setup().then((api: IPaginationFixture) => {
            let element = api.debug.nativeElement;
            api.fixture.detectChanges();
            tick();
            return expect(element.querySelector('md-pagination-items-per-page')).not.toBe(null);
          });
        })));

        it('should accept not loading items per page options component', injectAsync([], fakeAsync(() => {
          return setup(`<md-pagination [items-per-page]="false"></md-pagination>`).then((api: IPaginationFixture) => {
            let element = api.debug.nativeElement;
            api.fixture.detectChanges();
            tick();
            return expect(element.querySelector('md-pagination-items-per-page')).toBe(null);
          });
        })));

      });

      describe('ngAfterContentInit', () => {

        it('should init default components', injectAsync([], fakeAsync(() => {
          return setup().then((api: IPaginationFixture) => {
            let element = api.debug.nativeElement;
            api.fixture.detectChanges();
            tick();
            expect(element.children.length).toEqual(4);
          });
        })));

        it('should accept custom components as children', injectAsync([], fakeAsync(() => {
          return setup(`<md-pagination><button></button></md-pagination>`).then((api: IPaginationFixture) => {
            let element = api.debug.nativeElement;
            api.fixture.detectChanges();
            tick();
            expect(element.children.length).toEqual(2);
          });
        })));

      });

      describe('ngAfterViewInit', () => {
        let service: PaginationService,
          defaultModel: IPaginationModel = {
            currentPage: 1,
            itemsPerPage: 30,
            totalItems: 65
          };

        beforeEach(inject([PaginationService], (serv) => {
          service = serv;
          spyOn(service, 'change')
        }));

        it('should dispatch his model after init', injectAsync([], fakeAsync(() => {
          return setup(`<md-pagination name="book" [model]="defaultModel"></md-pagination>`).then((api: IPaginationFixture) => {
            expect(service.change).toHaveBeenCalled();
          });
        })));

      });

    });

    componentSanityCheck('MdPaginationRange', 'md-pagination-range', `<md-pagination-range></md-pagination-range>`);

    describe('MdPaginationRange', () => {

      interface IPaginationRangeFixture {
        fixture: ComponentFixture;
        comp: MdPaginationRange;
        debug: DebugElement;
      }
      @Component({
        selector: 'test-app',
        directives: [CORE_DIRECTIVES, MdPaginationRange],
        template: `<md-pagination-range></md-pagination-range>`
      })
      class TestComponent {
        page2: IPaginationModel = {
          currentPage: 2,
          itemsPerPage: 30,
          totalItems: 65
        };

        page3: IPaginationModel = {
          currentPage: 3,
          itemsPerPage: 30,
          totalItems: 65
        };

        defaultRangeFormat: string = '{start}-{end} / {total}';
      }

      function setup(template: string = null): Promise<IPaginationRangeFixture> {
        let prep = template === null ?
          builder.createAsync(TestComponent) :
          builder.overrideTemplate(TestComponent, template).createAsync(TestComponent);
        return prep.then((fixture: ComponentFixture) => {
          let debug = fixture.debugElement.query(By.css('md-pagination-range'));
          let comp: MdPaginationRange = debug.componentInstance;
          fixture.detectChanges();
          return {
            fixture: fixture,
            comp: comp,
            debug: debug
          };
        }).catch(console.error.bind(console));
      }

      describe('default values', () => {

        it('should not have a default model', injectAsync([], () => {
          return setup().then((api: IPaginationRangeFixture) => {
            expect(api.comp.model).toBeUndefined();
          });
        }));

        it('should accept custom model', injectAsync([], () => {
          return setup(`<md-pagination-range [model]="page2"></md-pagination-range>`).then((api: IPaginationRangeFixture) => {
            expect(api.comp.model.currentPage).toEqual(2);
            expect(api.comp.model.itemsPerPage).toEqual(30);
            expect(api.comp.model.totalItems).toEqual(65);
          });
        }));

        it('should have a default name', injectAsync([], () => {
          return setup().then((api: IPaginationRangeFixture) => {
            expect(api.comp.name).toEqual('default');
          });
        }));

        it('should accept a custom name', injectAsync([], () => {
          return setup(`<md-pagination-range name="book"></md-pagination-range>`).then((api: IPaginationRangeFixture) => {
            expect(api.comp.name).toEqual('book');
          });
        }));

        it('should have a default range format', injectAsync([], () => {
          return setup().then((api: IPaginationRangeFixture) => {
            expect(api.comp.rangeFormat).toEqual('{start}-{end} of {total}');
          });
        }));

        it('should accept a custom range format', injectAsync([], () => {
          return setup(`<md-pagination-range [range-format]="defaultRangeFormat"></md-pagination-range>`).then((api: IPaginationRangeFixture) => {
            expect(api.comp.rangeFormat).toEqual('{start}-{end} / {total}');
          });
        }));

      });

      describe('construct', () => {
        let service: PaginationService,
          updatedPagination: IPaginationModel = {
            currentPage: 1,
            itemsPerPage: 30,
            totalItems: 65
          };

        beforeEach(inject([PaginationService], (serv) => {
          service = serv;
        }));

        it('should listen PaginationService', injectAsync([], () => {
          return setup().then((api: IPaginationRangeFixture) => {
            service.onChange.subscribe((event) => {
              expect(api.comp.model).toEqual(updatedPagination);
            });

            service.change('default', updatedPagination);
          });
        }));

        it('should listen PaginationService only for his reference name', injectAsync([], () => {
          return setup(`<md-pagination-range name="book"></md-pagination-range>`).then((api: IPaginationRangeFixture) => {
            service.onChange.subscribe(() => {
              expect(api.comp.model).toBeUndefined();
            });

            service.change('default', updatedPagination);
          });
        }));
      });

      describe('getFormattedValue', () => {

        it('should replace pattern in the range format', injectAsync([], () => {
          return setup().then((api: IPaginationRangeFixture) => {
            expect(api.comp.getFormattedValue(1, 5, 30)).toEqual('1-5 of 30');
          });
        }));

      });

      describe('getRange', () => {

        it('should return nothing if no model is provided', injectAsync([], () => {
          return setup().then((api: IPaginationRangeFixture) => {
            spyOn(api.comp, 'getFormattedValue');
            let result = api.comp.getRange();
            expect(result).toBeUndefined();
            expect(api.comp.getFormattedValue).not.toHaveBeenCalled();
          });
        }));

        it('should calculate range at the middle', injectAsync([], () => {
          return setup(`<md-pagination-range [model]="page2"></md-pagination-range>`).then((api: IPaginationRangeFixture) => {
            spyOn(api.comp, 'getFormattedValue').and.callThrough();
            let result = api.comp.getRange();
            expect(result).toEqual('31-60 of 65');
            expect(api.comp.getFormattedValue).toHaveBeenCalledWith(31, 60, 65);
          });
        }));


        it('should calculate range at the end', injectAsync([], () => {
          return setup(`<md-pagination-range [model]="page3"></md-pagination-range>`).then((api: IPaginationRangeFixture) => {
            spyOn(api.comp, 'getFormattedValue').and.callThrough();
            let result = api.comp.getRange();
            expect(result).toEqual('61-65 of 65');
            expect(api.comp.getFormattedValue).toHaveBeenCalledWith(61, 65, 65);
          });
        }));

      });

    });

    componentSanityCheck('MdPaginationControls', 'md-pagination-controls', `<md-pagination-controls></md-pagination-controls>`);

    describe('MdPaginationControls', () => {

      interface IPaginationControlsFixture {
        fixture: ComponentFixture;
        comp: MdPaginationControls;
        debug: DebugElement;
      }
      @Component({
        selector: 'test-app',
        directives: [CORE_DIRECTIVES, MdPaginationControls],
        template: `<md-pagination-controls></md-pagination-controls>`
      })
      class TestComponent {
        page1: IPaginationModel = {
          currentPage: 1,
          itemsPerPage: 30,
          totalItems: 65
        };
        page2: IPaginationModel = {
          currentPage: 2,
          itemsPerPage: 30,
          totalItems: 65
        };
        page3: IPaginationModel = {
          currentPage: 3,
          itemsPerPage: 30,
          totalItems: 65
        };
      }

      function setup(template: string = null): Promise<IPaginationControlsFixture> {
        let prep = template === null ?
          builder.createAsync(TestComponent) :
          builder.overrideTemplate(TestComponent, template).createAsync(TestComponent);
        return prep.then((fixture: ComponentFixture) => {
          let debug = fixture.debugElement.query(By.css('md-pagination-controls'));
          let comp: MdPaginationControls = debug.componentInstance;
          fixture.detectChanges();
          return {
            fixture: fixture,
            comp: comp,
            debug: debug
          };
        }).catch(console.error.bind(console));
      }

      describe('default values', () => {

        it('should not have a default model', injectAsync([], () => {
          return setup().then((api: IPaginationControlsFixture) => {
            expect(api.comp.model).toBeUndefined();
          });
        }));

        it('should accept custom model', injectAsync([], () => {
          return setup(`<md-pagination-controls [model]="page2"></md-pagination-controls>`).then((api: IPaginationControlsFixture) => {
            expect(api.comp.model.currentPage).toEqual(2);
            expect(api.comp.model.itemsPerPage).toEqual(30);
            expect(api.comp.model.totalItems).toEqual(65);
          });
        }));

        it('should have a default name', injectAsync([], () => {
          return setup().then((api: IPaginationControlsFixture) => {
            expect(api.comp.name).toEqual('default');
          });
        }));

        it('should accept a custom name', injectAsync([], () => {
          return setup(`<md-pagination-controls name="book"></md-pagination-controls>`).then((api: IPaginationControlsFixture) => {
            expect(api.comp.name).toEqual('book');
          });
        }));

      });

      describe('construct', () => {
        let service: PaginationService,
          updatedPagination: IPaginationModel = {
            currentPage: 1,
            itemsPerPage: 30,
            totalItems: 65
          };

        beforeEach(inject([PaginationService], (serv) => {
          service = serv;
        }));

        it('should listen PaginationService', injectAsync([], () => {
          return setup().then((api: IPaginationControlsFixture) => {
            service.onChange.subscribe((event) => {
              expect(api.comp.model).toEqual(updatedPagination);
            });

            service.change('default', updatedPagination);
          });
        }));

        it('should listen PaginationService only for his reference name', injectAsync([], () => {
          return setup(`<md-pagination-controls name="book"></md-pagination-controls>`).then((api: IPaginationControlsFixture) => {
            service.onChange.subscribe(() => {
              expect(api.comp.model).toBeUndefined();
            });

            service.change('default', updatedPagination);
          });
        }));
      });

      describe('isFirstPage', () => {

        it('should not check first page without model', injectAsync([], () => {
          return setup().then((api: IPaginationControlsFixture) => {
            expect(api.comp.isFirstPage()).toBeFalsy();
          });
        }));

        it('should accept first page as first page', injectAsync([], () => {
          return setup(`<md-pagination-controls [model]="page1"></md-pagination-controls>`).then((api: IPaginationControlsFixture) => {
            expect(api.comp.isFirstPage()).toBeTruthy();
          });
        }));

        it('should not accept second page as first page', injectAsync([], () => {
          return setup(`<md-pagination-controls [model]="page2"></md-pagination-controls>`).then((api: IPaginationControlsFixture) => {
            expect(api.comp.isFirstPage()).toBeFalsy();
          });
        }));

      });

      describe('isLastPage', () => {

        it('should not check last page without model', injectAsync([], () => {
          return setup().then((api: IPaginationControlsFixture) => {
            expect(api.comp.isLastPage()).toBeFalsy();
          });
        }));

        it('should accept third page as last page', injectAsync([], () => {
          return setup(`<md-pagination-controls [model]="page3"></md-pagination-controls>`).then((api: IPaginationControlsFixture) => {
            expect(api.comp.isLastPage()).toBeTruthy();
          });
        }));

        it('should not accept second page as last page', injectAsync([], () => {
          return setup(`<md-pagination-controls [model]="page2"></md-pagination-controls>`).then((api: IPaginationControlsFixture) => {
            expect(api.comp.isLastPage()).toBeFalsy();
          });
        }));

      });

      describe('previousPage', () => {

        it('should not check last page without model', injectAsync([], () => {
          return setup().then((api: IPaginationControlsFixture) => {
            spyOn(api.comp, 'changePage');
            api.comp.previousPage();
            expect(api.comp.changePage).not.toHaveBeenCalled();
          });
        }));

        it('should call change of page to previous one', injectAsync([], () => {
          return setup(`<md-pagination-controls [model]="page2"></md-pagination-controls>`).then((api: IPaginationControlsFixture) => {
            spyOn(api.comp, 'changePage');
            api.comp.previousPage();
            expect(api.comp.changePage).toHaveBeenCalledWith(1);
          });
        }));

      });

      describe('nextPage', () => {

        it('should not check last page without model', injectAsync([], () => {
          return setup().then((api: IPaginationControlsFixture) => {
            spyOn(api.comp, 'changePage');
            api.comp.nextPage();
            expect(api.comp.changePage).not.toHaveBeenCalled();
          });
        }));

        it('should call change of page to previous one', injectAsync([], () => {
          return setup(`<md-pagination-controls [model]="page2"></md-pagination-controls>`).then((api: IPaginationControlsFixture) => {
            spyOn(api.comp, 'changePage');
            api.comp.nextPage();
            expect(api.comp.changePage).toHaveBeenCalledWith(3);
          });
        }));

      });

      describe('changePage', () => {
        let service: PaginationService;

        beforeEach(inject([PaginationService], (serv) => {
          service = serv;
          spyOn(service, 'change');
        }));

        it('should dispatch the new current page to the service', injectAsync([], () => {
          return setup(`<md-pagination-controls [model]="page2"></md-pagination-controls>`).then((api: IPaginationControlsFixture) => {
            api.comp.changePage(1);
            expect(service.change).toHaveBeenCalledWith('default', {
              currentPage: 1,
              itemsPerPage: 30,
              totalItems: 65
            });
          });
        }));

      });

    });

    componentSanityCheck('MdPaginationItemsPerPage', 'md-pagination-items-per-page', `<md-pagination-items-per-page></md-pagination-items-per-page>`);

    describe('MdPaginationItemsPerPage', () => {

      interface IPaginationItemsPerPageFixture {
        fixture: ComponentFixture;
        comp: MdPaginationItemsPerPage;
        debug: DebugElement;
      }
      @Component({
        selector: 'test-app',
        directives: [CORE_DIRECTIVES, MdPaginationItemsPerPage],
        template: `<md-pagination-items-per-page></md-pagination-items-per-page>`
      })
      class TestComponent {
        page1: IPaginationModel = {
          currentPage: 1,
          itemsPerPage: 30,
          totalItems: 65
        };
        page2: IPaginationModel = {
          currentPage: 2,
          itemsPerPage: 30,
          totalItems: 65
        };

        defaultItemsPerPageOptions: Array<number> = [10, 50, 100];
      }

      function setup(template: string = null): Promise<IPaginationItemsPerPageFixture> {
        let prep = template === null ?
          builder.createAsync(TestComponent) :
          builder.overrideTemplate(TestComponent, template).createAsync(TestComponent);
        return prep.then((fixture: ComponentFixture) => {
          let debug = fixture.debugElement.query(By.css('md-pagination-items-per-page'));
          let comp: MdPaginationItemsPerPage = debug.componentInstance;
          fixture.detectChanges();
          return {
            fixture: fixture,
            comp: comp,
            debug: debug
          };
        }).catch(console.error.bind(console));
      }

      describe('default values', () => {

        it('should have a default model', injectAsync([], () => {
          return setup().then((api: IPaginationItemsPerPageFixture) => {
            expect(api.comp.model.currentPage).toEqual(0);
            expect(api.comp.model.itemsPerPage).toEqual(0);
            expect(api.comp.model.totalItems).toEqual(0);
          });
        }));

        it('should accept custom model', injectAsync([], () => {
          return setup(`<md-pagination-items-per-page [model]="page2"></md-pagination-items-per-page>`).then((api: IPaginationItemsPerPageFixture) => {
            expect(api.comp.model.currentPage).toEqual(2);
            expect(api.comp.model.itemsPerPage).toEqual(30);
            expect(api.comp.model.totalItems).toEqual(65);
          });
        }));

        it('should have a default name', injectAsync([], () => {
          return setup().then((api: IPaginationItemsPerPageFixture) => {
            expect(api.comp.name).toEqual('default');
          });
        }));

        it('should accept a custom name', injectAsync([], () => {
          return setup(`<md-pagination-items-per-page name="book"></md-pagination-items-per-page>`).then((api: IPaginationItemsPerPageFixture) => {
            expect(api.comp.name).toEqual('book');
          });
        }));

        it('should have a default prepended string', injectAsync([], () => {
          return setup().then((api: IPaginationItemsPerPageFixture) => {
            expect(api.comp.itemsPerPageBefore).toEqual('Rows per page:');
          });
        }));

        it('should accept a custom prepended string', injectAsync([], () => {
          return setup(`<md-pagination-items-per-page items-per-page-before="Items per page:"></md-pagination-items-per-page>`).then((api: IPaginationItemsPerPageFixture) => {
            expect(api.comp.itemsPerPageBefore).toEqual('Items per page:');
          });
        }));

        it('should not have a default appended string', injectAsync([], () => {
          return setup().then((api: IPaginationItemsPerPageFixture) => {
            expect(api.comp.itemsPerPageAfter).toBeUndefined();
          });
        }));

        it('should accept a custom appended string', injectAsync([], () => {
          return setup(`<md-pagination-items-per-page items-per-page-after=" - "></md-pagination-items-per-page>`).then((api: IPaginationItemsPerPageFixture) => {
            expect(api.comp.itemsPerPageAfter).toEqual(' - ');
          });
        }));

        it('should have a empty list of options for items per page', injectAsync([], () => {
          return setup().then((api: IPaginationItemsPerPageFixture) => {
            expect(api.comp.itemsPerPageOptions).toEqual([]);
          });
        }));

        it('should accept a custom list of options for items per page', injectAsync([], () => {
          return setup(`<md-pagination-items-per-page [items-per-page-options]="defaultItemsPerPageOptions"></md-pagination-items-per-page>`).then((api: IPaginationItemsPerPageFixture) => {
            expect(api.comp.itemsPerPageOptions).not.toContain(5);
            expect(api.comp.itemsPerPageOptions).toContain(10);
            expect(api.comp.itemsPerPageOptions).toContain(50);
            expect(api.comp.itemsPerPageOptions).toContain(100);
          });
        }));

      });

      describe('construct', () => {
        let service: PaginationService,
          updatedPagination: IPaginationModel = {
            currentPage: 1,
            itemsPerPage: 30,
            totalItems: 65
          };

        beforeEach(inject([PaginationService], (serv) => {
          service = serv;
        }));

        it('should listen PaginationService', injectAsync([], () => {
          return setup().then((api: IPaginationItemsPerPageFixture) => {
            service.onChange.subscribe((event) => {
              expect(api.comp.model).toEqual(updatedPagination);
            });

            service.change('default', updatedPagination);
          });
        }));

        it('should listen PaginationService only for his reference name', injectAsync([], () => {
          return setup(`<md-pagination-items-per-page name="book"></md-pagination-items-per-page>`).then((api: IPaginationItemsPerPageFixture) => {
            service.onChange.subscribe(() => {
              expect(api.comp.model.currentPage).toEqual(0);
              expect(api.comp.model.itemsPerPage).toEqual(0);
              expect(api.comp.model.totalItems).toEqual(0);
            });

            service.change('default', updatedPagination);
          });
        }));
      });

      describe('changePaginationLength', () => {
        let service: PaginationService;

        beforeEach(inject([PaginationService], (serv) => {
          service = serv;
          spyOn(service, 'change');
        }));

        it('should dispatch page change to the service and reset to first page', injectAsync([], () => {
          return setup(`<md-pagination-items-per-page [model]="page2"></md-pagination-items-per-page>`).then((api: IPaginationItemsPerPageFixture) => {
            api.comp.changePaginationLength(50);
            expect(service.change).toHaveBeenCalledWith('default', {
              currentPage: 1,
              itemsPerPage: 50,
              totalItems: 65
            });
          });
        }));

      });

    });

  });

}

