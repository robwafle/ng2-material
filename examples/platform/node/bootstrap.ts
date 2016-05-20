// import {bootstrap} from "angular2-universal";
import {bootstrap} from "@angular/platform-browser-dynamic";
import {ROUTER_PROVIDERS} from "@angular/router";
import {MATERIAL_NODE_PROVIDERS} from "../../../ng2-material/all";
import {HTTP_PROVIDERS} from "@angular/http";
import {ComponentsService} from "../../services/components";
import {NavigationService} from "../../services/navigation";
import {VersionService} from "../../services/version";
import {DemosApp} from "../../app";

bootstrap(DemosApp, [
  HTTP_PROVIDERS, ROUTER_PROVIDERS, MATERIAL_NODE_PROVIDERS,
  ComponentsService, NavigationService, VersionService
]);
