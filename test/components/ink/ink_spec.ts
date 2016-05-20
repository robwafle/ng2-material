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
import {DomAdapter} from "@angular/platform-browser/src/dom/dom_adapter";
import {BrowserDomAdapter} from "@angular/platform-browser/src/browser/browser_adapter";
import {Ink} from "../../../ng2-material/core/util/ink";
import {By} from "@angular/platform-browser";
import {MdInk} from "../../../ng2-material/components/ink/ink";
//import { Promise } from "es6-promise";

export function main() {

  const defaultTemplate = `<div md-ink></div>`;

  @Component({
    selector: 'test-app',
    directives: [MdInk],
    template: defaultTemplate
  })
  class TestComponent {
  }

  describe('MdInk', () => {

    let builder: TestComponentBuilder;
    let dom: DomAdapter = new BrowserDomAdapter();

    function setup(template: string = defaultTemplate): Promise<ComponentFixture<any>> {
      return builder
        .overrideTemplate(TestComponent, template)
        .createAsync(TestComponent)
        .then((fixture: ComponentFixture<any>) => {
          fixture.detectChanges();
          return fixture;
        }).catch(console.error.bind(console));
    }

    beforeEach(inject([TestComponentBuilder], (tcb) => {
      builder = tcb;
    }));

    describe('[md-ink]', () => {
      it('should ink ripple when clicked', injectAsync([], () => {
        return setup().then((fixture: ComponentFixture<any>) => {
          let element: DebugElement = fixture.debugElement.query(By.css('[md-ink]'));

          let save = Ink.rippleEvent;
          let fired = false;
          Ink.rippleEvent = () => {
            fired = true;
            return Promise.resolve();
          };

          let event = dom.createEvent('mouse');
          element.triggerEventHandler('mousedown', event);


          expect(fired).toBe(true);
          Ink.rippleEvent = save;
        });
      }));

      it('should not ink ripple with md-no-ink attribute', injectAsync([], () => {
        let template = `<div md-ink md-no-ink></div>`;
        return setup(template).then((fixture: ComponentFixture<any>) => {
          let element: DebugElement = fixture.debugElement.query(By.css('[md-ink]'));
          let save = Ink.rippleEvent;
          let fired = false;
          Ink.rippleEvent = () => {
            fired = true;
            return Promise.resolve();
          };

          let event = dom.createEvent('mouse');
          element.triggerEventHandler('mousedown', event);

          expect(fired).toBe(false);
          Ink.rippleEvent = save;
        });
      }));
    });
  });
}

