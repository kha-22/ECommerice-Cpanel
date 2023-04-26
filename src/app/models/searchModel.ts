export class SearchModel {
  public pageNo: number;
  public pageSize: number;
  public dateFrom: Date;
  public dateTo: Date;
}

export class CommonSearchModel {
  public pageNo: number;
  public pageSize: number;
  public searchText: string = null;
}
