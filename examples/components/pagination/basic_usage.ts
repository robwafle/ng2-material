import {Component} from "angular2/core";
import {MATERIAL_DIRECTIVES} from "ng2-material/all";

import {tableDatas} from './pagination_datas';
import {IPaginationModel} from '../../../ng2-material/components/pagination/pagination';

@Component({
  selector: 'pagination-basic-usage',
  templateUrl: 'examples/components/pagination/basic_usage.html',
  directives: [MATERIAL_DIRECTIVES]
})
export default class PaginationBasicUsage {
  materials: Array<any> = tableDatas;

  pagination: IPaginationModel = {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 24
  };

  availableLength: Array<number> = [5, 10, 20];

  pagedMaterials: Array<any> = [];

  constructor() {
    this.refreshMaterials();
  }

  refreshMaterials() {
    let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage,
      end = start + this.pagination.itemsPerPage;
    this.pagedMaterials = this.materials.slice(start, end);
  }

  detectChange(event) {
    if (event !== undefined && event.name === 'pagination_changed' && event.pagination !== undefined) {
      this.pagination = event.pagination;
      this.refreshMaterials();
    }
  }
}
