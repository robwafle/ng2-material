import {Component, OnInit} from "@angular/core";
import {RouteSegment, ROUTER_DIRECTIVES} from "@angular/router";
import {ComponentsService, IComponentMeta} from "../services/components";
import {MATERIAL_DIRECTIVES, SidenavService} from "../../ng2-material/all";
import Example from "../example";
import {NavigationService} from "../services/navigation";
import {DomAdapter} from "@angular/platform-browser/src/dom/dom_adapter";
import {BrowserDomAdapter} from "@angular/platform-browser/src/browser/browser_adapter";
import {TimerWrapper} from "@angular/common/src/facade/async";

@Component({
  selector: 'component-page',
  template: `
    <h1 class="examples-title">Examples</h1>
    <p class="examples-intro" *ngIf="value.readme" [innerHtml]="value.readme"></p>

    <example *ngFor="#demo of value.examples" [model]="demo"></example>`,
  directives: [Example, ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES]
})
export class ComponentPage implements OnInit {

  public id: string;

  public value: IComponentMeta = <IComponentMeta>{};

  public next: IComponentMeta = null;
  public previous: IComponentMeta = null;

  private dom : DomAdapter = new BrowserDomAdapter();

  constructor(private _components: ComponentsService,
              private _navigation: NavigationService,
              private _sidenav: SidenavService,
              private _routeSegment: RouteSegment) {
  }

  ngOnInit() {
    TimerWrapper.setTimeout(() => {
      this._sidenav.hide('menu');
    }, 0);
    let id = this._routeSegment.getParam('id');
    this._components.getComponent(id).then((c: IComponentMeta) => {
      this.value = c;
      this.dom.setTitle('ng2-material – ' + c.name);
      this._navigation.currentTitle = c.name;
      this._components.getNext(c).then((next: IComponentMeta) => {
        this._navigation.nextLink = this._navigation.componentLink(next);
      });
      this._components.getPrevious(c).then((previous: IComponentMeta) => {
        this._navigation.prevLink = this._navigation.componentLink(previous);
      });
    });
  }

}
