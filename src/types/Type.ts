export default class Type<T> {
  public params: T
  
  constructor(_schema: T){
    this.params = _schema
  }
}