import {Component, ViewEncapsulation} from "angular2/core";
import {MATERIAL_DIRECTIVES} from "ng2-material/all";

import {bookDatas} from './pagination_datas';

@Component({
  selector: 'pagination-split-usage',
  templateUrl: 'examples/components/pagination/split_usage.html',
  styleUrls: ['examples/components/pagination/split_usage.css'],
  directives: [MATERIAL_DIRECTIVES],
  encapsulation: ViewEncapsulation.None
})
export default class PaginationSplitUsage {
  pages: Array<string> = bookDatas;

  pagination: any = {
    currentPage: 1,
    itemsPerPage: 2,
    totalItems: 6
  };
  
  rangeFormat: string = ` 
    <span flex="50" layout="column" class="page-number">{start}</span>
    <span flex="50" layout="column" class="page-number">{end}</span>
  `;

  displayedPages: Array<string> = [];

  constructor() {
    this.refreshPages();
  }

  refreshPages() {
    let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage,
      end = start + this.pagination.itemsPerPage;
    this.displayedPages = this.pages.slice(start, end);
  }

  detectChange(event) {
    if (event !== undefined && event.name === 'pagination_changed' && event.pagination !== undefined) {
      this.pagination = event.pagination;
      this.refreshPages();
    }
  }
}
