export interface IController<T, S> {
  getAll(): Promise<T[]>
  getById(id: number): Promise<T | IControllerError>
  create(dto: S): Promise<T | IControllerError>
  update(id: number, dto: S): Promise<T | IControllerError>
  delete(id: number): Promise<void | IControllerError>
}

export interface IControllerError {
  statusCode: number
  message: string
}
