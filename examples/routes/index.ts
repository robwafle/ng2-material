import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {ComponentsService, IComponentMeta} from "../services/components";
import {NavigationService} from "../services/navigation";
import {MATERIAL_DIRECTIVES, SidenavService} from "../../ng2-material/all";
import {DomAdapter} from "@angular/platform-browser/src/dom/dom_adapter";
import {BrowserDomAdapter} from "@angular/platform-browser/src/browser/browser_adapter";
import {Highlight} from "../highlight";
import {TimerWrapper} from "@angular/common/src/facade/async";
import {Http, Response} from "@angular/http";

@Component({
  templateUrl: 'examples/routes/index.html',
  directives: [ROUTER_DIRECTIVES, Highlight, MATERIAL_DIRECTIVES]
})
export class IndexPage implements OnInit {
  public components: IComponentMeta[] = [];

  public angularVersion: string = '';
  public linkTag: string = '';
  private dom : DomAdapter = new BrowserDomAdapter();

  constructor(private _components: ComponentsService,
              private _sidenav: SidenavService,
              public http: Http,
              public navigation: NavigationService) {
  }

  ngOnInit(): any {

    this.http.get('public/version.json')
      .subscribe((res: Response) => {
        this.angularVersion = res.json().angular2;
        this.linkTag = res.json().angular2.replace(/[>=^~]/g,'');
      });


    TimerWrapper.setTimeout(() => {
      this._sidenav.hide('menu');
    }, 0);
    this._components.getComponents()
      .then((comps) => {
        this.components = comps;
        let title = 'Angular2 Material';
        this.dom.setTitle(title);
        this.navigation.currentTitle = title;
        this.navigation.prevLink = this.navigation.componentLink(comps[comps.length - 1]);
        this.navigation.nextLink = this.navigation.componentLink(comps[0]);
      });
  }

}
