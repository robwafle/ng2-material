import {componentSanityCheck} from "../../util";
import {
  beforeEach,
  describe,
  expect,
  inject,
  it,
  injectAsync
} from "@angular/core/testing";
import {TestComponentBuilder, ComponentFixture} from "@angular/compiler/testing";
import {Component, DebugElement} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {MdCheckbox} from "../../../ng2-material/components/checkbox/checkbox";
import {DomAdapter} from "@angular/platform-browser/src/dom/dom_adapter";
import {BrowserDomAdapter} from "@angular/platform-browser/src/browser/browser_adapter";
import {KeyCodes} from "../../../ng2-material/core/key_codes";
import {By} from "@angular/platform-browser";
//import { Promise } from "es6-promise";

export function main() {

  interface ICheckboxFixture {
    fixture: ComponentFixture<any>;
    comp: MdCheckbox;
    debug: DebugElement;
  }
  @Component({
    selector: 'test-app',
    directives: [CORE_DIRECTIVES, MdCheckbox],
    template: `<md-checkbox [(checked)]="isChecked" [disabled]="isDisabled"></md-checkbox>`
  })
  class TestComponent {
    isChecked: boolean = false;
    isDisabled: boolean = false;
  }

  componentSanityCheck('Checkbox', 'md-checkbox', `<md-checkbox checked="true"></md-checkbox>`);

  describe('Checkbox', () => {
    let builder: TestComponentBuilder;
    let dom: DomAdapter = new BrowserDomAdapter();
    
    function setup(checked: boolean = false, disabled: boolean = false): Promise<ICheckboxFixture> {
      return builder.createAsync(TestComponent).then((fixture: ComponentFixture<any>) => {
        let debug = fixture.debugElement.query(By.css('md-checkbox'));
        let comp: MdCheckbox = debug.componentInstance;
        let testComp = fixture.debugElement.componentInstance;
        testComp.isDisabled = disabled;
        testComp.isChecked = checked;
        fixture.detectChanges();
        return {
          fixture: fixture,
          comp: comp,
          debug: debug
        };
      }).catch(console.error.bind(console));
    }

    beforeEach(inject([TestComponentBuilder], (tcb) => {
      builder = tcb;
    }));

    describe('md-checkbox', () => {
      it('should initialize unchecked', injectAsync([], () => {
        return setup().then((api: ICheckboxFixture) => {
          expect(api.comp.checked).toBe(false);
          api.fixture.destroy();
        });
      }));
      it('should set checked from binding', injectAsync([], () => {
        return setup(true).then((api: ICheckboxFixture) => {
          expect(api.comp.checked).toBe(true);
        });
      }));
      it('should toggle checked value when clicked on', injectAsync([], () => {
        return setup(true).then((api: ICheckboxFixture) => {
          expect(api.comp.checked).toBe(true);
          api.debug.nativeElement.click();
          expect(api.comp.checked).toBe(false);
        });
      }));
      it('should not toggle checked value when disabled and clicked on', injectAsync([], () => {
        return setup(true, true).then((api: ICheckboxFixture) => {
          expect(api.comp.checked).toBe(true);
          api.debug.nativeElement.click();
          expect(api.comp.checked).toBe(true);
          api.fixture.destroy();
        });
      }));
      describe('Keyboard', () => {
        it('should toggle when the space key is pressed', injectAsync([], () => {
          return setup().then((api: ICheckboxFixture) => {
            expect(api.comp.checked).toBe(false);
            let event = dom.createEvent('key');
            event.keyCode = KeyCodes.SPACE;
            api.debug.triggerEventHandler('keydown', event);
            expect(api.comp.checked).toBe(true);
          });
        }));
        it('should not toggle when any other key is pressed', injectAsync([], () => {
          return setup().then((api: ICheckboxFixture) => {
            expect(api.comp.checked).toBe(false);
            let event = dom.createEvent('key');
            event.keyCode = KeyCodes.DOWN;
            api.debug.triggerEventHandler('keydown', event);
            expect(api.comp.checked).toBe(false);
          });
        }));

      });
    });
  });


}

