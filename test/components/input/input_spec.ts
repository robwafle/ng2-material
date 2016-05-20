import {componentSanityCheck, promiseWait} from "../../util";
import {
  beforeEach,
  describe,
  expect,
  inject,
  it,
  injectAsync
} from "@angular/core/testing";
import {TestComponentBuilder, ComponentFixture} from "@angular/compiler/testing";
import {Component, DebugElement, Input} from "@angular/core";
import {MdInput, MdInputContainer} from "../../../ng2-material/components/input/input";
import {By} from "@angular/platform-browser";
//import { Promise } from "es6-promise";

export function main() {

  let template = `<md-input-container><input md-input type="text"></md-input-container>`;
  componentSanityCheck('Input Container', 'md-input-container', template);

  interface IInputFixture {
    fixture: ComponentFixture<any>;
    input: MdInput;
    container: MdInputContainer;
    inputDebug: DebugElement;
    containerDebug: DebugElement;
  }

  @Component({
    selector: 'test-app',
    directives: [MdInput, MdInputContainer],
    template: template
  })
  class TestComponent {

    @Input()
    boundValue;
  }

  describe('Input', () => {
    let builder: TestComponentBuilder;

    function setup(template: string = null): Promise<IInputFixture> {
      let prep = template === null ?
        builder.createAsync(TestComponent) :
        builder.overrideTemplate(TestComponent, template).createAsync(TestComponent);
      return prep.then((fixture: ComponentFixture<any>) => {
        fixture.detectChanges();
        let input = fixture.debugElement.query(By.css('[md-input]'));
        let container = fixture.debugElement.query(By.css('md-input-container'));
        return {
          fixture: fixture,
          input: input.componentInstance,
          container: container.componentInstance,
          inputDebug: input,
          containerDebug: container,
        };
      }).catch(console.error.bind(console));
    }

    beforeEach(inject([TestComponentBuilder], (tcb) => {
      builder = tcb;
    }));

    describe('input[md-input]', () => {
      it('should initialize with empty string value', injectAsync([], () => {
        return setup().then((api: IInputFixture) => {
          api.fixture.destroy();
          expect(api.input.value).toBe('');
        });
      }));
      it('should emit change event when value binding is updated after init', injectAsync([], () => {
        let tpl = `
        <md-input-container>
          <input md-input type="text" [value]="boundValue">
        </md-input-container>`;
        return setup(tpl).then((api: IInputFixture) => {
          let newValue = 'something-great';
          expect(api.input.value).toBe('');
          return promiseWait().then(() => {
            return new Promise((resolve) => {
              api.input.mdChange.subscribe((changed: string) => {
                expect(changed).toBe(newValue);
                resolve();
              });
              api.fixture.componentInstance.boundValue = newValue;
              api.fixture.detectChanges();
            });
          });
        });
      }));
    });
  });


}

