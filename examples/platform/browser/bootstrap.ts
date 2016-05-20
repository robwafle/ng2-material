import {bind, enableProdMode} from "@angular/core";
import {bootstrap} from "@angular/platform-browser-dynamic";
import {ROUTER_PROVIDERS} from "@angular/router";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {MATERIAL_BROWSER_PROVIDERS} from "../../../ng2-material/all";
import {HTTP_PROVIDERS} from "@angular/http";
import {ComponentsService} from "../../services/components";
import {NavigationService} from "../../services/navigation";
import {VersionService} from "../../services/version";
import {DemosApp} from "../../app";

if (window.location.href.indexOf('github.com') !== -1) {
  enableProdMode();
}
bootstrap(DemosApp, [
  HTTP_PROVIDERS, ROUTER_PROVIDERS, MATERIAL_BROWSER_PROVIDERS,
  ComponentsService, NavigationService, VersionService,
  bind(LocationStrategy).toClass(HashLocationStrategy)
]);
